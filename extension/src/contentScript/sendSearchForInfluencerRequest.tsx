import { amazonProductAttributes } from './amazon/amazonProductAttributes';

export async function sendSearchForInfluencerRequest(extractedProductInfo: amazonProductAttributes) {
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

    const controller = new AbortController();

    // 5 second timeout:
    const timeoutId = setTimeout(() => controller.abort(), 5000);


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
