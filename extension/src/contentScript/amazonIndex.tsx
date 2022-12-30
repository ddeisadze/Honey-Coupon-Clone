import React, {useState} from 'react';
import { createRoot } from 'react-dom/client';
import EntryButton from './entryButton';
import { TikTokVideo } from './TikTokVideo';
import '../cssFiles/popup.css'
import {
    useDisclosure,
    
} from "@chakra-ui/react"

import {
    ChakraProvider,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
  } from '@chakra-ui/react'

window.onload = () => {

    // check if amazon product page
    const isAmazonProductPage = () => {
        if (document.getElementById("productTitle")) {
            return true;
        }
        return false;
    }

    if (isAmazonProductPage()) {
        loadElementsForProductPage(false);
    } else {
        // other amazon pages
        loadElementsForProductPage(true);

    }
};

function loadElementsForProductPage(test:boolean) {
    // const { isOpen, onOpen, onClose } = useDisclosure()



    const windowUrl = window.location.href;
    const tikTokContainer = document.createElement('div');
    console.log(tikTokContainer, "yooyoo");
    console.log("asdasdadasaadasdadasdasdasdasd");
    
    
    tikTokContainer.setAttribute("id", "tikTokContainer")
    // tikTokContainer.style.display = 'none'
    
    

    if (!tikTokContainer) {
        throw new Error("Could not create app container");
    }

    const lottieContainer = document.getElementById("lottieContainer")

    

    // lottieContainer.addEventListener('mouseenter', (event) => {        
    //     tikTokContainer.style.display = 'block'

    // })

    // tikTokContainer.addEventListener('mouseleave', (event) => {
    //     tikTokContainer.style.display = 'none'

    // })

    const root = createRoot(tikTokContainer);

    const extractedProductInfo = test? null : extractProductInformationFromAmazonPage();

    console.log(extractedProductInfo);

    const testProductInfo : amazonProductAttributes = {
        "asin": "B0BCWNQPQ7",
        "priceInDollarsAndCents": "$799.99",
        "description": "               <hr>\n                            <h1 class=\"a-size-base-plus a-text-bold\"> About this item </h1>       <ul class=\"a-unordered-list a-vertical a-spacing-mini\">   <li><span class=\"a-list-item\"> Laser Engine Powers High Brightness: Stop squinting and just lean back to enjoy your favorite content with a laser light source—displaying 300 ISO Lumens of brightness in 1080p HD.  </span></li>  <li><span class=\"a-list-item\"> Fits in Your Hand: Wherever you need to go, Capsule 3 Laser is easy to pack up or just hold—weighing only 2 lb (900 g). The portable projector is 90% smaller than others with similar brightness.  </span></li>  <li><span class=\"a-list-item\"> Play Videos for 2.5 Hours: Yes, you can finish a long movie without worrying about power thanks to the 52Wh built-in battery. CAIC technology uses every pixel to conserve energy.  </span></li>  <li><span class=\"a-list-item\"> Switch Up Your Entertainment: Whether you're a cinephile or a gamer, Android TV 11.0 gives you abundant options for fun—no matter the situation. And the portable projector works with the Google Assistant and Chromecast. Download Netflix from Nebula Play,Use the Nebula Connect app on your phone to control Netflix on the projector.  </span></li>  <li><span class=\"a-list-item\"> Let Your Ears Connect: Perk up your ears with the clash of swords or an intimate whisper with the powerful 8W Dolby Digital speaker—featuring realistic, high-fidelity sound on the portable projector.  </span></li>  </ul> <!-- Loading EDP related metadata -->\n               <span class=\"edp-feature-declaration\" data-edp-feature-name=\"featurebullets\" data-edp-asin=\"B0BCWNQPQ7\" data-data-hash=\"1476201698\" data-defects=\"[{&quot;id&quot;:&quot;defect-mismatch-info&quot;,&quot;value&quot;:&quot;Different from product&quot;},{&quot;id&quot;:&quot;defect-missing-information&quot;,&quot;value&quot;:&quot;Missing information&quot;},{&quot;id&quot;:&quot;defect-unessential-info&quot;,&quot;value&quot;:&quot;Unimportant information&quot;},{&quot;id&quot;:&quot;defect-other-productinfo-issue&quot;,&quot;value&quot;:&quot;Other&quot;}]\" data-metadata=\"CATALOG\" data-feature-container-id=\"\" data-custom-event-handler=\"\" data-display-name=\"Bullet Points\" data-edit-data-state=\"featureBulletsEDPEditData\" data-position=\"\" data-resolver=\"CQResolver\"></span>         <span class=\"caretnext\">›</span> <a id=\"seeMoreDetailsLink\" class=\"a-link-normal\" href=\"#productDetails\">See more product details</a>       ",
        "title": "        Nebula Anker Capsule 3 Laser 1080p, Smart, Wi-Fi, Mini Projector, Black, Portable Projector, Dolby Digital, Laser Projector, Autofocus, 120-Inch Picture, Built-in Battery, 2.5 Hours of Playtime       ",
        "websiteAddress": "https://www.amazon.com/dp/B0BCWNQPQ7?maas=maas_adg_api_8014460300101_static_12_26&ref_=aa_maas&aa_campaignid=capule3_launch-B0BCWNQPQ7-inf_tt-US&aa_adgroupid=seenebula_&aa_creativeid=US-ZMB3q1fkYb-projector&projector=1"
    }
    

    const doWeHaveEnoughProductInfoToFindPromotion = () => {
        return test? null:extractedProductInfo.asin;
    }

    if (doWeHaveEnoughProductInfoToFindPromotion() || test) {
        console.log("hahaah");
        
        const argument = test? testProductInfo : extractedProductInfo
        console.log(argument, "jkjkjkjk");
        
        sendSearchForInfluencerRequest(argument).then(data => {
            console.log(argument, "yooyoy");
            
            console.log(data, "check response")

            const tikTokVideo = data.post_link;

            // root.render(<TikTokVideo videoLink={tikTokVideo} 
            //     // isOpen={isOpen} onOpen={onOpen} onClose={onClose} 
            //     />);
            // console.log(tikTokContainer, "yooyo");
            
            // document.body.appendChild(tikTokContainer)
            injectUnboxrButton();
        }).catch(err => console.log(err))
        

    } else {
        console.log("Could not match regex for asin in url. ", extractedProductInfo, windowUrl);
    }

    
    

}

interface amazonProductAttributes {
    asin?: string,
    priceInDollarsAndCents?: string,
    description?: string,
    title?: string,
    websiteAddress?: string
}

async function sendSearchForInfluencerRequest(extractedProductInfo: amazonProductAttributes) {
    const generateRequestBodyForPromotionSearch = () => {
        return {
            "product_id_type": "asin",
            "product_id_value": extractedProductInfo.asin,
            "product_name": extractedProductInfo.title,
            "company_website": extractedProductInfo.websiteAddress,
            "product_price": extractedProductInfo.priceInDollarsAndCents,
            "product_page": extractedProductInfo.websiteAddress,
            "product_description": extractedProductInfo.description
        };
    };

    const controller = new AbortController()

    // 5 second timeout:
    const timeoutId = setTimeout(() => controller.abort(), 5000)


    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generateRequestBodyForPromotionSearch()),
        signal: controller.signal
    };

    return await fetch("http://127.0.0.1:8000/", requestOptions)
        .then(response => response.json())
        .then(data => Promise.resolve(data))
        .catch(err => {
            Promise.reject(err);
            console.log(err, "err");
        });
}

function extractProductInformationFromAmazonPage(): amazonProductAttributes {
    const windowUrl = window.location.href;
    const asinFromUrl = windowUrl.match("(?:[/dp/]|$)([A-Z0-9]{10})");
    const wholePriceDollar = document.getElementsByClassName("a-offscreen")[0].textContent;
    const description = document.getElementById("feature-bullets")?.innerHTML;
    const productTitle = document.getElementById("productTitle")?.innerHTML;

    const productAttributes: amazonProductAttributes = {
        asin: asinFromUrl[1] ?? asinFromUrl[0], // element at index 1 does is clean of symbols
        priceInDollarsAndCents: wholePriceDollar,
        description: description,
        title: productTitle,
        websiteAddress: windowUrl
    };

    return productAttributes;
}

function PopoverContainer(props){

    const astyle = {
        "padding": "20px",
        "display": "block",
        "position": "fixed",
        "bottom": "14%",
        "right": "40px",
        "height": "fit-content",
        "width": "fit-content"
    }

    return (<ChakraProvider >
        {/* <div id="tikTokContainer"> */}
        <Popover  placement='top-start' trigger="hover" isOpen={props.isOpen} onClose={props.onClose} arrowSize={50}  >
            {/* <PopoverTrigger >
                {/* <Button>Click me</Button> }
                <div id="lottieContainer2" >
                    <EntryButton size={100} />
                </div>
            </PopoverTrigger> */}
            {/* <PopoverTrigger>
            </PopoverTrigger> */}
            <PopoverContent overflowY="scroll">
                <PopoverHeader fontWeight='semibold'>Unboxr</PopoverHeader>
                <PopoverArrow bg='pink.500'/>
                <PopoverCloseButton />
                <PopoverBody>
                <iframe
                    src="https://www.tiktok.com/embed/7167765831969934634"
                    scrolling="no"
                    style={{ width: "-webkit-fill-available", height: "-webkit-fill-available" }}
                    allow="encrypted-media;"
                ></iframe>
                </PopoverBody>
            </PopoverContent>
        </Popover>
        {/* </div> */}
            
        </ChakraProvider>);
}

function MainUnboxingEntryPoint(props){
    const [isPopoverOpen, setPopover] = useState(false);

    // const EntryButtonStyle = {"position": "fixed", "bottom":"5%", "right":"0", "z-index": "99 !important"}

    return <>
        <PopoverContainer isOpen={isPopoverOpen} onClose={() => setPopover(false)}/>
        <EntryButton size={100} onHoverEnter={() => setPopover(true)}/>
    </>

}

function injectUnboxrButton() {

    const entryButtonappContainer = document.createElement('div');

    const entryButtonRoot = createRoot(entryButtonappContainer)
    
    console.log(document.getElementById("lottieContainer"));
    
    document.body.appendChild(entryButtonappContainer)

    entryButtonRoot.render(<MainUnboxingEntryPoint/>);

    

    // // new popover component
    // entryButtonRoot.render(<EntryButton size={100} onHoverEnter={}/>);
}

