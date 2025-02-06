import { getToken } from "./auth";
import axios from "axios";

export const requestAPI = async (requestType, url, payload = null) => {
  const token = getToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const apiOptions = {
      method: requestType,
      url,
      ...(token !== null && {headers: headers}),
      data: payload,
    };
    const response = await axios(apiOptions);
    return response;
  } catch (error) {
    console.error(`Error with ${requestType} request to ${url}:`, error);
    throw error;
  }
};
