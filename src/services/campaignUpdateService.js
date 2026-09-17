const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/campaigns`;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const readResponse = async (response) => {
  if (response.status === 204) return true;
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "Unable to complete this request");
  return data;
};

const index = async (campaignId) => {
  const response = await fetch(`${BASE_URL}/${campaignId}/updates`);
  return readResponse(response);
};

const showMine = async (campaignId) => {
  const response = await fetch(`${BASE_URL}/mine/${campaignId}/updates`, {
    headers: authHeaders(),
  });
  return readResponse(response);
};

const create = async (campaignId, text) => {
  const response = await fetch(`${BASE_URL}/${campaignId}/updates`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ text }),
  });
  return readResponse(response);
};

const update = async (campaignId, updateId, text) => {
  const response = await fetch(
    `${BASE_URL}/${campaignId}/updates/${updateId}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ text }),
    },
  );
  return readResponse(response);
};

const remove = async (campaignId, updateId) => {
  const response = await fetch(
    `${BASE_URL}/${campaignId}/updates/${updateId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );
  return readResponse(response);
};

export { index, showMine, create, update, remove };
