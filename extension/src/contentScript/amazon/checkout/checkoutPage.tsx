
// TODO: configure webpack to load this file and amazonIndex file
import React, { useState } from "react";
import { sendSearchForInfluencerRequest } from '../../sendSearchForInfluencerRequest';
import { ApplyCouponsAlert } from '../../applyCouponsAlert';
import { createRoot } from "react-dom/client";
import "/src/cssFiles/checkoutPage.css";

 

window.onload = () => {
    // const [productsData, setProductsData ] = useState();

    
    const asinsInputArray = document.getElementsByName("promiseAsin-0")
    // console.log(asins, "asinssssssssssss");
    let dataArray = []
    asinsInputArray.forEach(element => {
        if (element.defaultValue) {
            sendSearchForInfluencerRequest({"asin": element.defaultValue})
            .then((data) => {
                console.log(data);
                // setProductsData
                dataArray.push(data)
            })
            .catch((err) => console.log(err));

        }
    });
    // console.log(asinsArray, "heyyyyyyyyyyyyyyyys");
    const couponsAlertContainer = document.createElement("div");
    const couponsAlertRoot = createRoot(couponsAlertContainer);
    couponsAlertContainer.setAttribute("id", "baalert-container");

    // document.body.appendChild(couponsAlertContainer);
    document.body.parentNode.insertBefore(couponsAlertContainer, document.body)
    couponsAlertRoot.render(<ApplyCouponsAlert dataArray={dataArray} />)

    // couponsAlertRoot.render(
    //     <ApplyCouponsAlert>

    //   );

     
    
}