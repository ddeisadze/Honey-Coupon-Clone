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
  promotionsArray?: Array<Promotion>;
}

interface Promotion {
  coupons: Array<Object>
}

function getTotalPriceForCart() {
  const grandTotalPriceElement: HTMLSpanElement = document
    .getElementsByClassName("grand-total-price")[0] as HTMLSpanElement;

  let grandTotalPrice = parseFloat(
    grandTotalPriceElement
      .innerText.trim()
      .replace(/[$,]/g, "")
  );
  return grandTotalPrice;
}

export function ApplyCouponsAlert(props: Props) {
  const [isAlertPopoverOpen, setAlertPopover] = useState(true);

  let coupons = [];
  props.promotionsArray.forEach((element) => {
    coupons = coupons.concat(element.coupons);
  });

  const checkIfAmazonCheckoutHasPromoInput = (coupons) => {
    const couponInputElement: HTMLInputElement = document.getElementsByName("claimCode")[0] as HTMLInputElement;
    let initialCartPrice = getTotalPriceForCart();
    let couponCodeThatWorked = null;

    const applyButton: HTMLButtonElement = document.querySelector(
      "span#gcApplyButtonId.a-button.a-button-base"
    ) as HTMLButtonElement;

    if (couponInputElement) {
      let i = 0;

      const processCouponsAndFindWinningPrice = () => {
        if (i < coupons.length) {
          couponInputElement.value = coupons[i].coupon_code;

          applyButton.click();

          let newCartPriceAfterCouponApplied = getTotalPriceForCart();

          if (initialCartPrice > newCartPriceAfterCouponApplied) {
            initialCartPrice = newCartPriceAfterCouponApplied;
            couponCodeThatWorked = coupons[i].coupon_code;
          }
          i++;
          setTimeout(processCouponsAndFindWinningPrice, 1000);
        } else {
          if (couponCodeThatWorked) {
            couponInputElement[0].value = couponCodeThatWorked;

            applyButton.click();
          }
        }
      };

      processCouponsAndFindWinningPrice();
    }
  };

  return coupons.length > 0 ? (
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
