import playerReducer from './playerReducer';
import { combineReducers } from "redux";

export default combineReducers({
  player: playerReducer
});
