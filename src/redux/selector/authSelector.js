export const selectUser = (state) => state.auth.user;  // ✅ Get user data
export const selectAuthloader = (state) => state.auth.loading;  // ✅ Get loader data
export const selectAuthErrorMessage = (state) => state.auth.errorMessage;  // ✅ Get errorMessage data
export const selectCouriers = (state) => state.auth.couriers;  // ✅ Get errorMessage data
export const selectOrders = (state) => state.auth.orders;
export const selectAcceptedOrders = (state) => state.auth.orders.filter(data => data?.order?.orderStatus === 'ACCEPTED');
