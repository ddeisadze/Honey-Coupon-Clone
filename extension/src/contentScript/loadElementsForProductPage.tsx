import { injectUnboxrButton } from "./injectUnboxrButton";
import { amazonProductAttributes } from "./amazon/amazonProductAttributes";
import { extractProductInformationFromAmazonPage } from "./amazon/productPage/extractProductInformationFromAmazonProductPage";
import { sendSearchForInfluencerRequest } from "../api/backendRequests";
import { Promotion, SearchRequestForm } from "../api/backendModels";

export async function loadElementsForProductPage(test: boolean = false) {
  const windowUrl = window.location.href;

  let extractedProductInfo: amazonProductAttributes = {};

  try {
    extractedProductInfo = extractProductInformationFromAmazonPage();
  }
  catch {

  }

  const doWeHaveEnoughProductInfoToFindPromotion = () => {
    return extractedProductInfo?.asin;
  };

  if (test) {

    injectUnboxrButton(
      {
        post_link: "https://www.tiktok.com/@driggsy/video/7167765831969934634?is_copy_url=1&is_from_webapp=v1",
        product: {
          company_name: "Test",
          merchant_product_page: "Test",
          product_description: "Test",
          product_name: "Test",
          prices: [
            {
              "id": 1,
              "source": "http://amazon.com",
              "list_price": "799.00",
              "discounted_price": "679.10",
              "discount": "119.90",
              "date_modified": new Date("2023-02-15T02:35:00.902050Z"),
              "date_added": new Date("2023-02-15T01:08:22.631007Z")
            },
            {
              "id": 2,
              "source": "http://amazon.com",
              "list_price": "799.10",
              "discounted_price": "600.00",
              "discount": "199.10",
              "date_modified": new Date("2023-02-15T02:34:57.331018Z"),
              "date_added": new Date("2023-02-15T02:23:51.021586Z")
            },
            {
              "id": 3,
              "source": "http://amazon.com",
              "list_price": "799.10",
              "discounted_price": "850.00",
              "discount": "-50.90",
              "date_modified": new Date("2023-02-15T02:34:54.686645Z"),
              "date_added": new Date("2023-02-15T02:23:51.021586Z")
            },
            {
              "id": 4,
              "source": "http://amazon.com",
              "list_price": "799.00",
              "discounted_price": "500.11",
              "discount": "298.89",
              "date_modified": new Date("2023-02-15T02:34:36.305015Z"),
              "date_added": new Date("2023-02-15T02:30:17.634995Z")
            }
          ],
          company_website: "https://www.amazon.com/dp/B0BCWNQPQ7?maas=maas_adg_api_8014460300101_static_12_26&ref_=aa_maas&aa_campaignid=capule3_launch-B0BCWNQPQ7-inf_tt-US&aa_adgroupid=seenebula_&aa_creativeid=US-ZMB3q1fkYb-projector&projector=1"
        },
        coupons: [
          {
            coupon_code: "test1"
          }
        ]
      }
    );
  }

  if (doWeHaveEnoughProductInfoToFindPromotion()) {

    const requestForPromotions: SearchRequestForm = {
      product_id_type: "asin",
      product_id_value: extractedProductInfo.asin,
      product_description: extractedProductInfo.description,
      product_name: extractedProductInfo.title,
      company_website: extractedProductInfo.websiteAddress,
      product_price: extractedProductInfo.priceInDollarsAndCents
    }

    sendSearchForInfluencerRequest(requestForPromotions)
      .then((promotions: Promotion[]) => {
        //TODO: once we have more data and more promotions for each product put in a algo that chooses the best promo

        injectUnboxrButton(promotions[0]);
      })
      .catch((err) => console.log(err, "ayo"));
  }
}
