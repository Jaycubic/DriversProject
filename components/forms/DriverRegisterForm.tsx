'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Upload, Calendar } from 'lucide-react';

interface DriverRegisterFormData {
  driverName: string;
  phoneNumber: string;
  aadharCard: string;
  dlNumber: string;
  dlIssuingAuthority: string;
  dlStartDate: string;
  dlExpiryDate: string;
  address: string;
  email: string;
  panCard: string;
  companyName: string;
  designation: string;
  joiningDate: string;
  leavingDate: string;
  vehicleType: string;
  vehicleMake: string;
  vehicleRegistrationNumber: string;
  routeRegion: string;
  routeCities: string;
}

export const DriverRegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<DriverRegisterFormData>({
    driverName: '',
    phoneNumber: '',
    aadharCard: '',
    dlNumber: '',
    dlIssuingAuthority: '',
    dlStartDate: '',
    dlExpiryDate: '',
    address: '',
    email: '',
    panCard: '',
    companyName: '',
    designation: '',
    joiningDate: '',
    leavingDate: '',
    vehicleType: '',
    vehicleMake: '',
    vehicleRegistrationNumber: '',
    routeRegion: '',
    routeCities: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [dlFile, setDlFile] = useState<File | null>(null);

  const handleInputChange = (field: keyof DriverRegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (type: 'profile' | 'aadhar' | 'dl', file: File | null) => {
    if (type === 'profile') setProfilePic(file);
    if (type === 'aadhar') setAadharFile(file);
    if (type === 'dl') setDlFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Driver registration successful! Your profile is under review.');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Truck className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl">Driver Registration</CardTitle>
        </div>
        <CardDescription>
          Register as a professional driver with DriverConnect
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="driverName">Driver Name *</Label>
                <Input
                  id="driverName"
                  value={formData.driverName}
                  onChange={(e) => handleInputChange('driverName', e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profilePic">Upload Profile Picture (Max 2MB)</Label>
              <Input
                id="profilePic"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('profile', e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aadharCard">Aadhar Card Number *</Label>
                <Input
                  id="aadharCard"
                  value={formData.aadharCard}
                  onChange={(e) => handleInputChange('aadharCard', e.target.value)}
                  placeholder="Enter Aadhar number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadharFile">Upload Aadhar Card *</Label>
                <Input
                  id="aadharFile"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('aadhar', e.target.files?.[0] || null)}
                  className="cursor-pointer"
                  required
                />
              </div>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email ID</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panCard">PAN Card *</Label>
                <Input
                  id="panCard"
                  value={formData.panCard}
                  onChange={(e) => handleInputChange('panCard', e.target.value)}
                  placeholder="Enter PAN number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Driving License Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Driving License Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dlNumber">DL Number *</Label>
                <Input
                  id="dlNumber"
                  value={formData.dlNumber}
                  onChange={(e) => handleInputChange('dlNumber', e.target.value)}
                  placeholder="Enter DL number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dlFile">Upload DL Copy *</Label>
                <Input
                  id="dlFile"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('dl', e.target.files?.[0] || null)}
                  className="cursor-pointer"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dlIssuingAuthority">DL Issuing Authority</Label>
                <Input
                  id="dlIssuingAuthority"
                  value={formData.dlIssuingAuthority}
                  onChange={(e) => handleInputChange('dlIssuingAuthority', e.target.value)}
                  placeholder="Enter issuing authority"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dlStartDate">DL Start Date</Label>
                <Input
                  id="dlStartDate"
                  type="date"
                  value={formData.dlStartDate}
                  onChange={(e) => handleInputChange('dlStartDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dlExpiryDate">DL Expiry Date</Label>
                <Input
                  id="dlExpiryDate"
                  type="date"
                  value={formData.dlExpiryDate}
                  onChange={(e) => handleInputChange('dlExpiryDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Employment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  placeholder="Enter designation"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leavingDate">Leaving Date</Label>
                <Input
                  id="leavingDate"
                  type="date"
                  value={formData.leavingDate}
                  onChange={(e) => handleInputChange('leavingDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select value={formData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="crane">Crane</SelectItem>
                    <SelectItem value="cab">Cab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleMake">Vehicle Make</Label>
                <Select value={formData.vehicleMake} onValueChange={(value) => handleInputChange('vehicleMake', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle make" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tata">TATA</SelectItem>
                    <SelectItem value="ashok-leyland">Ashok Leyland</SelectItem>
                    <SelectItem value="daimler">Daimler</SelectItem>
                    <SelectItem value="volvo">Volvo</SelectItem>
                    <SelectItem value="eicher">Eicher</SelectItem>
                    <SelectItem value="man">MAN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleRegistrationNumber">Vehicle Registration Number</Label>
                <Input
                  id="vehicleRegistrationNumber"
                  value={formData.vehicleRegistrationNumber}
                  onChange={(e) => handleInputChange('vehicleRegistrationNumber', e.target.value)}
                  placeholder="Enter registration number"
                />
              </div>
            </div>
          </div>

          {/* Route Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Route Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="routeRegion">Route Region</Label>
                <Select value={formData.routeRegion} onValueChange={(value) => handleInputChange('routeRegion', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select route region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north">North</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="routeCities">Route Cities</Label>
                <Textarea
                  id="routeCities"
                  value={formData.routeCities}
                  onChange={(e) => handleInputChange('routeCities', e.target.value)}
                  placeholder="Enter cities you operate in (comma separated)"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register as Driver'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
