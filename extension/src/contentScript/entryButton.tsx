import React, { useState, useRef } from "react";
import boxLottie from "../assets/boxLottie.json";
import Lottie from "lottie-react";
import piggyBank from "../assets/piggyBank.json";


interface Props {
  onClick?: Function;
  size?: number;
  onHoverEnter?: Function;
  onHoverExit?: Function;
}

function UnboxrButton(props: Props) {
  const lottieRef = useRef();
  const [isLoop, setLoop] = useState(false);

  const onMouseEnter = () => {
    lottieRef.current.setSpeed(1.5);
    console.log("mouseover", lottieRef);
    setLoop(false);
    lottieRef.current.setDirection(1);
    lottieRef.current.goToAndPlay(15);
    props.onHoverEnter?.call();
  };

  const onMouseExit = () => {
    console.log("mousexit", lottieRef);
    setLoop(false);
    lottieRef.current.setDirection(-1);
    lottieRef.current.play();
    props.onHoverExit?.call();
  };

  const divStyle = {
    display: "inline-block",
    cursor: "pointer",
    "vertical-align": "middle",
    width: `${props.size ?? 200}px`,
    height: `${props.size + props.size * 0.1 ?? 200}px`,

    "&:hover": {
      background: "#efefef",
      "box-shadow": "0 0 5px -1px rgba(0,0,0,0.6)",
    },
  };

  return (
    <div id="entryButton" style={divStyle}>
      <Lottie
        style={{
          width: `${(props.size ?? 200) * 0.8}px`,
          height: `${props.size ?? 200}px`,
          float: "right",
        }}
        onMouseLeave={onMouseExit}
        onMouseEnter={onMouseEnter}
        lottieRef={lottieRef}
        animationData={piggyBank}
        initialSegment={[16, 100]}
        autoplay={false}
        loop={isLoop}
  
      />
    </div>
  );
}

export default UnboxrButton;
