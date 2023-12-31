import { useLoadUser } from "../hooks/useLoadUser";
function FinishScreen({
  score,
  maxScore,
  dispatch,
  highScore,
  failedQuestions,
  user,
}) {
  useLoadUser(dispatch, user);

  const percentaje = (score / maxScore) * 100;
  let emoji;

  if (percentaje === 100) emoji = "⭐";
  if (percentaje < 100 && percentaje >= 80) emoji = "💪";
  if (percentaje < 80 && percentaje >= 60) emoji = "🎉";
  if (percentaje < 60 && percentaje >= 40) emoji = "👍";
  if (percentaje < 40 && percentaje >= 20) emoji = "👌";
  if (percentaje < 20 && percentaje >= 0) emoji = "🤦‍♂️";
  if (percentaje === 0) emoji = "🤢";

  return (
    <>
      <p className="result">
        <span>{emoji}</span>
        Your score <strong>{score}</strong> out of {maxScore} (
        {Math.ceil(percentaje)}%)
      </p>
      <p className="highscore">(HighScore: {highScore} points)</p>
      <div className="finish-buttons">
        {/* Review Button */}
        <button
          disabled={failedQuestions.length === 0}
          className="btn"
          onClick={() => dispatch({ type: "review" })}
        >
          Review Answers
        </button>
        {/* Restart Button */}
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "restart" })}
        >
          Reset Quiz
        </button>
      </div>
    </>
  );
}

export default FinishScreen;
