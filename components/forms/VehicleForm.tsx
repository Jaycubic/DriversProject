'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Plus, Trash2 } from 'lucide-react';

interface VehicleData {
  vehicleType: string;
  make: string;
  registrationNumber: string;
  taxAmount: string;
  taxDate: string;
  fitnessDate: string;
}

interface VehicleFormProps {
  fleetSize: string;
  onSubmit: (vehicles: VehicleData[]) => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ fleetSize, onSubmit }) => {
  const getMaxVehicles = (size: string) => {
    switch (size) {
      case '1-5': return 5;
      case '6-10': return 10;
      case '11-20': return 20;
      case '21-50': return 50;
      case '51-100': return 100;
      case '100+': return 200; // Reasonable limit
      default: return 1;
    }
  };

  const maxVehicles = getMaxVehicles(fleetSize);
  const [vehicles, setVehicles] = useState<VehicleData[]>([
    {
      vehicleType: '',
      make: '',
      registrationNumber: '',
      taxAmount: '',
      taxDate: '',
      fitnessDate: ''
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleVehicleChange = (index: number, field: keyof VehicleData, value: string) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles[index] = { ...updatedVehicles[index], [field]: value };
    setVehicles(updatedVehicles);
  };

  const addVehicle = () => {
    if (vehicles.length < maxVehicles) {
      setVehicles([...vehicles, {
        vehicleType: '',
        make: '',
        registrationNumber: '',
        taxAmount: '',
        taxDate: '',
        fitnessDate: ''
      }]);
    }
  };

  const removeVehicle = (index: number) => {
    if (vehicles.length > 1) {
      const updatedVehicles = vehicles.filter((_, i) => i !== index);
      setVehicles(updatedVehicles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(vehicles);
      alert('Vehicle information submitted successfully!');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Truck className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl">Vehicle Information</CardTitle>
        </div>
        <CardDescription>
          Add details for your fleet vehicles (Fleet Size: {fleetSize})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {vehicles.map((vehicle, index) => (
            <Card key={index} className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Vehicle {index + 1}</CardTitle>
                  {vehicles.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeVehicle(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`vehicleType-${index}`}>Vehicle Type *</Label>
                    <Select 
                      value={vehicle.vehicleType} 
                      onValueChange={(value) => handleVehicleChange(index, 'vehicleType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="crane">Crane</SelectItem>
                        <SelectItem value="cab">Cab</SelectItem>
                        <SelectItem value="trailer">Trailer</SelectItem>
                        <SelectItem value="tanker">Tanker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`make-${index}`}>Vehicle Make *</Label>
                    <Select 
                      value={vehicle.make} 
                      onValueChange={(value) => handleVehicleChange(index, 'make', value)}
                    >
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
                        <SelectItem value="bharat-benz">Bharat Benz</SelectItem>
                        <SelectItem value="mahindra">Mahindra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`registrationNumber-${index}`}>Registration Number *</Label>
                    <Input
                      id={`registrationNumber-${index}`}
                      value={vehicle.registrationNumber}
                      onChange={(e) => handleVehicleChange(index, 'registrationNumber', e.target.value)}
                      placeholder="e.g., DL-01-AB-1234"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`taxAmount-${index}`}>Tax Amount (₹) *</Label>
                    <Input
                      id={`taxAmount-${index}`}
                      type="number"
                      value={vehicle.taxAmount}
                      onChange={(e) => handleVehicleChange(index, 'taxAmount', e.target.value)}
                      placeholder="Enter tax amount"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`taxDate-${index}`}>Tax Validity Date *</Label>
                    <Input
                      id={`taxDate-${index}`}
                      type="date"
                      value={vehicle.taxDate}
                      onChange={(e) => handleVehicleChange(index, 'taxDate', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`fitnessDate-${index}`}>Fitness Certificate Date *</Label>
                    <Input
                      id={`fitnessDate-${index}`}
                      type="date"
                      value={vehicle.fitnessDate}
                      onChange={(e) => handleVehicleChange(index, 'fitnessDate', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {vehicles.length < maxVehicles && (
            <div className="text-center">
              <Button type="button" variant="outline" onClick={addVehicle}>
                <Plus className="h-4 w-4 mr-2" />
                Add Another Vehicle ({vehicles.length}/{maxVehicles})
              </Button>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Submitting Vehicle Information...' : 'Submit Vehicle Information'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
