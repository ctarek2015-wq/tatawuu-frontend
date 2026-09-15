import { useContext } from "react";
import { DataContext } from "../../../../contexts/UserContext";

const OrganizationReview = () => {
  const { organizations, setOrganizations } = useContext(DataContext);
  return (
    <section>
      <h2 id="organization-queue-heading">Submitted items</h2>
      {organizations.length === 0 ? (
        <p>No organizations match this status.</p>
      ) : (
        <ul>
          {organizations.map((organization) => {
            const id = organization._id || organization.id;

            return (
              <li key={id}>
                <h3>{organization.name || "Unnamed organization"}</h3>
                <p>{organization.status || "Unknown status"}</p>
                <button
                  type="button"
                  onClick={() =>
                    setOrganizations(
                      organizations.filter((org) => (org._id || org.id) !== id),
                    )
                  }
                >
                  Review
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default OrganizationReview;
