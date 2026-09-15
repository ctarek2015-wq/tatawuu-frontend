const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/organizations`;

const create = async (formData) => {
  try {
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
      console.log("Create failed:", data.error);
      return null;
    }
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const index = async () => {
  try {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    if (!res.ok) {
      console.log("Index failed:", data.error);
      return null;
    }
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const showMine = async () => {
  try {
    const res = await fetch(`${BASE_URL}/mine`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.status === 404) {
      return null;
    }
    const data = await res.json();
    if (!res.ok) {
      console.log("ShowMine failed:", data.error);
      return null;
    }
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const show = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    const data = await res.json();
    if (!res.ok) {
      console.log("Show failed:", data.error);
      return null;
    }
    return data;
  } catch (error) {
    console.log(error);
    return null;
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
    if (!res.ok) {
      console.log("Update failed:", data.error);
      return null;
    }
    return data;
  } catch (err) {
    console.log(err);
    return null;
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
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      console.log("Delete failed:", data?.error);
      return null;
    }
    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { index, showMine, show, create, update, deleteOrg as delete };
