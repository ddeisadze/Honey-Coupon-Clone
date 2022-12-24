window.onload = () => {
    console.log(document.getElementById('productTitle').innerText, "productTitle");
    const windowUrl = window.location.href;
    const regexForAsin = windowUrl.match("(?:[/dp/]|$)([A-Z0-9]{10})");

    if(regexForAsin){
        const asin = regexForAsin[1];
        console.log(asin, "asin");
    }else{
        console.log("Could not match regex for asin in url. ", regexForAsin, windowUrl);
    }
};