import { Link } from 'react-router-dom';
import BloodDrop from './BloodDrop.jsx';
import { fmtDate } from '../utils.js';

export default function DonorCard({ donor, user, onDelete }) {
  const canEdit = user && (user.role === 'admin' || String(donor.createdBy) === String(user.id));

  return (
    <article className={`donor ${donor.available ? '' : 'donor-away'}`}>
      <BloodDrop group={donor.bloodGroup} />
      <div className="donor-body">
        <h3>{donor.name}</h3>
        <p className="donor-loc">{donor.location}</p>
        <p className={`status ${donor.available ? 'status-on' : 'status-off'}`}>
          {donor.available ? 'Available to donate' : 'Not available now'}
        </p>
        <p className="donor-meta">Last donated: {fmtDate(donor.lastDonated)}</p>
        {donor.contact ? (
          <a className="donor-contact" href={`tel:${donor.contact}`}>
            {donor.contact}
          </a>
        ) : (
          <p className="donor-meta">
            <Link to="/login">Log in</Link> to see contact details
          </p>
        )}
        {canEdit && (
          <div className="row-actions">
            <Link className="btn btn-small" to={`/donors/${donor._id}/edit`}>
              Edit
            </Link>
            {onDelete && (
              <button className="btn btn-small btn-danger" onClick={() => onDelete(donor)}>
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
