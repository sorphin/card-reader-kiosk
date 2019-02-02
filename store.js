import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

const exampleInitialState = {
  card: null,
  account: null
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
export const loadInitialDataSocket = socket => dispatch =>
  socket.on("reader/card", card => dispatch({ type: actionTypes.SCAN, card }));

export const reset = () => dispatch =>
  dispatch({ type: actionTypes.SCAN, card: null });

export function initializeStore(initialState = exampleInitialState) {
  return createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
}
