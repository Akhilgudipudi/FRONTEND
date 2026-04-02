import { format, differenceInDays, parseISO } from 'date-fns';
import { Calendar, Building2, Award, Trash2, Edit, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Certification } from '../types';

interface CertificationCardProps {
  certification: Certification;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function CertificationCard({ certification, onEdit, onDelete }: CertificationCardProps) {
  const daysUntilExpiry = differenceInDays(parseISO(certification.expiryDate), new Date());
  
  const statusConfig = {
    'active': {
      badge: 'bg-green-100 text-green-800 border-green-200',
      label: 'Active'
    },
    'expiring-soon': {
      badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      label: 'Expiring Soon'
    },
    'expired': {
      badge: 'bg-red-100 text-red-800 border-red-200',
      label: 'Expired'
    }
  };

  const status = statusConfig[certification.status];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">{certification.name}</CardTitle>
            </div>
            <Badge className={status.badge} variant="outline">
              {status.label}
            </Badge>
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onEdit(certification.id)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onDelete(certification.id)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building2 className="w-4 h-4" />
          <span>{certification.issuer}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            Issued: {format(parseISO(certification.issueDate), 'MMM d, yyyy')}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4" />
          <span className={daysUntilExpiry < 0 ? 'text-red-600' : daysUntilExpiry <= 30 ? 'text-yellow-600' : 'text-gray-600'}>
            Expires: {format(parseISO(certification.expiryDate), 'MMM d, yyyy')}
          </span>
        </div>

        {certification.status !== 'active' && (
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-gray-600">
              {daysUntilExpiry < 0 
                ? `Expired ${Math.abs(daysUntilExpiry)} days ago`
                : `Expires in ${daysUntilExpiry} days`
              }
            </span>
          </div>
        )}

        {certification.credentialId && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500">Credential ID</p>
            <p className="text-sm font-mono">{certification.credentialId}</p>
          </div>
        )}

        {certification.description && (
          <p className="text-sm text-gray-600 pt-2 border-t">
            {certification.description}
          </p>
        )}

        <div className="pt-2">
          <Badge variant="outline" className="text-xs">
            {certification.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
