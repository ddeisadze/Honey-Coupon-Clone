import { amazonProductAttributes } from "./amazonProductAttributes";

export function extractProductInformationFromAmazonPage(): amazonProductAttributes {
  const windowUrl = window.location.href;
  const asinFromUrl = windowUrl.match("(?:[/dp/]|$)([A-Z0-9]{10})");
  const wholePriceDollar =
    document.getElementsByClassName("a-offscreen")[0].textContent;
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
