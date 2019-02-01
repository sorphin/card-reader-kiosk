import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

const exampleInitialState = {
  card: {}
};

export const actionTypes = {
  SCAN: "SCAN"
};

// REDUCERS
export const reducer = (state = exampleInitialState, action) => {
  switch (action.type) {
    case actionTypes.SCAN:
      return Object.assign({}, state, {
        card: action.card
      });
    default:
      return state;
  }
};

// ACTIONS
export const loadInitialDataSocket = socket => {
  return dispatch => {
    socket.on("reader/card", card => {
      dispatch({ type: actionTypes.SCAN, card });
    });
  };
};

export function initializeStore(initialState = exampleInitialState) {
  return createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
}
