import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Search } from "lucide-react";
import { useCertifications, CATEGORY_OPTIONS } from "../state/CertificationsContext.jsx";
import { CertificationCard } from "../components/CertificationCard.jsx";
import { PageState } from "../components/PageState.jsx";

export function CertificationsPage() {
  const { certifications, loading, error, deleteCertification, reload } = useCertifications();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return certifications.filter((item) => {
      const haystack = [item.name, item.issuer, item.credentialId || "", item.category].join(" ").toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesStatus = status === "all" || item.status === status;
      const matchesCategory = category === "all" || item.category === category;
      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [category, certifications, query, status]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this certification?")) {
      await deleteCertification(id);
    }
  };

  if (loading) {
    return <PageState title="Loading certifications" message="Fetching your latest records." />;
  }

  if (error) {
    return (
      <PageState
        title="Unable to load certifications"
        message={error}
        action={
          <button className="button primary" type="button" onClick={reload}>
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Records</p>
          <h2>Search, filter, edit, and retire certifications from one place.</h2>
        </div>
        <Link to="/certifications/new" className="button primary">
          Add Certification
        </Link>
      </section>

      <section className="filter-bar">
        <label className="search-field">
          <Search size={16} />
          <input
            type="search"
            value={query}
            placeholder="Search by certification, issuer, or credential ID"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="expiring-soon">Expiring soon</option>
          <option value="expired">Expired</option>
        </select>

        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          {CATEGORY_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>

      {filtered.length ? (
        <section className="cards-grid">
          {filtered.map((item) => (
            <CertificationCard key={item.id} certification={item} onDelete={handleDelete} />
          ))}
        </section>
      ) : (
        <PageState
          title="No matches found"
          message="Try clearing a filter or adding a new certification."
          action={
            <Link to="/certifications/new" className="button primary">
              Create record
            </Link>
          }
        />
      )}
    </div>
  );
}
