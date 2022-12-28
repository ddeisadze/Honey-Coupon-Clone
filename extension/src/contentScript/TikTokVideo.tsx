import React from 'react';

export function TikTokVideo(props) {

    const idFromVideoLink = props.videoLink.match("([0-9]+)");

    const embedUrl = "https://www.tiktok.com/embed/" + idFromVideoLink;

    return <iframe
        src="https://www.tiktok.com/embed/7167765831969934634"
        scrolling="yes"
        style={{ width: "100%", height: "600px" }}
        allow="encrypted-media;"
    ></iframe>;
}
