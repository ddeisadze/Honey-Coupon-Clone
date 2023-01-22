import "/src/cssFiles/productPage.css";
import { loadElementsForProductPage } from "../loadElementsForProductPage";

window.onload = () => {
  // check if amazon product page
  console.log(process.env.REACT_APP_PRODUCTS_CRAWL_URL, "yoo");
  
  
  
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
