import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

const initialState = {
  card: null,
  account: null,
  data: null,
  checkin: null
};

export const actionTypes = {
  RESET: "REST",
  CARD: "CARD",
  ACCOUNT: "ACCOUNT",
  CHECKIN: "CHECKIN",
  DATA: "DATA"
};

// REDUCERS
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RESET:
      return Object.assign({}, state, {
        card: null,
        account: null,
        checkin: null
      });

    case actionTypes.CARD:
      return Object.assign({}, state, {
        card: action.card,
        account: null,
        checkin: null
      });

    case actionTypes.ACCOUNT:
      return Object.assign({}, state, {
        account: action.account,
        checkin: null
      });

    case actionTypes.CHECKIN:
      return Object.assign({}, state, {
        checkin: action.checkin
      });

    case actionTypes.DATA:
      return Object.assign({}, state, {
        data: action.data
      });

    default:
      return state;
  }
};

// ACTIONS
export const reset = () => dispatch => {
  return dispatch({ type: actionTypes.RESET });
};

export const setCard = card => dispatch => {
  return dispatch({ type: actionTypes.CARD, card });
};

export const setAccount = account => dispatch => {
  return dispatch({ type: actionTypes.ACCOUNT, account });
};

export const setCheckin = checkin => dispatch => {
  return dispatch({ type: actionTypes.CHECKIN, checkin });
};

export const setData = data => dispatch => {
  return dispatch({ type: actionTypes.DATA, data });
};

//
export function initializeStore(state = initialState) {
  return createStore(reducer, state, composeWithDevTools(applyMiddleware(thunkMiddleware)));
}
