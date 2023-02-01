// TODO: configure webpack to load this file and amazonIndex file
import React, { useState } from "react";
import { sendSearchForInfluencerRequest } from "../../sendSearchForInfluencerRequest";
import { ApplyCouponsAlert } from "../../applyCouponsAlert";
import { createRoot } from "react-dom/client";
import "/src/cssFiles/checkoutPage.css";

window.onload = async () => {
  const asinsInputArray = document.getElementsByName("promiseAsin-0");

  let promotions = [];
  for (const elementIndex in Array.from(asinsInputArray)) {
    const element = asinsInputArray[elementIndex];
    if (element.defaultValue) {
      const promo = await sendSearchForInfluencerRequest({
        asin: element.defaultValue,
      }).catch((err) => console.log("yoo", err));

      if (promo) {
        promotions = promotions.concat(promo);
      }
    }
  }

  const couponsAlertContainer = document.createElement("div");
  const couponsAlertRoot = createRoot(couponsAlertContainer);
  couponsAlertContainer.setAttribute("id", "baalert-container");

  document.body.parentNode.insertBefore(couponsAlertContainer, document.body);
  couponsAlertRoot.render(<ApplyCouponsAlert dataArray={promotions} />);
};
