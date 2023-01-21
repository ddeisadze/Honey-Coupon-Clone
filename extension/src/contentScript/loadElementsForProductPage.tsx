import { injectUnboxrButton } from "./injectUnboxrButton";
import { amazonProductAttributes } from "./amazon/amazonProductAttributes";
import { extractProductInformationFromAmazonPage } from "./amazon/extractProductInformationFromAmazonPage";
import { sendSearchForInfluencerRequest } from "./sendSearchForInfluencerRequest";

export async function loadElementsForProductPage(test: boolean) {
  const windowUrl = window.location.href;

  const extractedProductInfo = test
    ? null
    : extractProductInformationFromAmazonPage();

  // DUMMY DATA FOR TEST.HTML
  const testProductInfo: amazonProductAttributes = {
    asin: "B0BCWNQPQ7",
    priceInDollarsAndCents: "$799.99",
    description:
      '               <hr>\n                            <h1 className="a-size-base-plus a-text-bold"> About this item </h1>       <ul className="a-unordered-list a-vertical a-spacing-mini">   <li><span className="a-list-item"> Laser Engine Powers High Brightness: Stop squinting and just lean back to enjoy your favorite content with a laser light source—displaying 300 ISO Lumens of brightness in 1080p HD.  </span></li>  <li><span className="a-list-item"> Fits in Your Hand: Wherever you need to go, Capsule 3 Laser is easy to pack up or just hold—weighing only 2 lb (900 g). The portable projector is 90% smaller than others with similar brightness.  </span></li>  <li><span className="a-list-item"> Play Videos for 2.5 Hours: Yes, you can finish a long movie without worrying about power thanks to the 52Wh built-in battery. CAIC technology uses every pixel to conserve energy.  </span></li>  <li><span className="a-list-item"> Switch Up Your Entertainment: Whether you\'re a cinephile or a gamer, Android TV 11.0 gives you abundant options for fun—no matter the situation. And the portable projector works with the Google Assistant and Chromecast. Download Netflix from Nebula Play,Use the Nebula Connect app on your phone to control Netflix on the projector.  </span></li>  <li><span className="a-list-item"> Let Your Ears Connect: Perk up your ears with the clash of swords or an intimate whisper with the powerful 8W Dolby Digital speaker—featuring realistic, high-fidelity sound on the portable projector.  </span></li>  </ul> <!-- Loading EDP related metadata -->\n               <span className="edp-feature-declaration" data-edp-feature-name="featurebullets" data-edp-asin="B0BCWNQPQ7" data-data-hash="1476201698" data-defects="[{&quot;id&quot;:&quot;defect-mismatch-info&quot;,&quot;value&quot;:&quot;Different from product&quot;},{&quot;id&quot;:&quot;defect-missing-information&quot;,&quot;value&quot;:&quot;Missing information&quot;},{&quot;id&quot;:&quot;defect-unessential-info&quot;,&quot;value&quot;:&quot;Unimportant information&quot;},{&quot;id&quot;:&quot;defect-other-productinfo-issue&quot;,&quot;value&quot;:&quot;Other&quot;}]" data-metadata="CATALOG" data-feature-container-id="" data-custom-event-handler="" data-display-name="Bullet Points" data-edit-data-state="featureBulletsEDPEditData" data-position="" data-resolver="CQResolver"></span>         <span className="caretnext">›</span> <a id="seeMoreDetailsLink" className="a-link-normal" href="#productDetails">See more product details</a>       ',
    title:
      "        Nebula Anker Capsule 3 Laser 1080p, Smart, Wi-Fi, Mini Projector, Black, Portable Projector, Dolby Digital, Laser Projector, Autofocus, 120-Inch Picture, Built-in Battery, 2.5 Hours of Playtime       ",
    websiteAddress:
      "https://www.amazon.com/dp/B0BCWNQPQ7?maas=maas_adg_api_8014460300101_static_12_26&ref_=aa_maas&aa_campaignid=capule3_launch-B0BCWNQPQ7-inf_tt-US&aa_adgroupid=seenebula_&aa_creativeid=US-ZMB3q1fkYb-projector&projector=1",
  };

  const doWeHaveEnoughProductInfoToFindPromotion = () => {
    return test ? null : extractedProductInfo.asin;
  };

  if (doWeHaveEnoughProductInfoToFindPromotion() || test) {
    console.log("yoasdadssaasjnxz znncjalsajskljaaavv65");

    const argument = test ? testProductInfo : extractedProductInfo;

    sendSearchForInfluencerRequest(argument)
      .then((data) => {
        console.log(data);
 //TODO: once we have more data and more promotions for each product put in a algo that chooses the best promo
        let videoLink = null
        let companyWebsite = null
        let couponCodes = [];
        let couponUrlLink = null;

        for (let promotion of data) {
          videoLink = promotion.post_link ? promotion.post_link: null
          companyWebsite = promotion.product["company_website"] ? promotion.product["company_website"]: null
          couponCodes = couponCodes.concat(promotion.coupons)
          couponUrlLink = promotion.coupon_code_in_the_link ? promotion.coupon_code_in_the_link: null


        }
        console.log(couponCodes);

        
        // console.log("yooooo");

        injectUnboxrButton(
          couponCodes,
          companyWebsite,
          couponUrlLink,
          videoLink
        );
      })
      .catch((err) => console.log(err, "ayo"));
    console.log("yoasdadssaasjnxz znncjalsajskljaaavv2");

    
  } else {
    console.log(
      "Could not match regex for asin in url. ",
      extractedProductInfo,
      windowUrl
    );
    
  }
}
