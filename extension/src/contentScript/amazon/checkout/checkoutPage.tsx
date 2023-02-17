// TODO: configure webpack to load this file and amazonIndex file
import React, { useState } from "react";
import { sendSearchForInfluencerRequest } from "../../../api/backendRequests";
import { ApplyCouponsAlert } from "../../applyCouponsAlert";
import { createRoot } from "react-dom/client";
import "/src/cssFiles/checkoutPage.css";
import { Promotion, Coupon } from "../../../api/backendModels";


window.onload = async () => {
  const asinsInputArray = document.getElementsByName("promiseAsin-0");

  const isTest = localStorage.getItem('ENVIRONMENT') == "test";

  let promotions: Array<Promotion> = [];

  if (isTest) {
    promotions.push({
      coupons: [
        {
          coupon_code: "TEST"
        }
      ],


      influencer: undefined,
      product: undefined,
      videos: [],
      images: [],
      social_media_type: "",
      coupon_description: "",
      post_link: "",
      post_promotion_date: undefined,
      promotion_expiration_date: undefined,
      advertisement_link: "",
      date_modified: undefined
    })

  } else {
    for (const elementIndex in Array.from(asinsInputArray)) {
      const element: HTMLInputElement = asinsInputArray[elementIndex] as HTMLInputElement;
      if (element.defaultValue) {
        const promo = await sendSearchForInfluencerRequest({
          product_id_type: "asin",
          product_id_value: element.defaultValue
        }).catch((err) => console.log(err));

        if (promo) {
          promotions = promotions.concat(promo);
        }
      }
    }
  }

  const couponsAlertContainer = document.createElement("div");
  const couponsAlertRoot = createRoot(couponsAlertContainer);
  couponsAlertContainer.setAttribute("id", "baalert-container");

  document.body.parentNode.insertBefore(couponsAlertContainer, document.body);
  couponsAlertRoot.render(<ApplyCouponsAlert promotionsArray={promotions} />);
};