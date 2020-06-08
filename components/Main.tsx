import React from "react";
import { useAuth } from "../state/auth-context";
import AuthenticatedApp from "./AuthenticatedApp";
import UnAuthenticatedApp from "./UnAuthenticatedApp";

export default function Main({ navigation }: any) {
  const { userToken } = useAuth();
  return userToken === null ? <UnAuthenticatedApp /> : <AuthenticatedApp />;
}
