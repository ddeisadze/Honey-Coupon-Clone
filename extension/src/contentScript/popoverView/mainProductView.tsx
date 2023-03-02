import { BellIcon } from "@chakra-ui/icons";
import { AspectRatio, Box, Button, Grid, GridItem, IconButton, Image, StackDivider, Text, useToast, VStack } from "@chakra-ui/react";
import { ProductPriceHistoryGraph } from "../priceHistory";
import React, { useEffect, useState } from 'react'
import { TikTokVideo } from "../tikTokUnboxingVideoContainer";
import { clearAuthToken, getAuthToken, isUserLoggedIn } from "../../utility/auth";
import { AlertTypeEnum, getAlertForUserByAsin, sendSubsribeToProductDiscount } from "../../api/backendRequests";
import { Promotion } from "../../api/backendModels";


interface MainProductViewProps {
    promotion: Promotion
}

export function MainProductView(props: MainProductViewProps) {
    const toast = useToast();

    let post_login_action: Function = null;

    const [isUserSubscribedToCurrentProduct, setIsUserSubscribedToCurrentProduct] = useState(false);

    useEffect(() => {
        console.log("useaffect")
        chrome?.runtime?.onMessage.addListener((e: OnLoginMessageToExtension) => {

            console.log(e, "asdasds")
            if (e.type == "login" && e.status == "successful") {
                return toast({
                    title: 'Subscribed',
                    description: "You will recieve future discounts for this product",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })

                post_login_action?.call({});
            } else if (e.type == "login" && e.status == "unsuccessful") {
                return toast({
                    title: 'Failed to login',
                    description: "Try again. If issue persists, please contact us!",
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                })
            }
        });

        const product_asin = props.promotion.product.product_ids.filter(t => t.product_id_type == "asin")[0].product_id_value;

        getAlertForUserByAsin(product_asin).then(e => {
            console.log("alert for users", e)
            // if (!e) {
            //     return setIsUserSubscribedToCurrentProduct(false)
            // }

            return setIsUserSubscribedToCurrentProduct(true)
        }).catch(e => {
            setIsUserSubscribedToCurrentProduct(false)
            console.log(e, "getAlertForUserByAsin")
        })
    }, [])

    const onWatchForCouponsClick = async (e) => {

        console.log("logged in", await isUserLoggedIn())
        console.log("auth token ", await getAuthToken())

        if (!await isUserLoggedIn()) {
            const response = await chrome.runtime.sendMessage({ type: "login" })

            post_login_action = onWatchForCouponsClick;
            return; // event listener will pickup login response message
        }

        sendSubsribeToProductDiscount({
            alert_type: AlertTypeEnum.NCP,
            product: {
                product_id_type: "asin",
                product_id_value: "B0BCWNQPQ7"
            }
        }).then(e => {

            setIsUserSubscribedToCurrentProduct(true)

        }).catch()
    }

    return <>
        <VStack
            divider={<StackDivider borderColor='gray.200' />}
            spacing={4}
            align='stretch'>

            <Box>
                <Grid
                    h='100px'
                    templateRows='repeat(3)'
                    templateColumns='repeat(6)'
                    gap={4}
                >
                    <GridItem rowSpan={2} colSpan={2}>
                        <Image boxSize='100px' fit="contain" src={props.promotion.product.product_images[0].image_url} alt='Dan Abramov' />
                    </GridItem>

                    <GridItem rowSpan={1} colSpan={2}>
                        <Text fontSize='md' align="center">{props.promotion.product.product_name}</Text>
                    </GridItem>

                    <GridItem rowSpan={1} colSpan={1} rowStart={2} colStart={3}>
                        <Text fontSize='xs'>Sign up for coupon alerts! There is a chance you can save $80 from coupons.</Text>
                    </GridItem>

                    <GridItem rowStart={2} colStart={4}>
                        <IconButton
                            aria-label="coupon-alert"
                            variant='outline'
                            color='orange.400'
                            icon={<BellIcon />}></IconButton>
                    </GridItem>

                </Grid>

                <Box padding="10px" border="1px" borderColor='gray.100' borderRadius="5px" marginTop="10px" bg="gray.50">
                    <ProductPriceHistoryGraph product={props.promotion.product}></ProductPriceHistoryGraph>
                    {isUserSubscribedToCurrentProduct ?
                        <Button width="100%" marginTop="10px" disabled color='orange.400' bg={'white'} variant='outline'>Subscribed for coupons already!</Button> :
                        <Button onClick={onWatchForCouponsClick} width="100%" marginTop="10px" leftIcon={<BellIcon />} color='orange.400' bg={'white'} variant='outline'>Watch for Coupons</Button>}
                </Box>
            </Box>

            <Box>
                <Text fontSize='md'>Unboxing Reel</Text>
                <AspectRatio maxW='350px' ratio={0.7}>

                    <TikTokVideo videoLink={props.promotion.post_link}></TikTokVideo>
                </AspectRatio>

            </Box>
        </VStack>
    </>
}