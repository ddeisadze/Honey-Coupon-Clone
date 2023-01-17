import React from 'react';
import { createRoot } from 'react-dom/client';
import { MainUnboxingEntryPoint } from "./MainUnboxingEntryPoint";

export async function injectUnboxrButton(couponCode: String, companyWebsite: String, couponUrlLink: String) {
    const entryButtonappContainer = document.createElement('div');
    const entryButtonRoot = createRoot(entryButtonappContainer);
    entryButtonappContainer.setAttribute("id", "popup-container")


    document.body.appendChild(entryButtonappContainer);
    // let sp = document.getElementById("ap_container")
    // document.body.insertBefore(entryButtonappContainer, sp);

    
    entryButtonRoot.render(<MainUnboxingEntryPoint couponCode={couponCode} companyWebsite={companyWebsite} couponUrlLink={couponUrlLink} />);

}
