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
  Divider,
} from "@chakra-ui/react";
import Logo from "../svg/logo.svg";
import Lottie from "lottie-react";
import piggieLottie from "../assets/piggieLottie.json";

interface Props {
  dataArray?: Array<Object>;
  
}

export function ApplyCouponsAlert(props:Props) {
  const [isAlertPopoverOpen, setAlertPopover] = useState(true);
  const cancelRef = React.useRef();
  const lottieRef = React.useRef();
  const [isLoop, setLoop] = useState(true);

  console.log(typeof(props.dataArray), "fammmmmmfammmm");
  console.log(props.dataArray)
  // const logo = require('../../images/logo.svg')
  // console.log(logo, "ayp");
  console.log('ayoo');

  let coupons = []
  
  props.dataArray.forEach(element => {
    console.log("hahah");
    
    console.log(element);
    coupons = coupons.concat(element.coupons)
    
  })
  console.log(coupons, "coupons");
  


  const checkIfAmazonCheckoutHasPromoInput = (coupons) => {
    const input = document.getElementsByName("claimCode");

    if (input) {
      let i = 0;
      const loop = () => {
          if (i < coupons.length) {
              input[0].value = coupons[i].coupon_code;
              var applyButton = document.querySelector(
                  "span#gcApplyButtonId.a-button.a-button-base"
              );
              applyButton.click();
              i++;
              setTimeout(loop, 1000);
          }
      }
    loop();

//       coupons.forEach((element, index) => {
//         input[0].value = element.coupon_code;
//         var applyButton = document.querySelector(
//           "span#gcApplyButtonId.a-button.a-button-base"
//         );
//         applyButton.click();
//         if(index !== coupons.length -1 ){
//           console.log("jokjokjokjokjok");
          
//             setTimeout(()=>{},1000)
//         }   
// });



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
            <PopoverHeader
              pt={4}
              fontWeight="bold"
              border="0"
              padding="4px"
              paddingBottom="5px"
            >
              <Logo viewBox="110 110 160 130" height="45" width="45px" />
            </PopoverHeader>
            {/* <Divider/> */}
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
                <Lottie animationData={piggieLottie} />
                {/* </div> */}
              </div>
              <div className="rightBody"
                style={{marginLeft: '10px'}}
              >
                <div
                  className="coupons"
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    border: " 2px dashed",
                  }}
                >
                  <h1 style={{ fontSize: "25px" }}>2 Coupons Found!</h1>
                </div>

                <div className="buttonContainer"
                style={{
                  display: 'flex',
                  flexDirection: 'row'
                }}
                >
                <Button
                  colorScheme="pink"
                  onClick={() => checkIfAmazonCheckoutHasPromoInput(coupons)}
                  width="150px"
                  marginTop='15px'
                >
                  Apply Coupons!
                </Button>
                <Button
                  colorScheme="white"
                  color='black'
                  onClick={() => setAlertPopover(false)}
                  width="100px"
                  marginTop='15px'
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
  );
}
