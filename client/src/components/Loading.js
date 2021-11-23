import React from "react";
import ReactLoading from "react-loading";

const style = {
  center: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};

function Loading({ type, color, height, width }) {
  return (
    <div style={style.center}>
      <ReactLoading type={type} color={color} height={height} width={width} />
    </div>
  );
}

export default Loading;

// types:
// blank
// balls
// bars
// bubbles
// cubes
// cylon
// spin
// spinningBubbles
// spokes
