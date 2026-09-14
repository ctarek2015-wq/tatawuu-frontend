function OrganizationList({ organizations }) {
  return (
    <div>
      <h1>organisation List</h1>
      <div>
        <ul>
          {organizations.map((o) => (
            <li key={o._id}>{o.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default OrganizationList;
