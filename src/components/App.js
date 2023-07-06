import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Question from "./Question";
import StartScreen from "./StartScreen";
import NextButton from "./NextButton";
import PrevButton from "./PrevButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import { Amplify } from "aws-amplify";
import config from "../aws-exports";
import "@aws-amplify/ui-react/styles.css";
import {
  Authenticator,
  ThemeProvider,
  defaultTheme,
} from "@aws-amplify/ui-react";
import PostQuestionForm from "./PostQuestionForm";
import { components } from "../script/authStyle";
import Stadistics from "./Stadistics";
import Credits from "./Credits";
import { useQuiz } from "../context/QuizContext";
import Authentication from "./Authentication";

Amplify.configure(config);

function App() {
  const {
    loadingUser,
    dispatch,
    status,
    answer,
    currQuestion,
    questions,
    userData,
    highScore,
  } = useQuiz();
  return (
    // Authenticator
    <ThemeProvider theme={defaultTheme}>
      <Authenticator components={components}>
        {({ signOut, user }) => (
          <div className="app">
            <Authentication user={user} signOut={signOut} />
            {loadingUser && <Loader msg="Loading User..." />}
            {/* {!loadingUser && <Stadistics />} */}
            <Header />
            {/* Add question Form for admin user */}
            {user.username === "admin" && <PostQuestionForm />}
            <Main>
              <StartScreen />
              {/* Quiz Loop */}
              {status === "active" && (
                <>
                  <Progress />
                  <Question />
                  <Footer>
                    <Timer />
                    {answer !== null && (
                      <NextButton dispatch={dispatch} userName={user.username}>
                        {currQuestion + 1 === questions.length
                          ? "Finish"
                          : "Next"}
                      </NextButton>
                    )}
                  </Footer>
                </>
              )}
              {/* Review Loop */}
              {status === "review" && (
                <>
                  <Progress />
                  <Question />
                  <Footer>
                    <div className="finish-buttons">
                      {currQuestion !== 0 ? (
                        <PrevButton dispatch={dispatch}>Previous</PrevButton>
                      ) : (
                        <button className="btn" disabled={true}>
                          Previous
                        </button>
                      )}
                      <NextButton dispatch={dispatch}>
                        {currQuestion + 1 === questions.length
                          ? "Finish"
                          : "Next"}
                      </NextButton>
                    </div>
                  </Footer>
                </>
              )}
              {/* Finish Screen */}
              {status === "finished" && (
                <FinishScreen
                  highScore={
                    userData?.maxScore > highScore
                      ? userData.maxScore
                      : highScore
                  }
                />
              )}
              {status !== "active" && <Credits />}
            </Main>
          </div>
        )}
      </Authenticator>
    </ThemeProvider>
  );
}

export default App;
