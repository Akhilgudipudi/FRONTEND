import { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Plus, Search, Filter } from 'lucide-react';
import { useCertifications } from '../context/CertificationContext';
import { CertificationCard } from '../components/CertificationCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

export function CertificationsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { certifications, deleteCertification } = useCertifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>(searchParams.get('category') || 'all');

  const filteredCertifications = useMemo(() => {
    return certifications.filter(cert => {
      const matchesSearch = 
        cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.credentialId?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || cert.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [certifications, searchQuery, statusFilter, categoryFilter]);

  const handleEdit = (id: string) => {
    navigate(`/certifications/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this certification?')) {
      deleteCertification(id);
      toast.success('Certification deleted successfully');
    }
  };

  const categories = ['Technology', 'Business', 'Health & Safety', 'Finance', 'Education', 'Marketing', 'Other'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">All Certifications</h1>
          <p className="text-gray-600 mt-1">
            {filteredCertifications.length} of {certifications.length} certifications
          </p>
        </div>
        <Link to="/certifications/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search certifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Certifications Grid */}
      {filteredCertifications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCertifications.map(cert => (
            <CertificationCard
              key={cert.id}
              certification={cert}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No certifications found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Add your first certification to get started'
            }
          </p>
          {!(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
            <Link to="/certifications/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
