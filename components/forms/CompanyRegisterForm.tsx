'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Upload } from 'lucide-react';

interface CompanyRegisterFormData {
  contactPersonName: string;
  designation: string;
  companyName: string;
  transportCategory: string;
  description: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  mobile: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  fleetSize: string;
}

export const CompanyRegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<CompanyRegisterFormData>({
    contactPersonName: '',
    designation: '',
    companyName: '',
    transportCategory: '',
    description: '',
    address: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    mobile: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    fleetSize: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof CompanyRegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Registration successful! Please check your email and SMS for verification.');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Building className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl">Company Registration</CardTitle>
        </div>
        <CardDescription>
          Register your transport company with DriverConnect
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Person Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPersonName">Contact Person Name *</Label>
              <Input
                id="contactPersonName"
                value={formData.contactPersonName}
                onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                placeholder="Enter contact person name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation *</Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                placeholder="Enter designation"
                required
              />
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transportCategory">Transport Category *</Label>
            <Select value={formData.transportCategory} onValueChange={(value) => handleInputChange('transportCategory', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select transport category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="non-commercial">Non-Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your company and services"
              rows={4}
            />
          </div>

          {/* Address Details */}
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter complete address"
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="Country"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="State"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pin Code *</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                placeholder="Pin Code"
                required
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                placeholder="Enter mobile number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email ID *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          {/* Login Credentials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Choose username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>
          </div>

          {/* Fleet Size */}
          <div className="space-y-2">
            <Label htmlFor="fleetSize">Number of Fleet *</Label>
            <Select value={formData.fleetSize} onValueChange={(value) => handleInputChange('fleetSize', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select fleet size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-5">1-5 vehicles</SelectItem>
                <SelectItem value="6-10">6-10 vehicles</SelectItem>
                <SelectItem value="11-20">11-20 vehicles</SelectItem>
                <SelectItem value="21-50">21-50 vehicles</SelectItem>
                <SelectItem value="51-100">51-100 vehicles</SelectItem>
                <SelectItem value="100+">100+ vehicles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register Company'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
