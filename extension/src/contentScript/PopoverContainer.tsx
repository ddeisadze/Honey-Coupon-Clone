import React from 'react';
import {
    ChakraProvider,
    Popover, Divider,
    PopoverContent,
    PopoverHeader,
    PopoverBody, PopoverArrow,
    PopoverCloseButton,
    IconButton,
    Tabs, TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign } from '@fortawesome/free-solid-svg-icons' 
import { faPlayCircle } from '@fortawesome/free-regular-svg-icons' 
import confettiLottie from '../assets/confetti.json'
import Lottie from "lottie-react";

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
            <Popover placement='top-start' trigger="hover" isOpen={props.isOpen} onClose={props.onClose} arrowSize={50}  >
                <PopoverContent className="idky" overflowY="scroll" 
                                display="block" 
                                position="fixed" 
                                width="20.5vw"                             
                                bottom="12vh"
                                right="2.5vw"
                                height="80vh"
                                // border=".2rem solid #0089BA !important"
                                css={{
                                    '&::-webkit-scrollbar': {
                                      width: '20px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        backgroundColor: "transpert",

                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                      borderRadius: '20px',
                                      backgroundColor: 'rgba(0, 137, 186, .6)',
                                      opacity: '0.1',
                                      border: "6px solid transparent",
                                      backgroundClip: "content-box",
                                    
                                    },
                                    '::-webkit-scrollbar-thumb:hover': {
                                        backgroundColor: "#a8bbbf",
                                      },
                                    
                                        '.idky' :
                                        {boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                                        transition: "all 0.3s cubic-bezier(.25,.8,.25,1)"
                                    },
                                    
                                      
                                     '&:hover':
                                        {
                                        boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
                                    }
                                      
                                  }}
                                >
                    <PopoverHeader fontWeight='semibold'>
                        <div className="headerTitle">Unboxr</div>
                    </PopoverHeader>

                    <PopoverArrow bg='pink.500' />
                    <IconButton
                    // variant='link'
                    // colorScheme='#a7a7a7' 
                    aria-label='Send email'
                    id='settings-icon'
                    icon={<SettingsIcon color={"#BBC3BA"} onClick={() => toggleSettingsPopDown()}/>}
                    />
                    {/* <SettingsIcon id='settings-icon' onClick={() => toggleSettingsPopDown()} /> */}

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
                                <button aria-label="Go to settings" onClick={() => {chrome.runtime.openOptionsPage();}}>
                                    Go to settings
                                </button>
                            </li>
                        </ul>
                    </div>

                    <PopoverCloseButton color={"#868D85"} />

                    {/* <Divider orientation='horizontal' style={{ backgroundColor: "#00B9FF", height: 1.5 }} /> */}

                    <Tabs isFitted> 
                        <TabList>
                            <Tab >
                                <FontAwesomeIcon icon={faPlayCircle} size={"xl"} color="#00B9FF" />

                            </Tab> 
                            <Tab>
                                <FontAwesomeIcon icon={faDollarSign} size={"xl"} color="#26850F" />
                            </Tab>
                            {/* <Tab>Three</Tab> */}
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                            <PopoverBody height="1000px" width="-webkit-fill-available" padding="20px">
                            {/* <Lottie style={{ position: "absolute"}}
                                // onMouseLeave={onMouseExit}
                                // onMouseEnter={onMouseEnter}

                                // lottieRef={lottieRef}
                                animationData={confettiLottie}
                                initialSegment={[16, 100]}
                                autoplay={false}
                                // loop={isLoop}
                            /> */}
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
                        </TabPanel>
                            <TabPanel>
                            <PopoverBody height="1000px" width="-webkit-fill-available" padding="20px">
                        <div className="coupon">
                            {props.companyWebsite}
                            {props.couponUrlLink}
                        </div>
                    </PopoverBody>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>

                </PopoverContent>
            </Popover>
        </ChakraProvider>);
}
