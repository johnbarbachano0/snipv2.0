import React, { useState, useEffect } from "react";
import { FaArrowCircleUp } from "react-icons/fa";

const style = {
  arrowUp: {
    cursor: "pointer",
    color: "#c0c0c0a8",
    fontSize: "2rem",
    position: "fixed",
    bottom: "10px",
    right: "10px",
    zIndex: "10",
  },
  show: {
    display: "inline",
  },
  hide: {
    display: "none",
  },
};

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  function toggleVisible() {
    const scrolled = document.documentElement.scrollTop;
    scrolled > 100 ? setVisible(true) : setVisible(false);
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
    return () => {
      window.removeEventListener("scroll", toggleVisible);
    };
  });

  return (
    <FaArrowCircleUp
      style={
        visible
          ? { ...style.arrowUp, ...style.show }
          : { ...style.arrowUp, ...style.hide }
      }
      onClick={scrollToTop}
    />
  );
}

export default ScrollToTop;
