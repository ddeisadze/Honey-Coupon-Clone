import "/src/cssFiles/popup.css"
import { loadElementsForProductPage } from '../loadElementsForProductPage';

window.onload = () => {
    // check if amazon product page
    // console.log("yooooo");

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