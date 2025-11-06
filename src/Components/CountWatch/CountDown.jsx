import { useEffect, useState } from "react";

export default function CountDown({endTime}) {
  const [secondsLeft, setSecondsLeft] = useState(
    Math.max(0, Math.floor(endTime - Date.now() / 1000))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.floor(endTime - Date.now() / 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (<>{secondsLeft} </>)
}
