

window.onload = () => {
    console.log(document.getElementById('productTitle').innerText, "productTitle");
    const windowUrl = window.location.href;
    const regexForAsin = windowUrl.match("(?:[/dp/]|$)([A-Z0-9]{10})");

    if(regexForAsin){
        const asin = regexForAsin[1];
        console.log(asin, "asin");

        let postBody = {
            "product_id_type": "asin",
            "product_id_value": asin,
            "product_name": "string",
            "company_website": "string",
            "company_name": "string",
            "product_price": "string",
            "product_page": "string",
            "product_description": "string"
          };

          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postBody)
        };

        const searchForPromotion = fetch("https://unboxrapi.onrender.com/", requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data, "data");
        }).catch(err => {
            console.log(err, "err");
        });
        
    }else{
        console.log("Could not match regex for asin in url. ", regexForAsin, windowUrl);
    }
};