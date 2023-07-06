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
  Button,
  Heading,
  View,
  Card,
  Flex,
  ThemeProvider,
  defaultTheme,
  AccountSettings,
} from "@aws-amplify/ui-react";
import PostQuestionForm from "./PostQuestionForm";
import { components } from "../script/authStyle";
import Stadistics from "./Stadistics";
import { handleDeleteUser, handleSignOut } from "../script/eventHandlers";
import Credits from "./Credits";

Amplify.configure(config);

function App() {
  return (
    // Authenticator
    <ThemeProvider theme={defaultTheme}>
      <Authenticator components={components}>
        {({ signOut, user }) => (
          <div className="app">
            <>
              <View className="App">
                <Flex alignItems={"center"}>
                  <Card>
                    <Heading
                      level={1}
                      style={{ color: "white", marginBottom: "1rem" }}
                    >
                      Welcome {user.username}
                    </Heading>
                  </Card>

                  <Button
                    className="sign-out-btn"
                    onClick={() => handleSignOut(signOut, dispatch)}
                  >
                    Sign Out
                  </Button>
                  <AccountSettings.DeleteUser
                    onSuccess={() => handleDeleteUser(user)}
                  />
                </Flex>
              </View>
            </>

            {loadingUser && <Loader msg="Loading User..." />}
            {!loadingUser && <Stadistics userData={userData} />}

            <Header />
            <>
              {/* Add question Form for admin user */}
              {user.username === "admin" && (
                <PostQuestionForm addQuestion={addQuestion} />
              )}
            </>

            <Main>
              <>
                <StartScreen
                  errorMsg={errorMsg}
                  status={status}
                  numQuestions={questions.length}
                  dispatch={dispatch}
                  user={user}
                  userData={userData}
                />
              </>

              {/* Quiz Loop */}
              {status === "active" && (
                <>
                  <Progress
                    currQuestion={currQuestion}
                    numQuestions={questions.length}
                    score={score}
                    maxScore={maxScore}
                    answer={answer}
                    reviewQuestions={reviewQuestions}
                  />

                  <Question
                    currQuestion={questions[currQuestion]}
                    dispatch={dispatch}
                    answer={answer}
                    score={score}
                  />

                  <Footer>
                    <Timer seconds={remainSeconds} dispatch={dispatch} />
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
                  <Progress
                    currQuestion={currQuestion}
                    numQuestions={questions.length}
                    score={score}
                    maxScore={maxScore}
                    answer={answer}
                  />

                  <Question
                    currQuestion={questions[currQuestion]}
                    dispatch={dispatch}
                    answer={answer}
                    score={score}
                    reviewQuestions={reviewQuestions}
                    wrongQuestionIndex={wrongQuestionIndex[currQuestion]}
                    curOpen={curOpen}
                  />

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
                  failedQuestions={failedQuestions}
                  score={score}
                  maxScore={maxScore}
                  dispatch={dispatch}
                  highScore={
                    userData?.maxScore > highScore
                      ? userData.maxScore
                      : highScore
                  }
                  user={user}
                  loadingUser={loadingUser}
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
