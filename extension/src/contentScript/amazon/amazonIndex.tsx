import "/src/cssFiles/productPage.css";
import { loadElementsForProductPage } from "../loadElementsForProductPage";

window.onload = () => {
  // check if amazon product page
  
  const isAmazonProductPage = () => {
    if (document.getElementById("productTitle")) {
      return true;
    }
    return false;
  };

  if (isAmazonProductPage()) {
    loadElementsForProductPage(false);
  } else {
    // other amazon pages

    loadElementsForProductPage(true);
  }
};
