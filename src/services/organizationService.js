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
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
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
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
const deleteOrg = async (orgId) => {
  try {
    await fetch(`${BASE_URL}/${orgId}`, {
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
