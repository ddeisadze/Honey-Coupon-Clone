import selenium
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
import json

options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')

#THIS INITIALIZES THE DRIVER (AKA THE WEB BROWSER)
driver = webdriver.Chrome(ChromeDriverManager().install(), chrome_options=options)


video_link = ("https://www.tiktok.com/@driggsy/video/7167765831969934634?is_copy_url=1&is_from_webapp=v1&item_id=7167765831969934634")

try:
    driver.get("" + video_link)
except:
    print("Cant connect to link")
# print(driver, "hoho")
# time.sleep(2)


video_descr_div_class_name = "ejg0rhn0"
username_div_class_name ="e17fzhrb1"

product_name = None
tiktok_username = None
vid_description_div = None
try:
    tiktok_username = driver.find_element(By.CLASS_NAME, username_div_class_name).text 
    vid_description_div = driver.find_element(By.CLASS_NAME, video_descr_div_class_name)
except:
    print("cant find username or description div")

# if vid_description_div:
#     try:
#         vid_description_div.find_element(By.CLASS_NAME, "ejg0rhn3").get_attribute("href")
#     except:
#         print("there was an error")

dict = {
    "influencer" : tiktok_username,
    "video_link" : video_link,
    "video_descr" : vid_description_div.text
}

    
print(vid_description_div.text)

print(tiktok_username)


