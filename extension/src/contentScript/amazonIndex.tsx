import React from 'react';
import { createRoot } from 'react-dom/client';
import EntryButton from './entryButton';
import { TikTokVideo } from './TikTokVideo';

window.onload = () => {

    // check if amazon product page
    const isAmazonProductPage = () => {
        if (document.getElementById("productTitle")) {
            return true;
        }
        return false;
    }

    if (isAmazonProductPage()) {
        loadElementsForProductPage();
    } else {
        // other amazon pages
    }
};

function loadElementsForProductPage() {
    injectUnboxrButton();

    const windowUrl = window.location.href;
    const tikTokContainer = document.createElement('div');

    if (!tikTokContainer) {
        throw new Error("Could not create app container");
    }

    const root = createRoot(tikTokContainer);

    const extractedProductInfo = extractProductInformationFromAmazonPage();

    const doWeHaveEnoughProductInfoToFindPromotion = () => {
        return extractedProductInfo.asin;
    }

    if (doWeHaveEnoughProductInfoToFindPromotion()) {

        sendSearchForInfluencerRequest(extractedProductInfo).then(data => {

            console.log(data, "check response")

            const tikTokVideo = data.post_link;

            root.render(<TikTokVideo videoLink={tikTokVideo} />);

            document.getElementById('leftCol').appendChild(tikTokContainer);

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

function injectUnboxrButton() {

    const entryButtonappContainer = document.createElement('div');
    entryButtonappContainer.id = "container";

    const entryButtonRoot = createRoot(entryButtonappContainer)

    document.body.appendChild(entryButtonappContainer)

    entryButtonappContainer.style.cssText = "position: fixed; bottom:5%; right:0; z-index: 99 !important;";

    entryButtonRoot.render(<EntryButton size={100} />);
}

