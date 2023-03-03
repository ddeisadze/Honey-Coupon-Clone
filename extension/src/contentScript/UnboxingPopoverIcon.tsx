import React, { useEffect, useState } from "react";
import EntryButton from "./popoverEntryButton";
import { PopoverContainer } from "./popoverView/popoverContent";
import { Promotion } from "../api/backendModels";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";


interface UnboxingPopoverIconProps {
  promotion: Promotion
}

export function UnboxingPopoverIcon(props: UnboxingPopoverIconProps) {
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();

  // const [shouldShowUnboxr, setShouldShowUnboxr] = useState(true);

  // const snoozer = async () => {
  //   let snooze = await isSnoozeOver();
  //   if (snooze != isOpen) {
  //     onOpen()
  //   }
  // };

  // snoozer();

  // useEffect(() => {
  //   if (!shouldShowUnboxr) {
  //     // const alarm = setInterval(async function () {
  //     //   let snooze = await isSnoozeOver();
  //     //   if (snooze != shouldShowUnboxr) {
  //     //     setShouldShowUnboxr(snooze);
  //     //     clearInterval(alarm);
  //     //   }
  //     //   snooze = true;
  //     // }, 1000);
  //   }
  // }, [shouldShowUnboxr]);
  // onOpen()
  console.log(isOpen)

  return <>
    <ChakraProvider>
      <PopoverContainer
        promotion={props.promotion}
        isOpen={isOpen}
        onClose={onClose}
      />
    </ChakraProvider>

    <EntryButton
      size={150}
      onHoverEnter={onToggle}
    />
  </>
}

async function isSnoozeOver() {
  try {
    let snoozeEnd = null;
    await chrome.storage.local.get("snoozeEnd").then((result) => {
      snoozeEnd = result.snoozeEnd;
    });
    const currentUTC = new Date().getTime();

    return currentUTC >= snoozeEnd;
  } catch {
    console.log("Snooze failed.")
    return true;
  }
}
