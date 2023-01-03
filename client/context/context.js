import { createContext, ProviderProps, useEffect, useReducer } from 'react';
import Reducer from './Reducer';

const INITIAL_STATE = {
  auth:
    (typeof window !== 'undefined' &&
      JSON.parse(localStorage.getItem('auth'))) ||
    false,
};

export const Context = createContext(INITIAL_STATE);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(state.auth));
  }, [state.auth]);

  return (
    <Context.Provider
      value={{
        auth: state.auth,
        dispatch,
      }}>
      {children}
    </Context.Provider>
  );
};
