import Options from "./Options";
import Prism from "prismjs";
import Accordion from "./Accordion";
import { useEffect } from "react";
import { useQuiz } from "../context/QuizContext";

function Question() {
  const {
    currQuestion,
    dispatch,
    answer,
    score,
    reviewQuestions = false,
    wrongQuestionIndex,
    curOpen,
    questions,
  } = useQuiz();
  // wrongQuestionIndex={wrongQuestionIndex[currQuestion]}
  const {
    question,
    options,
    correctOption,
    code,
    answer: reviewAnswer,
  } = questions[currQuestion];

  useEffect(() => {
    Prism.highlightAll();
  }, [currQuestion]);

  return (
    <>
      <h4>{question}</h4>
      <pre className="language-javascript">
        <code className="language-javascript">{code}</code>
      </pre>
      <Options
        reviewQuestions={reviewQuestions}
        options={options}
        dispatch={dispatch}
        answer={answer}
        correctOption={correctOption}
        score={score}
        wrongQuestionIndex={wrongQuestionIndex}
      />
      {reviewQuestions && (
        <div style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
          {
            <Accordion
              curOpen={curOpen}
              dispatch={dispatch}
              data={[{ title: "Answer", text: reviewAnswer }]}
            />
          }
        </div>
      )}
    </>
  );
}

export default Question;
