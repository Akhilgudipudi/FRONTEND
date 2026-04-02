import { NavLink, Route, Routes } from "react-router";
import { Award, ClipboardList, LayoutDashboard, PlusCircle } from "lucide-react";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { CertificationsPage } from "./pages/CertificationsPage.jsx";
import { CertificationFormPage } from "./pages/CertificationFormPage.jsx";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/certifications", label: "Certifications", icon: ClipboardList },
  { to: "/certifications/new", label: "Add New", icon: PlusCircle },
];

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-block">
          <div className="brand-badge">
            <Award size={26} />
          </div>
          <div>
            <p className="brand-kicker">SkillCert Tracker</p>
            <h1>Certification lifecycle management made simple.</h1>
          </div>
        </div>

        <nav className="top-nav" aria-label="Primary">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="content-shell">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/certifications/new" element={<CertificationFormPage />} />
          <Route path="/certifications/:id/edit" element={<CertificationFormPage />} />
        </Routes>
      </main>
    </div>
  );
}
