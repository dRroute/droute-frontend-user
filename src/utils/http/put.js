import axios from "axios";

export const apiPutRequest = async ({ apiUrl, content_type, data, accessToken }) => {
  const headers = {
    "Accept": "*/*",
    "Content-Type": content_type || "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  console.log("PUT Request:", apiUrl);
  console.log("Headers:", headers);
  console.log("Body:", data);

  const response = await axios.put(apiUrl, data, { headers });
  console.log("Response:", response.data);
  return response;
};
