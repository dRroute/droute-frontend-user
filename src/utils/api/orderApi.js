import Key from "../../constants/key"; // Import Key object
import { apiGetRequest } from "../http/get";
import { apiPutRequest } from "../http/put";

// Constants
const { ORDER_API_URL } = Key;
// API CALLS
export const getUserOrdersAPI = (userId) =>
  apiGetRequest({
    apiUrl: `${ORDER_API_URL}/user/${userId}?status=all`,
    content_type: "application/json",
    data: null,
    accessToken: null,
  });

// API CALLS
export const updateOrderDetailsAPI = (data) =>
  apiPutRequest({
    apiUrl: `${ORDER_API_URL}/${data?.orderId}`,
    content_type: "application/json",
    data: data,
    accessToken: null,
  });