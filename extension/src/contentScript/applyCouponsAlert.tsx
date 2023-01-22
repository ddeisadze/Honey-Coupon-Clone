import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button,
  ChakraProvider,
} from "@chakra-ui/react";
import Logo from "../svg/logo.svg";
import Lottie from "lottie-react";
import piggyBank from "../assets/piggyBank.json";


export function ApplyCouponsAlert(props) {
  const [isAlertPopoverOpen, setAlertPopover] = useState(true);
  const cancelRef = React.useRef();
  const lottieRef = React.useRef();
  const [isLoop, setLoop] = useState(true);

  console.log(props.dataArray, "fammmmmmfammmm");
  // const logo = require('../../images/logo.svg')
  // console.log(logo, "ayp");

  const checkIfAmazonCheckoutHasPromoInput = () => {
    const input = document.getElementsByName("claimCode");

    if (input) {
      input[0].value = "Hello, World!";
      var applyButton = document.querySelector(
        "span#gcApplyButtonId.a-button.a-button-base"
      );
      applyButton.click();
    }
  };

  return (
    <>
      <ChakraProvider>
        <Popover
          onClose={() => setAlertPopover(false)}
          isOpen={isAlertPopoverOpen}
          closeOnBlur={false}
        >
          <PopoverContent
            position={"fixed"}
            css={{
              "&": {
                boxShadow: "1px 1px 6px rgb(0 0 0 / 30%) !important",
                top: "17px",
                right: "17px",
                width: "420px",
                height: "225px",
              },
            }}
          >
            <PopoverHeader pt={4} fontWeight="bold" border="0" padding="4px">
              <Logo viewBox="110 110 160 130" height="45" width="45px" />
            </PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody
              css={{
                "&": {
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "row",
                },
              }}
            >
              <div className="leftBody">
                {/* <div id="piggieButton" > */}
                  <Lottie
                    animationData={piggyBank}
                 


                  />
                {/* </div> */}
              </div>
              <div className="rightBody">
                <div className="coupons">
                  <h2>2 Coupons Found!</h2>
                </div>

                <Button
                  colorScheme="pink"
                  onClick={checkIfAmazonCheckoutHasPromoInput}
                >
                  Apply Coupons!
                </Button>
              </div>
            </PopoverBody>
            <PopoverFooter
              border="0"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              pb={4}
            ></PopoverFooter>
          </PopoverContent>
        </Popover>
      </ChakraProvider>
    </>
  );
}
