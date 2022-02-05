import { useState, useEffect } from "react";

function useCountdown(value) {
  const [countdown, setCountdown] = useState(value);

  useEffect(() => {
    countdown === 0 && clearTimeout(timerOut());
    countdown !== 0 && timerOut();
    return () => clearTimeout(timerOut);
  });

  const timerOut = () => setTimeout(() => setCountdown(countdown - 1), 1000);

  return [countdown, setCountdown];
}

export default useCountdown;
