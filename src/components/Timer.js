import { useEffect } from "react";
import { useQuiz } from "../context/QuizContext";

// Game Loop Timer
function Timer() {
  const { remainSeconds: seconds, dispatch } = useQuiz();
  const mins = Math.trunc(seconds / 60);
  const secs = seconds % 60;

  useEffect(
    function () {
      const timer = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);
      return () => clearInterval(timer);
    },
    [dispatch]
  );

  return (
    <div className={`timer ${seconds <= 60 ? "red" : ""}`}>
      {mins < 10 ? `0${mins}` : mins}:{secs < 10 ? `0${secs}` : secs}
    </div>
  );
}

export default Timer;
