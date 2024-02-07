import * as ActionTypes from "../ActionTypes";
import CommonService from "../../Services/Common/CommonService";

export const saveUserId = (id) => {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.SAVE_USER_ID,
      data: id,
    });
  };
};

export const removeUserId = () => {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.REMOVE_USER_ID,
      data: 0,
    });
  };
};

export const fetchUserById = (id) => {
  return async (dispatch, getState) => {
    var response = await CommonService.GetUserById(id);
    dispatch({
      type: ActionTypes.SAVE_USER,
      data: response.data,
    });
  };
};

export const saveIsAdmin = () => {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.SAVE_IS_ADMIN,
      data: true,
    });
  };
};

export const removeIsAdmin = () => {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.REMOVE_IS_ADMIN,
      data: false,
    });
  };
};
