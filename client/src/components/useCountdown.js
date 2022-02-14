import { useState, useEffect } from "react";

function useCountdown(value) {
  const [countdown, setCountdown] = useState(value);

  useEffect(() => {
    const timerOut = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timerOut);
  });

  return [countdown, setCountdown];
}

export default useCountdown;
