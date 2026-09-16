const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/auth`;

const signUp = async (formData) => {
  const res = await fetch(`${BASE_URL}/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Could not create your account");
  }
  localStorage.setItem("token", data.token);
  return data.user;
};

const signIn = async (formData) => {
  const res = await fetch(`${BASE_URL}/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Could not sign in");
  }
  localStorage.setItem("token", data.token);
  return data.user;
};

const me = async () => {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.error || "Could not load your profile");
    error.status = res.status;
    throw error;
  }
  return data;
};

const updateProfile = async (formData) => {
  const res = await fetch(`${BASE_URL}/me`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Could not update your profile");
  }
  return data;
};

export { signUp, signIn, me, updateProfile };
