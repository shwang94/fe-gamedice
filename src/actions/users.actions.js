import { ADD_USER } from "../contants/users.contants.js";
  

//   export const fetchOrders = () => {
//     return async (dispatch) => {
//       var requestOptions = {
//         method: "GET",
//         redirect: "follow"
//       };
  
//       await dispatch({
//         type: FETCH_ORDERS_PENDING
//       });
  
//       try {
//         const response = await fetch(
//           "http://203.171.20.210:8080/devcamp-pizza365/orders",
//           requestOptions
//         );
  
//         const allOrders = await response.json();      
  
  
//         return dispatch({
//           type: FETCH_ORDERS_SUCCESS,
//           orders: allOrders
          
//         });
//       } catch (err) {
//         return dispatch({
//           type: FETCH_ORDERS_ERROR,
//           error: err,
//         });
//       }
//     };
//   };
export const setUser = (data) => {
    return {
      type: ADD_USER,
      data: data,
    };
  };
  