import type { NavigateFunction } from "react-router-dom";

import { useState } from "react";
import { auth } from "../services/firebase";
import { RoutesEnum } from "../enums/enums";
import { FirebaseError } from "firebase/app";
import { useAppDispatch } from "../redux/hooks";
import { useNotification } from "./useNotification";
import { getFirebaseErrorMessage } from "../utils/firebaseErrors";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { clearUser, setUser } from "../redux/globalReducer/slice";

export const useAuth = (navigate: NavigateFunction) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const notification = useNotification();

  const runAsync = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError("");

    try {
      return await fn();
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        const errorCode = err.code;
        console.log(errorCode);
        setError(getFirebaseErrorMessage(errorCode));
        notification.error("Erro...", getFirebaseErrorMessage(errorCode));
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = (email: string, password: string) =>
    runAsync(async () => {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      dispatch(
        setUser({
          email: user.email!,
          uid: user.uid,
        })
      );

      notification.success("Seja bem-vindo!", "Usuário logado com sucesso.");
      navigate(RoutesEnum.Home);
      return null;
    });

  const logout = () =>
    runAsync(async () => {
      dispatch(clearUser());
      await signOut(auth);

      notification.success("Tchau!", "Usuário deslogado com sucesso.");
    });

  const refreshToken = () =>
    runAsync(async () => {
      const user = auth.currentUser;
      if (!user) {
        setError("Nenhum usuário logado.");
        return null;
      }

      const tokenId = await user.getIdToken(true);
      dispatch(
        setUser({
          email: user.email!,
          uid: user.uid,
        })
      );

      console.log("Token refreshed:", tokenId);

      return tokenId;
    });

  return { login, logout, refreshToken, error, loading };
};
