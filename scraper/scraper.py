import selenium
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
import json
import os
import uuid
import logging
from datetime import datetime
from selenium.webdriver.remote.remote_connection import LOGGER
LOGGER.setLevel(logging.WARNING)


class ParsingExceptionDueToSelector(Exception):
    def __init__(self, selector, url, field, message, exception=None):
        self.selector = selector
        self.url = url
        self.field = field
        self.message = message
        self.exception = exception

    def __str__(self):
        return f"Unable to find {self.field} in {self.url} using selector {self.selector}. Error: {self.message}. Base Exception: {self.exception}"


class ParsingExceptionDueToUrl(Exception):
    def __init__(self, url, message, exception=None):
        self.url = url
        self.message = message
        self.exception = exception

    def __str__(self) -> str:
        return f"Unable to get {self.url}. Error: {self.message}. Base Exception: {self.exception}"


def initializeDriver():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument("--disable-crash-reporter")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-in-process-stack-traces")
    options.add_argument("--disable-logging")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--log-level=3")
    options.add_argument("--output=/dev/null")

    # THIS INITIALIZES THE DRIVER (AKA THE WEB BROWSER)
    driver = webdriver.Chrome(
        ChromeDriverManager().install(), chrome_options=options)

    return driver


def extractBasicsFromTikTokVideo(driver, tiktok_video_url):
    try:
        driver.get(tiktok_video_url)
    except Exception as e:
        raise ParsingExceptionDueToUrl(
            url=tiktok_video_url, message="Unable to get url", exception=e)

    video_descr_div_class_name = "ejg0rhn0"
    username_div_class_name = "e17fzhrb1"

    try:
        tiktok_username = driver.find_element(
            By.CLASS_NAME, username_div_class_name).text
    except Exception as e:
        raise ParsingExceptionDueToSelector(
            selector=username_div_class_name, url=tiktok_video_url, field="username", message="Unable to find username div", exception=e)

    try:
        vid_description_div = driver.find_element(
            By.CLASS_NAME, video_descr_div_class_name)
    except Exception as e:
        raise ParsingExceptionDueToSelector(
            selector=video_descr_div_class_name, url=tiktok_video_url, field="video description", exception=e)

    return {
        "influencer": tiktok_username,
        "video_link": tiktok_video_url,
        "video_descr": vid_description_div.text
        # "html": driver.page_source
    }


def main():
    driver = initializeDriver()
    video_links = [
        "https://www.tiktok.com/@driggsy/video/7182239723006463275?is_copy_url=1&is_from_webapp=v1",
        "https://www.tiktok.com/@ampere_technology/video/7125435518439132462?is_copy_url=1&is_from_webapp=v1",
        "https://www.tiktok.com/@ampere_technology/video/7093886101546454315?is_copy_url=1&is_from_webapp=v1",
        "https://www.tiktok.com/@driggsy/video/7180058726815059243?is_copy_url=1&is_from_webapp=v1",
        "https://www.tiktok.com/@driggsy/video/7178135320138026286?is_copy_url=1&is_from_webapp=v1",
        "https://www.tiktok.com/@driggsy/video/7175166251935845674?is_copy_url=1&is_from_webapp=v1",
        "https://www.tiktok.com/@driggsy/video/7167765831969934634?is_copy_url=1&is_from_webapp=v1",
        "https://www.tiktok.com/@driggsy/video/7165168500401638698?is_copy_url=1&is_from_webapp=v1",
        "https://www.tiktok.com/@driggsy/video/7163728348856962346?is_copy_url=1&is_from_webapp=v1",
        "https://www.tiktok.com/@driggsy/video/7162607210609052971?is_copy_url=1&is_from_webapp=v1",
        "https://www.tiktok.com/@driggsy/video/7157361832716619054?is_copy_url=1&is_from_webapp=v1",
        "https://www.tiktok.com/@driggsy/video/7136584722578246954?is_copy_url=1&is_from_webapp=v1",
        "https://www.tiktok.com/@driggsy/video/7115826504864451882?is_copy_url=1&is_from_webapp=v1"
    ]

    data = []

    for link in video_links:
        data_object = {
            "link": link,
            "is_successful": False,
            "error": None,
            "error_screenshot": None,
            "data": None
        }

        try:
            video_link = link
            extracted_data = extractBasicsFromTikTokVideo(driver, video_link)
            data_object["is_successful"] = True
            data_object["data"] = extracted_data
        except Exception as e:
            # take screenshot using driver save it to file and then upload it to s3
            data_object["error"] = str(e)

            uuid_str = str(uuid.uuid4())
            dir_path = os.path.dirname(os.path.abspath(__file__))
            screenshot_path = os.path.join(dir_path, "screenshots")
            isExist = os.path.exists(screenshot_path)
            if not isExist:
                os.makedirs(screenshot_path)
                print("The new directory is created!")
            screenshot_file_path = f"{screenshot_path}/{uuid_str}.png"
            a = driver.save_screenshot(screenshot_file_path)
            driver.close()
            print(e)

            data_object["error_screenshot"] = screenshot_file_path
        data.append(data_object)

    file_name_date = datetime.now().strftime("%Y%m%d-%H%M%S")
    # write data to file
    with open(f"data-{file_name_date}.json", "w") as f:
        json.dump(data, f, indent=4)


if __name__ == "__main__":
    main()
