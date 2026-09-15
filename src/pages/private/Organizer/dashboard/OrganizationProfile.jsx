import { useState, useEffect } from "react";
import OrganizationForm from "./OrganizationForm";
import OrganizationView from "./OrganizationView";
import {
  index,
  create,
  update,
} from "../../../../services/organizationService";

const emptyOrg = {
  id: null,
  name: "",
  description: "",
  governorate: "Capital",
  area: "",
  address: "",
  contactEmail: "",
  contactPhone: "",
  whatsappNumber: "",
  website: "",
  status: "draft",
};

const normalize = (org) => ({ ...emptyOrg, ...org, id: org.id || org._id });

export default function OrganizationProfile() {
  const [organization, setOrganization] = useState(emptyOrg);
  const [mode, setMode] = useState("edit");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const loadOrganization = async () => {
      const orgs = await index();
      if (orgs && orgs.length > 0) {
        setOrganization(normalize(orgs[0]));
        setMode("view");
      }
      setLoading(false);
    };
    loadOrganization();
  }, []);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setSaveError("");
    const payload = {
      ...organization,
      ...formData,
      status: "pending_approval",
    };

    const saved = organization.id
      ? await update(organization.id, payload)
      : await create(payload);

    setSubmitting(false);

    if (!saved) {
      setSaveError("Couldn't submit your profile. Please try again.");
      return;
    }

    setOrganization(normalize(saved));
    setMode("view");
  };

  if (loading) {
    return (
      <div>
        <h2>My organization</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>My organization</h2>

      {saveError && <p>{saveError}</p>}

      {mode === "edit" ? (
        <OrganizationForm
          initialData={organization}
          onCancel={() => setMode("view")}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      ) : (
        <OrganizationView
          organization={organization}
          onEdit={() => setMode("edit")}
        />
      )}
    </div>
  );
}
