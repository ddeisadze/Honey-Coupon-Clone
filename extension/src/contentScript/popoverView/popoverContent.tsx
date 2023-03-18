import React, { } from "react";
import {
  Popover,
  PopoverContent,
  PopoverBody,
  IconButton,
  PopoverHeader,
  PopoverCloseButton,
  useDisclosure,
  PopoverArrow
} from "@chakra-ui/react";


import { Promotion } from "../../api/backendModels";
import { MainProductView } from "./mainProductView";
import { SettingsIcon } from "@chakra-ui/icons";
import { clearAuthToken } from "../../utility/auth";

interface PopoverProps {
  promotion: Promotion,
  isOpen: boolean,
  onClose: () => void
}

// const isTest = localStorage.getItem('ENVIRONMENT') != null;
const isTest = null;

export function PopoverContainer(props: PopoverProps) {

  const { isOpen, onToggle, onClose } = useDisclosure({
    isOpen: isTest ?? props.isOpen,
  })

  const snoozeOneDay = () => {
    const startSnooze = new Date();
    const startSnoozeUTC = startSnooze.getTime();
    let endOfSnoozeUTC = startSnooze.setDate(startSnooze.getDate() + 1);

    chrome.storage.local.set(
      { snoozeStart: startSnoozeUTC, snoozeEnd: endOfSnoozeUTC },
      () => { }
    );
  };

  console.log(isOpen, "open")

  const toggleSettingsPopDown = () => {
    const dropDownSetting = document.getElementById("dropDownSettings");

    if (dropDownSetting.style.display === "") {
      dropDownSetting.style.display = "flex";
    } else dropDownSetting.style.display = "";
  };

  return <>
    <Popover
      placement="top-start"
      // trigger="hover"
      isOpen={isOpen}
      onClose={props.onClose}
      arrowSize={50}
      closeOnBlur={false}

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


        <PopoverHeader fontWeight='semibold'>Confirmation</PopoverHeader>

        <IconButton
          variant='ghost'
          aria-label="Send email"
          id="settings-icon"
          onClick={() => toggleSettingsPopDown()}
          icon={<SettingsIcon color="#BBC3BA" />}
        // onClick={onToggle}
        />
        {showDropDownSettings()}
        <PopoverCloseButton />
        <PopoverBody>
          <MainProductView promotion={props.promotion} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  </>
}

function showDropDownSettings() {
  return (
    <div
      id="dropDownSettings"
      style={{
        backgroundColor: "white",
        zIndex: 1000000,
        position: "absolute"
      }}
    // style={!props.isOpen ? { display: "none" } : null}
    >
      <ul style={{ padding: "unset", margin: "auto" }}>
        {/* TODO: Create list option to hide popup
                  on specific product page */}

        <li className="listItem">
          <button
            aria-label="Snooze for 24 hours"
          // onClick={() => {
          //   snoozeOneDay();
          //   // #TODO: Move this one layer up.
          //   props.setShouldShowUnboxr(false);
          // }}
          >
            Snooze for 24 hours
          </button>
        </li>

        <li className="listItem">
          <button
            onClick={async () => {
              await clearAuthToken()
              console.log(await chrome.storage.sync.get("unboxr_auth"))
            }}
            aria-label="Clear Auth Token"
          >
            Clear Auth Token
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