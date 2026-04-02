export function StatCard({ label, value, caption }) {
  return (
    <article className="stat-card">
      <p>{label}</p>
      <strong>{value}</strong>
      {caption ? <span>{caption}</span> : null}
    </article>
  );
}
