'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MainNavigation } from '@/components/layout/MainNavigation';
import { Search, AlertTriangle, Shield, Eye, Calendar, MapPin, Phone } from 'lucide-react';

const blacklistedDrivers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    dlNumber: "DL-07-20180012345",
    phoneNumber: "+91-98765*****",
    lastKnownLocation: "Delhi, India",
    blacklistDate: "2025-08-15",
    reason: "Multiple traffic violations and reckless driving",
    severity: "High",
    reportedBy: "ABC Transport Ltd."
  },
  {
    id: 2,
    name: "Suresh Patel",
    dlNumber: "DL-24-20190067890",
    phoneNumber: "+91-87654*****",
    lastKnownLocation: "Gujarat, India",
    blacklistDate: "2025-07-22",
    reason: "Vehicle abandonment and contract breach",
    severity: "Medium",
    reportedBy: "XYZ Logistics"
  },
  {
    id: 3,
    name: "Amit Singh",
    dlNumber: "DL-10-20200098765",
    phoneNumber: "+91-76543*****",
    lastKnownLocation: "Bihar, India",
    blacklistDate: "2025-06-10",
    reason: "Theft of goods and fraudulent activities",
    severity: "Critical",
    reportedBy: "Quick Delivery Services"
  },
  {
    id: 4,
    name: "Mohan Sharma",
    dlNumber: "DL-03-20170054321",
    phoneNumber: "+91-65432*****",
    lastKnownLocation: "Punjab, India",
    blacklistDate: "2025-05-28",
    reason: "Driving under influence and safety violations",
    severity: "High",
    reportedBy: "Safe Transport Co."
  },
  {
    id: 5,
    name: "Vikram Yadav",
    dlNumber: "DL-09-20210011111",
    phoneNumber: "+91-54321*****",
    lastKnownLocation: "Uttar Pradesh, India",
    blacklistDate: "2025-04-15",
    reason: "Unprofessional behavior and customer complaints",
    severity: "Medium",
    reportedBy: "Professional Movers"
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical': return 'destructive';
    case 'High': return 'destructive';
    case 'Medium': return 'secondary';
    default: return 'outline';
  }
};

export default function BlacklistedDriversPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDrivers, setFilteredDrivers] = useState(blacklistedDrivers);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredDrivers(blacklistedDrivers);
      return;
    }

    const filtered = blacklistedDrivers.filter(driver =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.dlNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phoneNumber.includes(searchTerm)
    );
    setFilteredDrivers(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <h1 className="text-4xl font-bold">Blacklisted Drivers Database</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive database of drivers who have been blacklisted due to safety violations, 
            unprofessional conduct, or fraudulent activities. This helps transport companies make informed hiring decisions.
          </p>
        </div>

        {/* Warning Notice */}
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-red-500 mt-1" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Important Notice</h3>
              <p className="text-red-700 dark:text-red-300 text-sm">
                This database is maintained for safety and security purposes. All information is verified and reported by registered transport companies. 
                If you believe there's an error in the listing, please contact our support team immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Blacklisted Drivers
            </CardTitle>
            <CardDescription>
              Search by name, driving license number, or phone number to verify driver status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Term</Label>
                <Input
                  id="search"
                  placeholder="Enter name, DL number, or phone number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredDrivers.length} of {blacklistedDrivers.length} blacklisted drivers
          </p>
        </div>

        {/* Blacklisted Drivers List */}
        <div className="space-y-6 mb-12">
          {filteredDrivers.map((driver) => (
            <Card key={driver.id} className="border-red-200 dark:border-red-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-red-700 dark:text-red-300">
                      {driver.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <strong>DL Number:</strong> {driver.dlNumber}
                    </CardDescription>
                  </div>
                  <Badge variant={getSeverityColor(driver.severity)}>
                    {driver.severity} Risk
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{driver.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{driver.lastKnownLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Blacklisted: {driver.blacklistDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Reported by: {driver.reportedBy}</span>
                  </div>
                </div>
                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Reason for Blacklisting:</h4>
                  <p className="text-red-700 dark:text-red-300 text-sm">{driver.reason}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredDrivers.length === 0 && searchTerm && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground">
                No blacklisted drivers found matching your search criteria.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <CardTitle className="text-2xl font-bold text-red-500">
                {blacklistedDrivers.length}
              </CardTitle>
              <CardDescription>Total Blacklisted Drivers</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-orange-500 mx-auto mb-2" />
              <CardTitle className="text-2xl font-bold text-orange-500">
                {blacklistedDrivers.filter(d => d.severity === 'Critical').length}
              </CardTitle>
              <CardDescription>Critical Risk Drivers</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Eye className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <CardTitle className="text-2xl font-bold text-blue-500">
                {blacklistedDrivers.filter(d => d.blacklistDate.startsWith('2025')).length}
              </CardTitle>
              <CardDescription>Blacklisted This Year</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Report a Driver */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Report a Driver
            </CardTitle>
            <CardDescription>
              If you've encountered a driver who should be blacklisted, please report them to help maintain safety standards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1" variant="destructive">
                Report Dangerous Driver
              </Button>
              <Button className="flex-1" variant="outline">
                Appeal Blacklist Decision
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Blacklisting Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Multiple traffic violations</li>
                <li>• Reckless or dangerous driving</li>
                <li>• Theft or fraudulent activities</li>
                <li>• Contract breaches and unprofessional behavior</li>
                <li>• Driving under influence</li>
                <li>• Safety protocol violations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verification Process</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• All reports are thoroughly investigated</li>
                <li>• Evidence and documentation required</li>
                <li>• Multiple company verification</li>
                <li>• Legal compliance checks</li>
                <li>• Appeal process available</li>
                <li>• Regular database updates</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
