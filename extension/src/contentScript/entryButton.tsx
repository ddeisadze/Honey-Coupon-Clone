import React, { useState, useRef, useEffect, ReactComponentElement } from 'react';
import { createRoot } from 'react-dom/client';
import boxLottie from '../assets/boxLottie.json'
import Lottie from "lottie-react";

interface Props {
    onClick?: Function,
    size?: number,
    onHoverEnter?: Function,
    onHoverExit?: Function,

}

function UnboxrButton(props: Props) {
    const lottieRef = useRef();
    const [isLoop, setLoop] = useState(false);

    const onMouseEnter = () => {
        lottieRef.current.setSpeed(3)
        console.log("mouseover", lottieRef)
        setLoop(false);
        lottieRef.current.setDirection(1);
        lottieRef.current.goToAndPlay(22);
        // lottieRef.current.goToAndPlay(22)
        props.onHoverEnter?.call()
    }

    const onMouseExit = () => {
        console.log("mousexit", lottieRef)
        setLoop(false);
        lottieRef.current.setDirection(-1);
        lottieRef.current.play();
        // lottieRef.current.goToAndStop(22);
        props.onHoverExit?.call()

    }

    const divStyle = {
        "display": "inline-block",
        "cursor": "pointer",
        "vertical-align": "middle",
        "width": `${props.size ?? 200}px`,
        "height": `${(props.size + props.size * 0.1) ?? 200}px`,

        "&:hover": {
            "background": "#efefef",
            "box-shadow": "0 0 5px -1px rgba(0,0,0,0.6)"
        },
    }

    return (
        <div id="entryButton" style={divStyle}>
            <Lottie style={{ width: `${(props.size ?? 200) * 0.8}px`, height: `${props.size ?? 200}px`, float: "right" }}
                onMouseLeave={onMouseExit}
                onMouseEnter={onMouseEnter}
                
                lottieRef={lottieRef}
                animationData={boxLottie}
                initialSegment={[22, 100]}
                autoplay={false}
                loop={isLoop}
                 />
            {/* <p style={{ "margin": "0px", "float": "inline-end", textAlign: "center" }}>Unboxing found</p> */}
        </div>
    )
}

export default UnboxrButton;