import React, { useEffect, useState } from "react";
import EntryButton from "./popoverEntryButton";
import { PopoverContainer } from "./popoverContent";
import { Promotion } from "../api/backendModels";


interface UnboxingPopoverIconProps {
  promotion: Promotion
}

export function UnboxingPopoverIcon(props: UnboxingPopoverIconProps) {
  const [isPopoverOpen, setPopover] = useState(false);
  const [shouldShowUnboxr, setShouldShowUnboxr] = useState(true);

  const snoozer = async () => {
    let snooze = await isSnoozeOver();
    if (snooze != shouldShowUnboxr) {
      setShouldShowUnboxr(snooze);
    }
  };

  snoozer();

  useEffect(() => {
    if (!shouldShowUnboxr) {
      const alarm = setInterval(async function () {
        let snooze = await isSnoozeOver();
        if (snooze != shouldShowUnboxr) {
          setShouldShowUnboxr(snooze);
          clearInterval(alarm);
        }
        snooze = true;
      }, 1000);
    }
  }, [shouldShowUnboxr]);

  const shouldShowUnboxrFunc = () => {
    if (shouldShowUnboxr) {
      return (
        <>
          <PopoverContainer
            promotion={props.promotion}
            setShouldShowUnboxr={setShouldShowUnboxr}
            isOpen={isPopoverOpen}
            onClose={() => setPopover(false)}
          />
          <EntryButton
            size={150}
            onHoverEnter={() => {
              if (!isPopoverOpen) {
                setPopover(true);
              } else {
                setPopover(false);
              }
            }}
          />
        </>
      );
    } else return null;
  };

  return shouldShowUnboxrFunc();
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
