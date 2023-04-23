import {
    ADD_USER
  } from "../contants/users.contants";
  const initialState = {
    user: null
  
  };
  export default function orderReducers(state = initialState, action) {
    switch (action.type) {
  
        case ADD_USER:
            state.user = action.data;
            break;

  
    default:
        break;
    }
  
    return { ...state };
  }
  