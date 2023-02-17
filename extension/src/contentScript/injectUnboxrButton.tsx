import React from "react";
import { createRoot } from "react-dom/client";
import { Promotion } from "../api/backendModels";
import { UnboxingPopoverIcon } from "./popoverContainer";

export async function injectUnboxrButton(
  promotion: Promotion
) {
  const entryButtonappContainer = document.createElement("div");
  const entryButtonRoot = createRoot(entryButtonappContainer);
  entryButtonappContainer.setAttribute("id", "popup-container");

  document.body.appendChild(entryButtonappContainer);

  entryButtonRoot.render(
    <UnboxingPopoverIcon
      promotion={promotion}
    />
  );
}
