import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useCertifications, CATEGORY_OPTIONS } from "../state/CertificationsContext.jsx";
import { PageState } from "../components/PageState.jsx";

const EMPTY_FORM = {
  name: "",
  issuer: "",
  category: "Technology",
  issueDate: "",
  expiryDate: "",
  credentialId: "",
  description: "",
};

export function CertificationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { getCertificationById, addCertification, updateCertification, loading } = useCertifications();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const existing = getCertificationById(id);
    if (existing) {
      setForm({
        name: existing.name,
        issuer: existing.issuer,
        category: existing.category,
        issueDate: existing.issueDate,
        expiryDate: existing.expiryDate,
        credentialId: existing.credentialId || "",
        description: existing.description || "",
      });
    }
  }, [getCertificationById, id, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name || !form.issuer || !form.issueDate || !form.expiryDate || !form.category) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.issueDate > form.expiryDate) {
      setError("Expiry date must be after the issue date.");
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateCertification(id, form);
      } else {
        await addCertification(form);
      }
      navigate("/certifications");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && isEditing) {
    return <PageState title="Loading certification" message="Preparing the edit form." />;
  }

  if (isEditing && !getCertificationById(id)) {
    return (
      <PageState
        title="Certification not found"
        message="The record you tried to edit does not exist."
        action={
          <Link className="button primary" to="/certifications">
            Back to list
          </Link>
        }
      />
    );
  }

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">{isEditing ? "Update" : "Create"}</p>
          <h2>{isEditing ? "Edit certification details." : "Add a new certification record."}</h2>
        </div>
        <Link to="/certifications" className="button ghost">
          Back to list
        </Link>
      </section>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            <span>Certification Name</span>
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            <span>Issuer</span>
            <input name="issuer" value={form.issuer} onChange={handleChange} required />
          </label>

          <label>
            <span>Category</span>
            <select name="category" value={form.category} onChange={handleChange} required>
              {CATEGORY_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Credential ID</span>
            <input name="credentialId" value={form.credentialId} onChange={handleChange} />
          </label>

          <label>
            <span>Issue Date</span>
            <input name="issueDate" type="date" value={form.issueDate} onChange={handleChange} required />
          </label>

          <label>
            <span>Expiry Date</span>
            <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} required />
          </label>

          <label className="full-span">
            <span>Description</span>
            <textarea name="description" rows="5" value={form.description} onChange={handleChange} />
          </label>
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        <div className="form-actions">
          <button className="button primary" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : isEditing ? "Update Certification" : "Create Certification"}
          </button>
          <Link className="button ghost" to="/certifications">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
