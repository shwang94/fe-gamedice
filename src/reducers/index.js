import { combineReducers } from "redux";

import userReducers from "./users.reducers";

const rootReducer = combineReducers({
  userReducers,
});

export default rootReducer;
