import SelectOption from "./SelectOption";
import { useEffect } from "react";
import { listQuestions } from "../graphql/queries";
import { API } from "aws-amplify";
import Loader from "./Loader";
import Error from "./Error";
import { useLoadUser } from "../hooks/useLoadUser";
function StartScreen({ status, numQuestions, dispatch, user, errorMsg }) {
  useLoadUser(dispatch, user);

  useEffect(
    function () {
      async function getData() {
        try {
          const apiData = await API.graphql({
            query: listQuestions,
            // authMode: "AWS_IAM",
          });
          const questionsFromAPI = apiData.data.listQuestions.items;
          dispatch({ type: "dataRecieved", payload: questionsFromAPI });
        } catch (err) {
          console.error(err);
          dispatch({ type: "dataFailed", payload: err.message });
        }
      }
      getData();
    },
    [dispatch]
  );

  return (
    <>
      {status === "loading" && <Loader msg="Loading Questions..." />}
      {status === "error" && <Error msg={errorMsg} />}
      {status === "ready" && (
        <div className="start">
          <h2 className="center">Welcome to The JavaScript QUIZ!</h2>
          <h3 className="center">
            {numQuestions} question to test your JavaScript knowledge
          </h3>
          <div className="start-options">
            <SelectOption
              dispatch={dispatch}
              label="Num Questions"
              type="setQuestions"
              options={[
                {
                  name: "10",
                  value: 10,
                },
                {
                  name: "20",
                  value: 20,
                },
                {
                  name: "30",
                  value: 30,
                },
              ]}
            />
            <SelectOption
              dispatch={dispatch}
              label="Difficulty"
              type="setDifficulty"
              options={[
                {
                  name: "Easy",
                  value: 60,
                },
                {
                  name: "Normal",
                  value: 45,
                },
                {
                  name: "Hard",
                  value: 30,
                },
              ]}
            />
          </div>
          <button
            className="btn btn-ui"
            onClick={() => dispatch({ type: "start" })}
          >
            Let's Start!!!
          </button>
        </div>
      )}
    </>
  );
}

export default StartScreen;
