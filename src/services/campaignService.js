const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/campaigns`;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const readResponse = async (res) => {
  if (res.status === 204) return true;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Unable to complete this request");
  return data;
};

const index = async () => {
  const res = await fetch(BASE_URL);
  return readResponse(res);
};

const show = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  return readResponse(res);
};

const showMine = async () => {
  const res = await fetch(`${BASE_URL}/mine`, { headers: authHeaders() });
  return readResponse(res);
};

const showOwn = async (id) => {
  const res = await fetch(`${BASE_URL}/mine/${id}`, { headers: authHeaders() });
  return readResponse(res);
};

const reviewList = async () => {
  const res = await fetch(`${BASE_URL}/review`, { headers: authHeaders() });
  return readResponse(res);
};

const showReview = async (id) => {
  const res = await fetch(`${BASE_URL}/review/${id}`, { headers: authHeaders() });
  return readResponse(res);
};

const create = async (formData) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(formData),
  });
  return readResponse(res);
};

const update = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(formData),
  });
  return readResponse(res);
};

const remove = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return readResponse(res);
};

const submit = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/submit`, {
    method: "POST",
    headers: authHeaders(),
  });
  return readResponse(res);
};

const cancel = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/cancel`, {
    method: "POST",
    headers: authHeaders(),
  });
  return readResponse(res);
};

const complete = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/complete`, {
    method: "POST",
    headers: authHeaders(),
  });
  return readResponse(res);
};

const review = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/${id}/review`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(formData),
  });
  return readResponse(res);
};

const activities = async () => {
  const res = await fetch(`${BASE_URL}/activities`, { headers: authHeaders() });
  return readResponse(res);
};

const favorites = async () => {
  const res = await fetch(`${BASE_URL}/favorites`, { headers: authHeaders() });
  return readResponse(res);
};

const certificates = async () => {
  const res = await fetch(`${BASE_URL}/certificates`, { headers: authHeaders() });
  return readResponse(res);
};

const participants = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/participants`, { headers: authHeaders() });
  return readResponse(res);
};

const join = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/participants`, {
    method: "POST",
    headers: authHeaders(),
  });
  return readResponse(res);
};

const leave = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/participants/me`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return readResponse(res);
};

const markAttendance = async (id, volunteerId, attendance) => {
  const res = await fetch(`${BASE_URL}/${id}/participants/${volunteerId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ attendance }),
  });
  return readResponse(res);
};

const favorite = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/favorite`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return readResponse(res);
};

const unfavorite = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/favorite`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return readResponse(res);
};

const grantCertificate = async (id, volunteerId) => {
  const res = await fetch(`${BASE_URL}/${id}/certificates/${volunteerId}`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return readResponse(res);
};

const removeCertificate = async (id, volunteerId) => {
  const res = await fetch(`${BASE_URL}/${id}/certificates/${volunteerId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return readResponse(res);
};

const certificate = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/certificate`, { headers: authHeaders() });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Unable to load your certificate");
  }
  return res.blob();
};

export {
  index,
  show,
  showMine,
  showOwn,
  reviewList,
  showReview,
  create,
  update,
  remove,
  submit,
  cancel,
  complete,
  review,
  activities,
  favorites,
  certificates,
  participants,
  join,
  leave,
  markAttendance,
  favorite,
  unfavorite,
  grantCertificate,
  removeCertificate,
  certificate,
};
