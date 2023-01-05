import React from 'react';
import {
    ChakraProvider,
    Popover, Divider,
    PopoverContent,
    PopoverHeader,
    PopoverBody, PopoverArrow,
    PopoverCloseButton
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

export function PopoverContainer(props) {
    const toggleSettingsPopDown = () => {
        const dropDownSetting = document.getElementById("dropDownSettings");

        if (dropDownSetting.style.display === '') {
            dropDownSetting.style.display = 'flex';
        } else
            dropDownSetting.style.display = '';

    };

    const snoozeOneDay = () => {
        const startSnooze = new Date();
        const startSnoozeUTC = startSnooze.getTime();
        let endOfSnoozeUTC = startSnooze.setDate(startSnooze.getDate() + 1);

        chrome.storage.local.set({ "snoozeStart": startSnoozeUTC, "snoozeEnd": endOfSnoozeUTC }, () => {
        });
    };

    // WE NEED CODE BELOW IN FUTURE!!!!!

    // root.render(<TikTokVideo videoLink={tikTokVideo} 
    //     // isOpen={isOpen} onOpen={onOpen} onClose={onClose} 
    //     />);
    // console.log(tikTokContainer, "yooyo");
    // document.body.appendChild(tikTokContainer)

    return (
        <ChakraProvider>
            <Popover placement='top-start' trigger="hover" isOpen={props.isOpen} onClose={props.onClose} arrowSize={50}>
                <PopoverContent overflowY="scroll">
                    <PopoverHeader fontWeight='semibold'>
                        Unboxr
                    </PopoverHeader>

                    <PopoverArrow bg='pink.500' />

                    <SettingsIcon id='settings-icon' onClick={() => toggleSettingsPopDown()} />

                    <div id="dropDownSettings" style={!props.isOpen ? { display: "none" } : null}>
                        <ul style={{ padding: "unset", margin: "auto" }}>

                            {/* WE NEED CODE BELOW IN FUTURE!!!!!

                        <li className="listItem">
                            <button aria-label="Hide on this page">
                                Hide on this page
                            </button>
                        </li> */}

                            <li className="listItem">
                                <button aria-label="Snooze for 24 hours" onClick={() => {
                                    snoozeOneDay();
                                    props.setShouldShowUnboxr(false);
                                }}>
                                    Snooze for 24 hours
                                </button>
                            </li>

                            {/* WE NEED CODE BELOW IN FUTURE!!!!!

                        <li className="listItem">
                            <button aria-label="Snooze on this site">
                                Snooze on this site
                            </button>
                        </li> */}

                            <li className="listItem">
                                <button aria-label="Go to settings">
                                    Go to settings
                                </button>
                            </li>
                        </ul>
                    </div>

                    <PopoverCloseButton />

                    <Divider orientation='horizontal' color={"black"} style={{ opacity: 0 }} />

                    <PopoverBody>
                        <iframe
                            src="https://www.tiktok.com/embed/7167765831969934634"
                            scrolling="no"
                            style={{ width: "-webkit-fill-available", height: "-webkit-fill-available" }}
                            allow="encrypted-media;"
                        ></iframe>
                        <div className="coupon">
                            {props.companyWebsite}
                            {props.couponUrlLink}
                        </div>
                    </PopoverBody>

                </PopoverContent>
            </Popover>
        </ChakraProvider>);
}
