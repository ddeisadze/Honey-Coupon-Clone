import React from 'react';
import { createRoot } from 'react-dom/client';
import { MainUnboxingEntryPoint } from "./MainUnboxingEntryPoint";

export async function injectUnboxrButton(couponCode: String, companyWebsite: String, couponUrlLink: String) {
    const entryButtonappContainer = document.createElement('div');
    const entryButtonRoot = createRoot(entryButtonappContainer);

    document.body.appendChild(entryButtonappContainer);
    entryButtonRoot.render(<MainUnboxingEntryPoint couponCode={couponCode} companyWebsite={companyWebsite} couponUrlLink={couponUrlLink} />);

}
