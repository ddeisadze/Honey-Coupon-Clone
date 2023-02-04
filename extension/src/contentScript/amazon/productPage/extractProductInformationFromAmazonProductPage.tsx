import { amazonProductAttributes } from "../amazonProductAttributes";

export function extractProductInformationFromAmazonPage(): amazonProductAttributes {
  const windowUrl = window.location.href;
  const asinFromUrl = windowUrl.match("(?:[/dp/]|$)([A-Z0-9]{10})");
  const wholePriceDollarElement: HTMLCollection = document.getElementsByClassName("a-offscreen")

  let wholePriceDollar = null;
  if (wholePriceDollarElement && wholePriceDollarElement.length > 0) {
    wholePriceDollar = wholePriceDollarElement[0].textContent;
  }

  const description = document.getElementById("feature-bullets")?.innerHTML;
  const productTitle = document.getElementById("productTitle")?.innerHTML;

  const productAttributes: amazonProductAttributes = {
    asin: asinFromUrl[1] ?? asinFromUrl[0],
    priceInDollarsAndCents: wholePriceDollar,
    description: description,
    title: productTitle,
    websiteAddress: windowUrl,
  };

  return productAttributes;
}
