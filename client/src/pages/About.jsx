const endpoints = [
  ['POST', '/api/auth/register', 'Create an account', 'Public'],
  ['POST', '/api/auth/login', 'Log in and receive a JWT', 'Public'],
  ['GET', '/api/auth/me', 'Current user', 'Logged in'],
  ['GET', '/api/donors', 'Search by blood group, location, availability', 'Public (phone hidden from guests)'],
  ['GET', '/api/donors/stats', 'Donor counts per blood group', 'Public'],
  ['GET', '/api/donors/mine', 'Donors you added', 'Logged in'],
  ['GET', '/api/donors/:id', 'One donor', 'Logged in'],
  ['POST', '/api/donors', 'Add a donor', 'Logged in'],
  ['PUT', '/api/donors/:id', 'Update a donor', 'Owner or admin'],
  ['DELETE', '/api/donors/:id', 'Delete a donor', 'Owner or admin'],
  ['GET', '/api/admin/summary', 'Totals', 'Admin'],
  ['GET', '/api/admin/users', 'List users', 'Admin'],
  ['GET', '/api/admin/donors', 'List all donor records', 'Admin'],
  ['PATCH', '/api/admin/users/:id/role', 'Change a user’s role', 'Admin'],
  ['DELETE', '/api/admin/users/:id', 'Delete a user and their donors', 'Admin'],
];

export default function About() {
  return (
    <section className="page">
      <h1>About this project</h1>
      <p className="lead">
        Blood Donor Finder helps people find blood donors by blood group and location. It is a MERN stack project that
        demonstrates CRUD operations, a REST API, authentication, and role-based access.
      </p>

      <div className="two-col">
        <div className="card">
          <h2>Technology</h2>
          <ul className="plain">
            <li>
              <strong>MongoDB</strong> with Mongoose stores users and donors (name, blood group, location, contact).
            </li>
            <li>
              <strong>Express.js and Node.js</strong> provide the REST API.
            </li>
            <li>
              <strong>React</strong> with React Router builds the interface.
            </li>
            <li>
              <strong>JWT and bcrypt</strong> handle login and password hashing.
            </li>
          </ul>
        </div>
        <div className="card">
          <h2>Who can do what</h2>
          <ul className="plain">
            <li>
              <strong>Guest:</strong> search donors by blood group and location. Phone numbers are hidden.
            </li>
            <li>
              <strong>User:</strong> everything a guest can do, plus see phone numbers, and add, edit, and delete their own donor records.
            </li>
            <li>
              <strong>Admin:</strong> everything a user can do, plus manage all donor records, change user roles, and delete users.
            </li>
          </ul>
        </div>
      </div>

      <h2>REST API</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Purpose</th>
              <th>Access</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map(([m, p, d, a]) => (
              <tr key={m + p}>
                <td>
                  <strong>{m}</strong>
                </td>
                <td>
                  <code>{p}</code>
                </td>
                <td>{d}</td>
                <td>{a}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
