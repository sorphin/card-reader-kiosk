import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

const initialState = {
  card: null,
  account: null,
  data: null
};

export const actionTypes = {
  CARD: "CARD",
  ACCOUNT: "ACCOUNT",
  RESET: "REST",
  GET_ACCOUNT: "GET_ACCOUNT",
  SET_DATA: "SET_DATA"
};

// REDUCERS
export const reducer = (state = initialState, action) => {
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

    case actionTypes.SET_DATA:
      return Object.assign({}, state, {
        data: action.data
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

export const setData = data => dispatch => {
  return dispatch({ type: actionTypes.SET_DATA, data });
};

export function initializeStore(state = initialState) {
  return createStore(reducer, state, composeWithDevTools(applyMiddleware(thunkMiddleware)));
}
