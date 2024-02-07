import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import CommonReducer from "../Reducers/Common/CommonReducer";

const appReducers = combineReducers({
  CommonReducer,
});

const rootReducer = (state, action) => appReducers(state, action);

export const store = createStore(rootReducer, applyMiddleware(thunk));
