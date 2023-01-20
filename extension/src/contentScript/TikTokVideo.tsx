import React from "react";

export function TikTokVideo(props) {
  const idFromVideoLink = props.videoLink.match("([0-9]+)");

  const embedUrl = "https://www.tiktok.com/embed/" + idFromVideoLink[0];

  return (
    <iframe
      src={embedUrl}
      scrolling="no"
      style={{
        width: "-webkit-fill-available",
        height: "-webkit-fill-available",
      }}
      allow="encrypted-media;"
    ></iframe>
  );
}
