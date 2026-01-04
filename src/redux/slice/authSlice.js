import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
import { register, signIn, getUserById } from "../thunk/authThunk";
import {
  filterJourneyByCourierId,
  getAllCourierByUserId,
  postCourier,
  sendOrderRequest,
} from "../thunk/courierThunk";
import { getUserAllOrders, updateOrderDetails } from "../thunk/orderThunk";
import { getAllJourney } from "../thunk/journeyThunk";

const initialState = {
  user: null,
  couriers: [],
  orders: [],
  loading: false,
  errorMessage: null,
  //   accessToken: null,
  userCoordinate: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: () => {
      AsyncStorage.removeItem("user_id");
      console.log("User logged out successfully");
      return initialState;
    },
    // New reducer to update userCoordinate
    updateUserCoordinate: (state, action) => {
      state.userCoordinate = action.payload; // Update userCoordinate with the payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        console.log("User = ", action.payload);
        state.user = action?.payload?.data;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })

      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        console.log("User = ", action.payload);
        state.user = action?.payload?.data;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Restore user
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        console.log("User = ", action.payload);
        state.user = action?.payload?.data;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      });

    //  Courier
    builder
      .addCase(postCourier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postCourier.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Courier posted successfullyyy", action?.payload?.data);
        state.couriers.push(action?.payload?.data); // Assuming payload contains the new courier data
      })
      .addCase(postCourier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(getAllCourierByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCourierByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.couriers = action?.payload?.data; // Assuming payload contains the new courier data
      })
      .addCase(getAllCourierByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      });

    builder
      .addCase(sendOrderRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOrderRequest.fulfilled, (state, action) => {
        state.loading = false;
        const newOrder = action?.payload?.data;
        console.log("this is new order in slice", newOrder);

        const existingIndex = state.orders.findIndex(
          (order) =>
            order?.courier?.courierId === newOrder?.courier?.courierId &&
            order?.journeyDetails?.journey?.journeyId ===
              newOrder?.journeyDetails?.journey?.journeyId
        );

        if (existingIndex !== -1) {
          // Replace the existing order
          state.orders[existingIndex] = newOrder;
        } else {
          // Add the new unique order
          state.orders.push(newOrder);
        }
      })

      .addCase(sendOrderRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })

      //Update order details
      .addCase(updateOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        const newOrder = action?.payload?.data;
        console.log("this is new order in slice", newOrder);

        const existingIndex = state.orders.findIndex(
          (order) =>
            order?.courier?.courierId === newOrder?.courier?.courierId &&
            order?.journeyDetails?.journey?.journeyId ===
              newOrder?.journeyDetails?.journey?.journeyId
        );

        if (existingIndex !== -1) {
          // Replace the existing order
          state.orders[existingIndex] = newOrder;
        } else {
          // Add the new unique order
          state.orders.push(newOrder);
        }
      })

      .addCase(updateOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })

      //Get all orders
      .addCase(getUserAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action?.payload?.data;
      })

      .addCase(getUserAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      });
    //filterJourneyByCourierId
    builder
      .addCase(filterJourneyByCourierId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterJourneyByCourierId.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(filterJourneyByCourierId.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      });
      //get all journey
    builder
      .addCase(getAllJourney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllJourney.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(getAllJourney.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      });
  },
});

export const {
  setAuthLoaderFalse,
  logoutUser,
  signUpUser,
  updateUserCoordinate,
} = authSlice.actions;

export default authSlice.reducer;
