import { format, parseISO } from "date-fns";
import { Link } from "react-router";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import { StatusPill } from "./StatusPill.jsx";

export function CertificationCard({ certification, onDelete }) {
  return (
    <article className="certificate-card">
      <div className="certificate-header">
        <div>
          <h3>{certification.name}</h3>
          <p>{certification.issuer}</p>
        </div>
        <StatusPill status={certification.status} />
      </div>

      <dl className="certificate-details">
        <div>
          <dt>Category</dt>
          <dd>{certification.category}</dd>
        </div>
        <div>
          <dt>Issued</dt>
          <dd>{format(parseISO(certification.issueDate), "MMM d, yyyy")}</dd>
        </div>
        <div>
          <dt>Expires</dt>
          <dd>{format(parseISO(certification.expiryDate), "MMM d, yyyy")}</dd>
        </div>
        <div>
          <dt>Credential ID</dt>
          <dd>{certification.credentialId || "Not provided"}</dd>
        </div>
      </dl>

      {certification.description ? <p className="certificate-description">{certification.description}</p> : null}

      <div className="certificate-actions">
        <span className="inline-note">
          <CalendarDays size={15} />
          Server-calculated status
        </span>

        <div className="button-row">
          <Link className="button ghost" to={`/certifications/${certification.id}/edit`}>
            <Pencil size={15} />
            Edit
          </Link>
          <button className="button danger" type="button" onClick={() => onDelete(certification.id)}>
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
