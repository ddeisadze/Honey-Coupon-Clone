import "/src/cssFiles/productPage.css";
import { loadElementsForProductPage } from "../../loadElementsForProductPage";

window.onload = () => {

  // check if amazon product page 
  const isAmazonProductPage = () => {
    if (document.getElementById("productTitle")) {
      return true;
    }
    return false;
  };

  const environment = localStorage.getItem("ENVIRONMENT") == "test";

  console.log(environment)
  console.log(localStorage.getItem("ENVIRONMENT"))

  if (isAmazonProductPage()) {
    loadElementsForProductPage(environment);
  } else {
    // other amazon pages
    loadElementsForProductPage(environment);
  }
};
