import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

const exampleInitialState = {
  card: null,
  account: null
};

export const actionTypes = {
  CARD: "CARD",
  ACCOUNT: "ACCOUNT",
  RESET: "REST",
  GET_ACCOUNT: "GET_ACCOUNT"
};

// REDUCERS
export const reducer = (state = exampleInitialState, action) => {
  switch (action.type) {
    case actionTypes.RESET:
      return Object.assign({}, state, {
        card: null,
        account: null
      });

    case actionTypes.CARD:
      return Object.assign({}, state, {
        card: action.card,
        account: null
      });

    case actionTypes.ACCOUNT:
      return Object.assign({}, state, {
        account: action.account
      });

    default:
      return state;
  }
};

// ACTIONS
export const setCard = card => dispatch => {
  return dispatch({ type: actionTypes.CARD, card });
};

export const setAccount = account => dispatch => {
  return dispatch({ type: actionTypes.ACCOUNT, account });
};

export const reset = () => dispatch => {
  return dispatch({ type: actionTypes.RESET });
};

export function initializeStore(initialState = exampleInitialState) {
  return createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
}
