const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/uploads`;

const upload = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Could not upload image");
  }
  return data;
};

export { upload };
