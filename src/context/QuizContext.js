import { createContext, useContext, useReducer } from "react";
import { API } from "aws-amplify";
import { createQuestion as createQuestionMutation } from "../graphql/mutations";
import { updateUser } from "../script/userQueries";
import Error from "../components/Error";

const QuizContext = createContext();

const initialState = {
  questions: [],
  status: "loading",
  errorMsg: "",
  currQuestion: 0,
  answer: null,
  score: 0,
  highScore: 0,
  remainSeconds: null,
  numQuestions: 10,
  difficulty: 60,
  reviewQuestions: false,
  failedQuestions: [],
  wrongQuestionIndex: [],
  curOpen: null,
  userData: {},
  loadingUser: true,
  totalQuestions: 0,
};

let initialQuestions;
let maxScore;

function reducer(state, action) {
  switch (action.type) {
    // fetch data
    case "dataRecieved":
      initialQuestions = action.payload;
      return {
        ...state,
        questions: action.payload,
        status: "ready",
        totalQuestions: state.questions.length,
      };
    case "loadUser":
      return {
        ...state,
        userData: action.payload,
      };
    // data failed error
    case "dataFailed":
      return { ...state, status: "error", errorMsg: action.payload };
    // start quiz
    case "start":
      const shufled = initialQuestions.slice().sort(() => 0.5 - Math.random());
      const selected = shufled.slice(0, state.numQuestions);
      maxScore = selected.reduce((acc, question) => acc + question.points, 0);
      return {
        ...state,
        status: "active",
        questions: selected,
        remainSeconds: state.numQuestions * state.difficulty,
      };
    // click on a question to answer it
    case "newAnswer":
      const question = state.questions.at(state.currQuestion);
      return {
        ...state,
        answer: action.payload,
        score:
          action.payload === question.correctOption
            ? state.score + question.points
            : state.score,
        failedQuestions:
          action.payload !== question.correctOption
            ? [...state.failedQuestions, question]
            : state.failedQuestions,
        wrongQuestionIndex:
          action.payload !== question.correctOption
            ? [...state.wrongQuestionIndex, action.payload]
            : state.wrongQuestionIndex,
      };
    // Next question button
    case "nextQuestion":
      return {
        ...state,
        currQuestion: state.currQuestion + 1,
        answer: null,
        curOpen: null,
      };
    // Previous question button
    case "prevQuestion":
      return { ...state, currQuestion: state.currQuestion - 1 };
    // Finish button
    case "finish":
      const wrongQuestions = state.wrongQuestionIndex.length;
      const correctQuestions = state.numQuestions - wrongQuestions;
      const highScore =
        state.score > state.highScore ? state.score : state.highScore;

      let userData = {
        name: action.payload,
        wrong: wrongQuestions,
        correct: correctQuestions,
        total: state.numQuestions,
        maxScore: highScore,
      };

      if (!state.reviewQuestions) updateUser(state.userData, userData);

      userData = {};

      return {
        ...state,
        status: "finished",
        highScore:
          state.score > state.highScore ? state.score : state.highScore,
        userData: state.userData,
        loadingUser: false,
        remainSeconds: null,
      };
    // Reset button
    case "restart":
      return {
        ...initialState,
        status: "ready",
        questions: initialQuestions,
        reviewQuestions: false,
        userData: state.userData,
        loadingUser: false,
      };
    // timer
    case "tick":
      return {
        ...state,
        remainSeconds: state.remainSeconds - 1,
        status: state.remainSeconds === 0 ? "finished" : state.status,
      };
    // Options
    // Number of questions
    case "setQuestions":
      return { ...state, numQuestions: action.payload };
    // Difficulty (time per question)
    case "setDifficulty":
      return { ...state, difficulty: action.payload };
    // Review button
    case "review":
      return {
        ...state,
        reviewQuestions: true,
        currQuestion: 0,
        questions: state.failedQuestions,
        status: "review",
        answer: null,
      };

    // Open Answer accordion
    case "openAccordion":
      return {
        ...state,
        curOpen: state.curOpen === action.payload ? null : action.payload,
      };
    case "loadingUser":
      return {
        ...state,
        loadingUser: action.payload,
      };
    case "signOut":
      return initialState;

    default:
      throw new Error("Unknow action.");
  }
}

function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    questions,
    status,
    errorMsg,
    currQuestion,
    answer,
    score,
    highScore,
    remainSeconds,
    numQuestions,
    difficulty,
    reviewQuestions,
    failedQuestions,
    wrongQuestionIndex,
    curOpen,
    userData,
    loadingUser,
    totalQuestions,
  } = state;

  async function addQuestion(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      question: form.get("question"),
      code: form.get("code"),
      options: [
        form.get("option1"),
        form.get("option2"),
        form.get("option3"),
        form.get("option4"),
      ],
      correctOption: +form.get("correctOption"),
      points: 10,
      answer: form.get("answer"),
    };

    await API.graphql({
      query: createQuestionMutation,
      variables: { input: data },
    });

    event.target.reset();
  }

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        errorMsg,
        currQuestion,
        answer,
        score,
        highScore,
        remainSeconds,
        numQuestions,
        difficulty,
        reviewQuestions,
        failedQuestions,
        wrongQuestionIndex,
        curOpen,
        userData,
        loadingUser,
        maxScore,
        addQuestion,
        dispatch,
        totalQuestions,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}

export { QuizProvider, useQuiz };
