const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/Registeration`;
const headers = `Bearer ${localStorage.getItem("token")}`;
const index = async () => {
  try {
    const res = await fetch(BASE_URL, { headers: { Authorization: headers } });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const show = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      headers: { Authorization: headers },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const create = async (formData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: headers,
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const update = async (id, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: headers,
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const remove = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: headers,
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export { index, show, create, update, remove };
