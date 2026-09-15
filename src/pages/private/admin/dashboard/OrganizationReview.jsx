import { useContext } from "react";
import { DataContext } from "../../../../contexts/UserContext";

import * as organizationService from "../../../../services/organizationService.js";

const OrganizationReview = () => {
  const { organizations, setOrganizations } = useContext(DataContext);
  return (
    <section>
      <h2>Waiting for Review</h2>
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
                <button type="button">Approve</button>
                <button type="button">Reject</button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default OrganizationReview;
