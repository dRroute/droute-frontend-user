import Key from "../../constants/key"; // Import Key object
import { apiGetRequest } from "../http/get";

// Constants
const { DRIVER_API_URL } = Key;
// API CALLS
export const getAllNearestJourneyAPI = (userId) =>
  apiGetRequest({
    apiUrl: `${DRIVER_API_URL}/journey/${userId}?status=all`,
    content_type: "application/json",
    data: null,
    accessToken: null,
  });

export const getAllJourneyAPI = () =>
  apiGetRequest({
    apiUrl: `${DRIVER_API_URL}/journey-details`,
    content_type: "application/json",
  });