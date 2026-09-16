const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/organizations`;

const index = async () => {
  const res = await fetch(BASE_URL);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Could not load organizations");
  }
  return data;
};

const show = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Could not load organization");
  }
  return data;
};

const showMine = async () => {
  const res = await fetch(`${BASE_URL}/mine`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Could not load your organization");
  }
  return data;
};

const reviewList = async () => {
  const res = await fetch(`${BASE_URL}/review`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Could not load organizations for review");
  }
  return data;
};

const create = async (formData) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Could not create organization");
  }
  return data;
};

const update = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Could not update organization");
  }
  return data;
};

const review = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/${id}/review`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Could not review organization");
  }
  return data;
};

const remove = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Could not delete organization");
  }
};

export { index, show, showMine, reviewList, create, update, review, remove };
