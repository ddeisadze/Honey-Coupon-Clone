import React from 'react';
import { createRoot } from 'react-dom/client';



console.log("asdasdsd")

function TikTokVideo(props){

    const idFromVideoLink = props.videoLink.match("([0-9]+)");

    const embedUrl = "https://www.tiktok.com/embed/" + idFromVideoLink;

    console.log(embedUrl, "embedUrl")
    return <iframe
                  src="https://www.tiktok.com/embed/7167765831969934634"
                  scrolling="yes"
                  style={{width: "100%", height: "600px"}}
                  allow="encrypted-media;"
                ></iframe>
}

console.log("asdasdsd")

window.onload = () => {
    const windowUrl = window.location.href;
    const regexForAsin = windowUrl.match("(?:[/dp/]|$)([A-Z0-9]{10})");

    const appContainer = document.createElement('div');

    if(!appContainer){
        throw new Error("Could not create app container");
    }
    
    document.getElementById('leftCol').appendChild(appContainer);

    // document.body.appendChild(appContainer);

    const root = createRoot(appContainer);


    console.log(appContainer, "appContainer");

    const render = () => root.render(<TikTokVideo />);

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

        console.log(requestOptions)

        const searchForPromotion = fetch("http://127.0.0.1:8000/", requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data, "data");
            
            const tikTokVideo = data.post_link;

            root.render(<TikTokVideo videoLink={tikTokVideo} />)

            // const root = createRoot(appContainer);

            // root.render(<p>Hello123</p>);

            // const tikTokVideo = data.post_link;

            // console.log(appContainer, "appContainer");
            // // root.render(<TikTokVideo video={tikTokVideo}/>);

            // document.getElementById('#leftCol').appendChild(appContainer);

        }).catch(err => {
            console.log(err, "err");
        });
        
    }else{
        console.log("Could not match regex for asin in url. ", regexForAsin, windowUrl);
    }
};