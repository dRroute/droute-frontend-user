import { apiPostRequest } from "../http/post";
import { APP_BACKEND_API } from "@env";
import { apiGetRequest } from "../http/get";
import { apiPutRequest } from "../http/put";
import Key from "../../constants/key"; // Import Key object
 
console.log("this is env url",APP_BACKEND_API);
// Constants
const { USER_API_URL, ORDER_API_URL } = Key;
// API CALLS
export const postCourierAPI = (data) =>
  apiPostRequest({
    apiUrl: `${USER_API_URL}/courier`,
    content_type: "application/json",
    data,
    accessToken: null,
  });

//For filtering journeys by courier ID
export const filterJourneyByCourierIdAPI = (courierId) =>
   apiGetRequest({
    apiUrl: `${USER_API_URL}/courier/${courierId}/journeys`,
    content_type: "application/json",
    data: null,
    accessToken: null,
  });

//Get All Courier By User Id
export const getAllCourierByUserIdAPI = (userId) =>
   apiGetRequest({
    apiUrl: `${USER_API_URL}/${userId}/couriers`,
    content_type: "application/json",
    data: null,
    accessToken: null,
  });

//Get All Courier By User Id
export const sendOrderRequestAPI = (data) =>
   apiPostRequest({
    apiUrl: `${ORDER_API_URL}`,
    content_type: "application/json",
    data: data,
    accessToken: null,
  });
