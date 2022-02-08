import React, { Dispatch } from "react";
import { useReducer } from "react";

import { Complex } from "../../util/complex";
import { AppAction, appReducer, initialAppState, Solvers } from "./reducer";

export const AppDispatchProviderContext = React.createContext<{
  dispatch: Dispatch<AppAction>;
}>({
  dispatch: () => null,
});

export const AppStateSolversProviderContext = React.createContext<{
  solvers: Solvers;
}>({
  solvers: initialAppState.solvers,
});

export const AppStateInputValuesContext = React.createContext<{
  inputValues: Complex[];
}>({
  inputValues: initialAppState.inputValues,
});

function AppStateProvider({ children }: { children: React.ReactElement }) {
  const [appState, appDispatch] = useReducer(appReducer, initialAppState);

  return (
    <AppDispatchProviderContext.Provider value={{ dispatch: appDispatch }}>
      <AppStateSolversProviderContext.Provider
        value={{ solvers: appState.solvers }}
      >
        <AppStateInputValuesContext.Provider
          value={{ inputValues: appState.inputValues }}
        >
          {children}
        </AppStateInputValuesContext.Provider>
      </AppStateSolversProviderContext.Provider>
    </AppDispatchProviderContext.Provider>
  );
}

export default AppStateProvider;