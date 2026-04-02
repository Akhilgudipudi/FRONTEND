import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { useCertifications } from '../context/CertificationContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { CategoryType } from '../types';

interface FormData {
  name: string;
  issuer: string;
  category: CategoryType;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  description: string;
}

export function CertificationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addCertification, updateCertification, getCertificationById } = useCertifications();
  const isEditing = !!id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>();

  const categoryValue = watch('category');

  useEffect(() => {
    if (isEditing && id) {
      const cert = getCertificationById(id);
      if (cert) {
        setValue('name', cert.name);
        setValue('issuer', cert.issuer);
        setValue('category', cert.category as CategoryType);
        setValue('issueDate', cert.issueDate);
        setValue('expiryDate', cert.expiryDate);
        setValue('credentialId', cert.credentialId || '');
        setValue('description', cert.description || '');
      } else {
        toast.error('Certification not found');
        navigate('/certifications');
      }
    }
  }, [isEditing, id, getCertificationById, setValue, navigate]);

  const onSubmit = (data: FormData) => {
    if (isEditing && id) {
      updateCertification(id, data);
      toast.success('Certification updated successfully');
    } else {
      addCertification(data);
      toast.success('Certification added successfully');
    }
    navigate('/certifications');
  };

  const categories: CategoryType[] = [
    'Technology',
    'Business',
    'Health & Safety',
    'Finance',
    'Education',
    'Marketing',
    'Other'
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/certifications')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-semibold">
            {isEditing ? 'Edit Certification' : 'Add New Certification'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update certification details' : 'Add a new professional certification'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Certification Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Certification Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Certification Name <span className="text-red-600">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., AWS Certified Solutions Architect"
                {...register('name', { required: 'Certification name is required' })}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Issuing Organization */}
            <div className="space-y-2">
              <Label htmlFor="issuer">
                Issuing Organization <span className="text-red-600">*</span>
              </Label>
              <Input
                id="issuer"
                placeholder="e.g., Amazon Web Services"
                {...register('issuer', { required: 'Issuing organization is required' })}
              />
              {errors.issuer && (
                <p className="text-sm text-red-600">{errors.issuer.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-600">*</span>
              </Label>
              <Select
                value={categoryValue}
                onValueChange={(value) => setValue('category', value as CategoryType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">
                  Issue Date <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="issueDate"
                  type="date"
                  {...register('issueDate', { required: 'Issue date is required' })}
                />
                {errors.issueDate && (
                  <p className="text-sm text-red-600">{errors.issueDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">
                  Expiry Date <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="expiryDate"
                  type="date"
                  {...register('expiryDate', { required: 'Expiry date is required' })}
                />
                {errors.expiryDate && (
                  <p className="text-sm text-red-600">{errors.expiryDate.message}</p>
                )}
              </div>
            </div>

            {/* Credential ID */}
            <div className="space-y-2">
              <Label htmlFor="credentialId">Credential ID</Label>
              <Input
                id="credentialId"
                placeholder="e.g., AWS-CSA-2023-5892"
                {...register('credentialId')}
              />
              <p className="text-xs text-gray-500">
                Optional: Enter the unique identifier for this certification
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the certification..."
                rows={4}
                {...register('description')}
              />
              <p className="text-xs text-gray-500">
                Optional: Add notes about what this certification covers
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button type="submit">
                {isEditing ? 'Update Certification' : 'Add Certification'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/certifications')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
