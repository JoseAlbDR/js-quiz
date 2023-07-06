import {
  Button,
  Heading,
  View,
  Card,
  Flex,
  AccountSettings,
} from "@aws-amplify/ui-react";
import { handleDeleteUser, handleSignOut } from "../script/eventHandlers";
import { useQuiz } from "../context/QuizContext";

function Authentication({ user, signOut }) {
  const { dispatch } = useQuiz();
  return (
    <>
      <View className="App">
        <Flex alignItems={"center"}>
          <Card>
            <Heading level={1} style={{ color: "white", marginBottom: "1rem" }}>
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
  );
}

export default Authentication;
