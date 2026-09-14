const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/organizations`;

const create = async (FormData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(FormData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const index = async () => {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) {
      throw new Error(`Unable to load organizations ${res.status}.`);
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
      throw new Error(`Unable to update organization ${res.status}.`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteOrg = async (orgId) => {
  try {
    const res = await fetch(`${BASE_URL}/${orgId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export { index, show, create, update, deleteOrg as delete };
