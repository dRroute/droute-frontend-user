import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserOrdersAPI, updateOrderDetailsAPI } from "../../utils/api/orderApi";
import { handleAxiosError } from "./authThunk";


// Get All Courier By UserId
export const getUserAllOrders = createAsyncThunk(
  "order/getUserAllOrders",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getUserOrdersAPI(data);
      return response?.data;

    } catch (error) {
      console.log("Error in postCourier Thunk:", error);
      return rejectWithValue(handleAxiosError(error));
    }
  }
);


// Update order details 
export const updateOrderDetails = createAsyncThunk(
  "order/updateOrderDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateOrderDetailsAPI(data);
      return response?.data;

    } catch (error) {
      console.log("Error in updateOrderDetails Thunk:", error);
      return rejectWithValue(handleAxiosError(error));
    }
  }
);




