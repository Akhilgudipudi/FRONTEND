import { Link } from "react-router";
import { format, parseISO } from "date-fns";
import { ArrowRight, RefreshCcw } from "lucide-react";
import { useCertifications } from "../state/CertificationsContext.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { PageState } from "../components/PageState.jsx";
import { StatusPill } from "../components/StatusPill.jsx";

export function DashboardPage() {
  const { summary, loading, error, refreshing, reload } = useCertifications();

  // ✅ fallback to prevent crashes when summary is not loaded yet
  const safeSummary = summary || {
    total: 0,
    active: 0,
    expiringSoon: 0,
    expired: 0,
    upcoming: [],
    recent: [],
    categories: [],
  };

  if (loading) {
    return (
      <PageState
        title="Loading dashboard"
        message="Pulling certification metrics from the backend."
      />
    );
  }

  if (error) {
    return (
      <PageState
        title="Unable to load dashboard"
        message={error}
        action={
          <button className="button primary" type="button" onClick={reload}>
            Try again
          </button>
        }
      />
    );
  }

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Stay ahead of renewals and keep every certification organized.</h2>
        </div>
        <button
          className="button ghost"
          type="button"
          onClick={reload}
          disabled={refreshing}
        >
          <RefreshCcw size={16} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </section>

      {/* ✅ Stats */}
      <section className="stats-grid">
        <StatCard label="Total" value={safeSummary.total} caption="All certifications" />
        <StatCard label="Active" value={safeSummary.active} caption="Currently valid" />
        <StatCard
          label="Expiring Soon"
          value={safeSummary.expiringSoon}
          caption="Within 30 days"
        />
        <StatCard label="Expired" value={safeSummary.expired} caption="Renewal needed" />
      </section>

      {/* ✅ Panels */}
      <section className="panel-grid">
        <article className="panel-card">
          <div className="panel-header">
            <h3>Upcoming Expiry</h3>
            <Link to="/certifications" className="text-link">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {safeSummary.upcoming.length ? (
            <div className="compact-list">
              {safeSummary.upcoming.map((item) => (
                <div className="compact-row" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>
                      {item.issuer} •{" "}
                      {format(parseISO(item.expiryDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <StatusPill status={item.status} />
                </div>
              ))}
            </div>
          ) : (
            <PageState
              title="No pending renewals"
              message="Everything is currently active."
            />
          )}
        </article>

        <article className="panel-card">
          <div className="panel-header">
            <h3>Recently Added</h3>
            <Link to="/certifications/new" className="text-link">
              Add certification <ArrowRight size={14} />
            </Link>
          </div>

          {safeSummary.recent.length ? (
            <div className="compact-list">
              {safeSummary.recent.map((item) => (
                <div className="compact-row" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>
                      {item.category} • Issued{" "}
                      {format(parseISO(item.issueDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <StatusPill status={item.status} />
                </div>
              ))}
            </div>
          ) : (
            <PageState
              title="Nothing here yet"
              message="Add your first certification to build the dashboard."
            />
          )}
        </article>
      </section>

      {/* ✅ Categories */}
      <section className="panel-card">
        <div className="panel-header">
          <h3>Category Distribution</h3>
        </div>
        <div className="category-grid">
          {safeSummary.categories.length ? (
            safeSummary.categories.map((item) => (
              <div key={item.category} className="category-tile">
                <span>{item.category}</span>
                <strong>{item.count}</strong>
              </div>
            ))
          ) : (
            <PageState title="No data" message="No categories available yet." />
          )}
        </div>
      </section>
    </div>
  );
}
