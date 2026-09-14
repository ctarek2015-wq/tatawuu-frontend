const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/campaigns`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) {
      throw new Error(`Unable to load campaigns ${res.status}.`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const show = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const create = async (formData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      throw new Error(`Unable to update campaign ${res.status}.`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const remove = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
