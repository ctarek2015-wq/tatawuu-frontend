const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/Registeration`;

const authHeader = () => `Bearer ${localStorage.getItem("token")}`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL, { headers: { Authorization: authHeader() } });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Unable to load registrations ${res.status}.`);
    }
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const byCampaign = async (campaignId) => {
  try {
    const res = await fetch(`${BASE_URL}/campaign/${campaignId}`, {
      headers: { Authorization: authHeader() },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Unable to load registrations ${res.status}.`);
    }
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const show = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      headers: { Authorization: authHeader() },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Unable to load registration ${res.status}.`);
    }
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const create = async (formData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader(),
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Unable to register ${res.status}.`);
    }
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const update = async (id, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader(),
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Unable to update registration ${res.status}.`);
    }
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const remove = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: authHeader() },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error || `Unable to cancel registration ${res.status}.`);
    }
    return true;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export { index, byCampaign, show, create, update, remove };