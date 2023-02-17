import { ProductPriceHistoryGraph } from "./priceHistory";

import React from "react";
import { createRoot } from "react-dom/client";


const container = document.createElement("div");
const root = createRoot(container);
container.setAttribute("id", "popup-container");

document.body.appendChild(container);

root.render(
    <ProductPriceHistoryGraph asin="B0BCWNQPQ7" />
);