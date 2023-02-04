import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverCloseButton,
  Button,
  ChakraProvider,
} from "@chakra-ui/react";
import Logo from "../svg/logo.svg";
import Lottie from "lottie-react";
import piggieLottie from "../assets/piggieLottie.json";

interface Props {
  dataArray?: Array<Object>;
}

export function ApplyCouponsAlert(props: Props) {
  const [isAlertPopoverOpen, setAlertPopover] = useState(true);

  let coupons = [];
  console.log(props.dataArray, props.dataArray.length)
  props.dataArray.forEach((element) => {
    coupons = coupons.concat(element.coupons);
  });

  const checkIfAmazonCheckoutHasPromoInput = (coupons) => {
    const input = document.getElementsByName("claimCode");
    let grandTotalPrice = parseFloat(
      document
        .getElementsByClassName("grand-total-price")[0]
        .innerText.trim()
        .replace(/[$,]/g, "")
    );
    let couponCodeThatWorked = null;
    const applyButton = document.querySelector(
      "span#gcApplyButtonId.a-button.a-button-base"
    );

    if (input) {
      let i = 0;

      const loop = () => {
        if (i < coupons.length) {
          input[0].value = coupons[i].coupon_code;

          applyButton.click();
          let checkGrandTotalPrice = parseFloat(
            document
              .getElementsByClassName("grand-total-price")[0]
              .innerText.trim()
              .replace(/[$,]/g, "")
          );

          if (grandTotalPrice > checkGrandTotalPrice) {
            grandTotalPrice = checkGrandTotalPrice;
            couponCodeThatWorked = coupons[i].coupon_code;
          }
          i++;
          setTimeout(loop, 2000);
        } else {
          if (couponCodeThatWorked) {
            input[0].value = couponCodeThatWorked;

            applyButton.click();
          }
        }
      };
      loop();
    }
  };

  return  coupons.length > 0 ? (
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
            <PopoverHeader
              pt={4}
              fontWeight="bold"
              border="0"
              padding="4px"
              paddingBottom="5px"
            >
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
                <Lottie animationData={piggieLottie} />
              </div>
              <div className="rightBody" style={{ marginLeft: "10px" }}>
                <div
                  className="coupons"
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    border: " 2px dashed",
                  }}
                >
                  <h1 style={{ fontSize: "25px" }}>{coupons.length} Coupons Found!</h1>
                </div>

                <div
                  className="buttonContainer"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Button
                    colorScheme="pink"
                    onClick={() => checkIfAmazonCheckoutHasPromoInput(coupons)}
                    width="150px"
                    marginTop="15px"
                  >
                    Apply Coupons!
                  </Button>
                  <Button
                    colorScheme="white"
                    color="black"
                    onClick={() => setAlertPopover(false)}
                    width="100px"
                    marginTop="15px"
                  >
                    Try Later!
                  </Button>
                </div>
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
  ) : null
}
