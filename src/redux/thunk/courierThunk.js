import { createAsyncThunk } from "@reduxjs/toolkit";
import { filterJourneyByCourierIdAPI, getAllCourierByUserIdAPI, postCourierAPI, requestOrderForCourierAPI, sendOrderRequestAPI } from "../../utils/api/courierApi";
import { handleAxiosError } from "./authThunk";

// Upload Single File Thunk
export const postCourier = createAsyncThunk(
  "courier/post",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postCourierAPI(data);
      return response?.data;

    } catch (error) {
      console.log("Error in postCourier Thunk:", error);
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

// Upload Single File Thunk
export const filterJourneyByCourierId = createAsyncThunk(
  "courier/filterJourneyByCourierId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await filterJourneyByCourierIdAPI(data);
      return response?.data;

    } catch (error) {
      console.log("Error in postCourier Thunk:", error);
      return rejectWithValue(handleAxiosError(error));
    }
  }
);


// Get All Courier By UserId
export const getAllCourierByUserId = createAsyncThunk(
  "courier/getAllCourierByUserId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getAllCourierByUserIdAPI(data);
      return response?.data;

    } catch (error) {
      console.log("Error in postCourier Thunk:", error);
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

// Request order for courier
export const sendOrderRequest = createAsyncThunk(
  "courier/sendOrderRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await sendOrderRequestAPI(data);
      return response?.data;

    } catch (error) {
      console.log("Error in sendOrderRequest Thunk:", error);
      return rejectWithValue(handleAxiosError(error));
    }
  }
);



