import { apiPostRequest } from "../http/post";
// import { APP_BACKEND_API } from '@env';
import {apiGetRequest} from '../http/get';
import { apiPutRequest } from "../http/put";
import Key from "../../constants/key"; // Import Key object

// Constants
const { DRIVER_API_URL, USER_API_URL } = Key;

// API CALLS
export const signInAPI = (data) =>
  apiPostRequest({
    apiUrl: `${USER_API_URL}/auth/login`,
    content_type: "application/json",
    data: data,
    // accessToken,
});

export const registerAPI = (data) =>
  apiPostRequest({
    apiUrl: `${USER_API_URL}/auth/signup`,
    content_type: "application/json",
    data: data,
  });

export const getUserByIdAPI = (userId) =>
  apiGetRequest({
    apiUrl: `${USER_API_URL}/${userId}`,
    content_type: "application/json",
  });

export const sendOtpAPI = (data) =>
  apiPostRequest({
    apiUrl: `${USER_API_URL}/auth/sendOTP`,
    content_type: "application/json",
    data: data,
  });

export const resetPasswordAPI = (data) =>
  apiPutRequest({
    apiUrl: `${USER_API_URL}/reset-password`,
    content_type: "application/json",
    data: data,
  });

