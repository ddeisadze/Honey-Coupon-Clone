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

export function ApplyCouponsAlert(props) {
  const [isAlertPopoverOpen, setAlertPopover] = useState(true);
  const cancelRef = React.useRef();

  console.log(props.dataArray, "fammmmmmfammmm");
  

  const checkIfAmazonCheckoutHasPromoInput = () => {
    const input = document.getElementsByName("claimCode")


    if (input) {
        input[0].value = "Hello, World!";
        var applyButton = document.querySelector("span#gcApplyButtonId.a-button.a-button-base");
        applyButton.click();
        
    }
    
}

  return (
    <>
      <ChakraProvider>
      <Popover
      onClose={() => setAlertPopover(false)}
      isOpen={isAlertPopoverOpen}
      closeOnBlur={false}
      
    >
      <PopoverContent position={'fixed'}
        css={{
          "&": {
            boxShadow: '1px 1px 6px rgb(0 0 0 / 30%) !important',
            top: '17px',
            right: '17px',
            width: '500px',
            height: '290px',
          },
        
        }}
      >
        <PopoverHeader pt={4} fontWeight='bold' border='0'>
          Manage Your Channels
        </PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody>
          2 Coupons Found
          <Button colorScheme='pink' onClick={checkIfAmazonCheckoutHasPromoInput} >Apply Coupons!</Button>

        </PopoverBody>
        <PopoverFooter
          border='0'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          pb={4}
        >
        </PopoverFooter>
      </PopoverContent>
    </Popover>
      </ChakraProvider>
    </>
  );
}

