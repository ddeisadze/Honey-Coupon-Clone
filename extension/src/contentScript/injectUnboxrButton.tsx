import React from "react";
import { createRoot } from "react-dom/client";
import { MainUnboxingEntryPoint } from "./popoverContainer";

export async function injectUnboxrButton(
  couponCodes: Array<Object>,
  companyWebsite: String,
  couponUrlLink: String,
  videoLink: String
) {
  const entryButtonappContainer = document.createElement("div");
  const entryButtonRoot = createRoot(entryButtonappContainer);
  entryButtonappContainer.setAttribute("id", "popup-container");

  document.body.appendChild(entryButtonappContainer);

  entryButtonRoot.render(
    <MainUnboxingEntryPoint
      couponCodes={couponCodes}
      companyWebsite={companyWebsite}
      couponUrlLink={couponUrlLink}
      videoLink={videoLink}
    />
  );
}
