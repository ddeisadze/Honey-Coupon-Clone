import React, { useEffect, useState } from 'react';
import EntryButton from './entryButton';
import { PopoverContainer } from "./PopoverContainer";

export function MainUnboxingEntryPoint(props) {
    const [isPopoverOpen, setPopover] = useState(false);
    const [shouldShowUnboxr, setShouldShowUnboxr] = useState(true);

    const snoozer = async () => {
        let snooze = await checkIfSnoozeIsOver();
        if (snooze != shouldShowUnboxr) {
            setShouldShowUnboxr(snooze);

        }
    };
    snoozer();
    useEffect(() => {
        if (!shouldShowUnboxr) {
            const alarm = setInterval(async function () {
                let snooze = await checkIfSnoozeIsOver();
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
            return <>
                <PopoverContainer couponCode={props.couponCode} setShouldShowUnboxr={setShouldShowUnboxr} companyWebsite={props.companyWebsite} couponUrlLink={props.couponUrlLink} isOpen={isPopoverOpen} onClose={() => setPopover(false)} />
                <EntryButton size={150} onHoverEnter={() => { if (!isPopoverOpen){setPopover(true)}
                                                              else {setPopover(false)}}} />
            </>;
        } else
            return null;
    };
    return shouldShowUnboxrFunc();

}
async function checkIfSnoozeIsOver() {
    let snoozeEnd = null;
    await chrome.storage.local.get("snoozeEnd").then((result) => {
        snoozeEnd = result.snoozeEnd;
    });
    const currentUTC = new Date().getTime();

    return currentUTC >= snoozeEnd;
}
