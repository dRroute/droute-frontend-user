import { createAsyncThunk } from "@reduxjs/toolkit";
import { completeProfileAPI, getDriverByDriverIdAPI, getUserByIdAPI, resetPasswordAPI, signInAPI } from "../../utils/api/authApi";
import { registerAPI } from "../../utils/api/authApi";
import { sendOtpAPI } from "../../utils/api/authApi";
import axios, { isAxiosError } from "axios";

// Async Thunks
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (data, { rejectWithValue }) => {
    try {
      const response = await signInAPI(data);
      return response.data;
    } catch (error) {
      console.log("Error in postSignIn:", error);
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

export const getUserById = createAsyncThunk(
  "auth/getUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getUserByIdAPI(userId);
      return response.data;
    } catch (error) {
      console.log("Error in getUserById:", error);
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await registerAPI(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await resetPasswordAPI(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);



export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (data, { rejectWithValue }) => {
    try {
      const response = await sendOtpAPI(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

export const handleAxiosError = (error) => {
  if (axios.isAxiosError(error)) {
    console.log('error occured in axios', error);

    if (error.response) {
      // Server responded with a status code outside 2xx
      console.log(error.response.data);
      return error.response.data;

    } else if (error.request) {
      // No response received from the server
      console.log("Network Error: No response received", error.request);
      const data = {
        message: "Oops! Something went wrong with the network. Please try again later.",
        statusCode: 500,
        data: null,
        errorCode: "NETWORK_ERROR",
        timestamp: Date.now(),
      }
      return data;
    } else {
      // Something happened while setting up the request
      console.log("Request Error:", error.message);
      return error.message;
    }
  } else {
    // Non-Axios error (e.g. bug in your code)
    console.log("Unexpected Error:", error);
  }
}
