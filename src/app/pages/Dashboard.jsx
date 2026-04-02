import { useMemo } from 'react';
import { Link } from 'react-router';
import { Award, AlertTriangle, CheckCircle2, Clock, Plus } from 'lucide-react';
import { useCertifications } from '../context/CertificationContext';
import { StatsCard } from '../components/StatsCard';
import { CertificationCard } from '../components/CertificationCard';
import { Button } from '../components/ui/button';
import { differenceInDays, parseISO } from 'date-fns';

export function Dashboard() {
  const { certifications } = useCertifications();

  const stats = useMemo(() => {
    const total = certifications.length;
    const active = certifications.filter(c => c.status === 'active').length;
    const expiringSoon = certifications.filter(c => c.status === 'expiring-soon').length;
    const expired = certifications.filter(c => c.status === 'expired').length;

    return { total, active, expiringSoon, expired };
  }, [certifications]);

  const upcomingExpiry = useMemo(() => {
    return certifications
      .filter(c => c.status !== 'expired')
      .sort((a, b) => {
        const daysA = differenceInDays(parseISO(a.expiryDate), new Date());
        const daysB = differenceInDays(parseISO(b.expiryDate), new Date());
        return daysA - daysB;
      })
      .slice(0, 3);
  }, [certifications]);

  const recentCertifications = useMemo(() => {
    return [...certifications]
      .sort((a, b) => parseISO(b.issueDate).getTime() - parseISO(a.issueDate).getTime())
      .slice(0, 3);
  }, [certifications]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Certification Dashboard</h1>
          <p className="text-gray-600 mt-1">Track and manage your professional certifications</p>
        </div>
        <Link to="/certifications/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Certifications"
          value={stats.total}
          icon={Award}
          variant="default"
        />
        <StatsCard
          title="Active"
          value={stats.active}
          icon={CheckCircle2}
          variant="success"
        />
        <StatsCard
          title="Expiring Soon"
          value={stats.expiringSoon}
          icon={Clock}
          variant="warning"
          description="Within 30 days"
        />
        <StatsCard
          title="Expired"
          value={stats.expired}
          icon={AlertTriangle}
          variant="danger"
          description="Needs renewal"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Soon */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Expiring Soon</h2>
            <Link to="/certifications">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingExpiry.length > 0 ? (
              upcomingExpiry.map(cert => (
                <CertificationCard key={cert.id} certification={cert} />
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-gray-600">All certifications are up to date!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recently Added */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recently Added</h2>
            <Link to="/certifications">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentCertifications.length > 0 ? (
              recentCertifications.map(cert => (
                <CertificationCard key={cert.id} certification={cert} />
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No certifications yet</p>
                <Link to="/certifications/new">
                  <Button className="mt-3" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Certification
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories Overview */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {['Technology', 'Business', 'Health & Safety', 'Finance', 'Education', 'Marketing'].map(category => {
            const count = certifications.filter(c => c.category === category).length;
            return (
              <Link key={category} to={`/certifications?category=${category}`}>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <p className="text-sm text-gray-600">{category}</p>
                  <p className="text-2xl font-semibold mt-1">{count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
