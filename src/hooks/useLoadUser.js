import { useEffect } from "react";
import { getUser } from "../script/userQueries";

export function useLoadUser(dispatch, user) {
  useEffect(
    function () {
      async function loadUser() {
        try {
          dispatch({ type: "loadingUser", payload: true });
          const currentUser = await getUser(user);
          dispatch({ type: "loadUser", payload: currentUser });
        } catch (err) {
          console.log(err);
        } finally {
          dispatch({ type: "loadingUser", payload: false });
        }
      }
      loadUser();
    },
    [user, dispatch]
  );
}
