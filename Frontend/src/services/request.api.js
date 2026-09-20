import api from "./api";

export const getReceivedRequests = async () => {
  const response = await api.get("/requests/received");

  return response.data;
};

export const getSentRequests = async () => {
  const response = await api.get("/requests/sent");
  return response.data;
};

export const acceptJoinRequest = async (requestId) => {
  const response = await api.patch(
    `/requests/${requestId}/accept`
  );

  return response.data;
};

export const rejectJoinRequest = async (requestId) => {
  const response = await api.patch(
    `/requests/${requestId}/reject`
  );

  return response.data;
};

