import React from "react";
import {
  ChakraProvider,
  Popover,
  Divider,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import { faGift } from "@fortawesome/free-solid-svg-icons"

import { TikTokVideo } from "./tikTokUnboxingVideoContainer";
import { ProductPriceHistoryGraph } from "./priceHistory";
import { Promotion } from "../api/backendModels";

interface PopoverProps {
  promotion: Promotion,
  setShouldShowUnboxr: () => void,
  isOpen: boolean,
  onClose: () => void
}

export function PopoverContainer(props: PopoverProps) {
  const toggleSettingsPopDown = () => {
    const dropDownSetting = document.getElementById("dropDownSettings");

    if (dropDownSetting.style.display === "") {
      dropDownSetting.style.display = "flex";
    } else dropDownSetting.style.display = "";
  };

  const snoozeOneDay = () => {
    const startSnooze = new Date();
    const startSnoozeUTC = startSnooze.getTime();
    let endOfSnoozeUTC = startSnooze.setDate(startSnooze.getDate() + 1);

    chrome.storage.local.set(
      { snoozeStart: startSnoozeUTC, snoozeEnd: endOfSnoozeUTC },
      () => { }
    );
  };

  return (
    <ChakraProvider>
      <Popover
        placement="top-start"
        trigger="hover"
        isOpen={props.isOpen}
        // isOpen={true}
        onClose={props.onClose}
        arrowSize={50}
      >
        <PopoverContent
          className="popoverContent"
          overflowY="scroll"
          display="block"
          position="fixed"
          width="40vw"
          maxWidth="400px"
          minWidth="300px"
          bottom="12vh"
          right="2.5vw"
          height="80vh"
          css={{
            "&::-webkit-scrollbar": {
              width: "20px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transpert",
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "20px",
              backgroundColor: "rgba(0, 137, 186, .6)",
              opacity: "0.1",
              border: "6px solid transparent",
              backgroundClip: "content-box",
            },
            "::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#a8bbbf",
            },

            ".popoverContent": {
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
              transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
            },

            "&:hover": {
              boxShadow:
                "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
            },
          }}
        >
          <PopoverHeader fontWeight="semibold">
            <div className="headerTitle">Unboxr</div>
          </PopoverHeader>

          <PopoverArrow bg="pink.500" />
          <IconButton
            aria-label="Send email"
            id="settings-icon"
            icon={<SettingsIcon color={"#BBC3BA"} />}
            onClick={() => toggleSettingsPopDown()}
          />

          {showDropDownSettings(props, snoozeOneDay)}

          <PopoverCloseButton color={"#868D85"} />

          {showTabs(props)}
        </PopoverContent>
      </Popover>
    </ChakraProvider>
  );
}
function showDropDownSettings(props: any, snoozeOneDay: () => void) {
  return (
    <div
      id="dropDownSettings"
      style={!props.isOpen ? { display: "none" } : null}
    >
      <ul style={{ padding: "unset", margin: "auto" }}>
        {/* TODO: Create list option to hide popup
                  on specific product page */}

        <li className="listItem">
          <button
            aria-label="Snooze for 24 hours"
            onClick={() => {
              snoozeOneDay();
              // #TODO: Move this one layer up.
              props.setShouldShowUnboxr(false);
            }}
          >
            Snooze for 24 hours
          </button>
        </li>

        {/* TODO: Create list option to snooze popup
                  on specific site/marketplace */}

        <li className="listItem">
          <button
            aria-label="Go to settings"
            onClick={() => {
              chrome.runtime.openOptionsPage();
            }}
          >
            Go to settings
          </button>
        </li>
      </ul>
    </div>
  );
}

function showTabs(props: PopoverProps) {
  return (
    <Tabs isFitted>

      <TabPanels>
        <TabPanel>
          <PopoverBody
            height="1000px"
          >
            <h2>Price trend</h2>
            <ProductPriceHistoryGraph product={props.promotion.product}></ProductPriceHistoryGraph>

            <h2>Unboxing Reel</h2>
            <TikTokVideo videoLink={props.promotion.post_link}></TikTokVideo>
          </PopoverBody>
        </TabPanel>
        <TabPanel>
          <PopoverBody
            height="1000px"
            width="-webkit-fill-available"
            padding="20px"
          >
            <div className="couponsContainer">
              {/* {props.companyWebsite} */}
              <h1>Coupons found!</h1>
              <ul>
                {props.promotion.coupons.map((coupon) => (
                  <li>
                    <div className="couponBorder">
                      <div className="couponContainer">
                        <FontAwesomeIcon icon={faGift} size={"3x"} color="#96c8b6" />
                        <h1>25$ off with Code!</h1>
                        <div className="coupon">
                          {coupon.coupon_code}

                        </div>

                      </div>

                    </div>
                  </li>
                ))}
              </ul>
              {/* {props.couponUrlLink} */}
            </div>
          </PopoverBody>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
