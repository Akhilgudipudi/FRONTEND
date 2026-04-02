export function StatusPill({ status }) {
  const labels = {
    active: "Active",
    "expiring-soon": "Expiring Soon",
    expired: "Expired",
  };

  return <span className={`status-pill ${status}`}>{labels[status] || status}</span>;
}
