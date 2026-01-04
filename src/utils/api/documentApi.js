import { apiPostRequest } from "../http/post";
import Key from "../../constants/key"; // Import Key object

// Constants
const { DRIVER_API_URL } = Key;
// API CALLS
export const uploadSingleDocumentAPI = (data) =>
  apiPostRequest({
    apiUrl: `${DRIVER_API_URL}/document/custom/uploadToGoogleDrive?entityId=${data?.id}&entityName=${data?.name}&documentName=${data?.documentName}`,
    content_type: "multipart/form-data",
    data: data?.file,
    accessToken: null,
  });
