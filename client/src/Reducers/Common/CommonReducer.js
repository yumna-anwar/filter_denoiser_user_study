import * as ActionTypes from "../../Actions/ActionTypes";

const initialState = {
  userId: 0,
  user: {},
  isAdmin: false,
};

const CommonReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SAVE_USER_ID:
      return {
        ...state,
        userId: action.data,
      };
    case ActionTypes.REMOVE_USER_ID:
      return {
        ...state,
        userId: 0,
      };
    case ActionTypes.SAVE_USER:
      return {
        ...state,
        user: action.data,
      };
    case ActionTypes.REMOVE_USER:
      return {
        ...state,
        userId: {},
      };
    case ActionTypes.SAVE_IS_ADMIN:
      return {
        ...state,
        isAdmin: true,
      };
    case ActionTypes.REMOVE_IS_ADMIN:
      return {
        ...state,
        isAdmin: false,
      };
    default:
      return state;
  }
};

export default CommonReducer;
