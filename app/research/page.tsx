'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileText, Download, Calendar, Users, TrendingUp, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

const researchReports = [
  {
    id: 1,
    title: "Indian Transportation Industry Report 2025",
    description: "Comprehensive analysis of the Indian transportation sector including market size, growth trends, and future projections.",
    publishDate: "August 2025",
    pages: 120,
    category: "Industry Analysis",
    downloadCount: 2500,
    featured: true
  },
  {
    id: 2,
    title: "Driver Shortage Crisis: Causes and Solutions",
    description: "In-depth study on the growing driver shortage in India and actionable strategies to address this critical issue.",
    publishDate: "July 2025",
    pages: 85,
    category: "Workforce",
    downloadCount: 1800
  },
  {
    id: 3,
    title: "Technology Adoption in Fleet Management",
    description: "Research on how Indian transport companies are adopting digital technologies and the impact on operational efficiency.",
    publishDate: "June 2025",
    pages: 95,
    category: "Technology",
    downloadCount: 2100
  },
  {
    id: 4,
    title: "Safety Standards and Compliance in Transportation",
    description: "Analysis of current safety standards, compliance rates, and recommendations for improving road safety.",
    publishDate: "May 2025",
    pages: 110,
    category: "Safety",
    downloadCount: 1600
  },
  {
    id: 5,
    title: "Economic Impact of Transportation Sector",
    description: "Study on the economic contribution of the transportation industry to India's GDP and employment generation.",
    publishDate: "April 2025",
    pages: 75,
    category: "Economics",
    downloadCount: 1400
  },
  {
    id: 6,
    title: "Sustainability in Transportation: Green Initiatives",
    description: "Research on environmental impact and sustainable practices being adopted by transport companies.",
    publishDate: "March 2025",
    pages: 90,
    category: "Sustainability",
    downloadCount: 1200
  }
];

const statistics = [
  {
    title: "Transport Companies Surveyed",
    value: "2,500+",
    icon: Users,
    description: "Across 28 states and 8 union territories"
  },
  {
    title: "Professional Drivers Interviewed",
    value: "15,000+",
    icon: Users,
    description: "From various vehicle categories"
  },
  {
    title: "Research Reports Published",
    value: "25+",
    icon: FileText,
    description: "Covering different aspects of transportation"
  },
  {
    title: "Data Points Analyzed",
    value: "1M+",
    icon: BarChart3,
    description: "From real-time transportation data"
  }
];

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Transportation Research</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Data-driven insights and comprehensive research reports on the Indian transportation industry, 
            helping stakeholders make informed decisions.
          </p>
        </div>

        {/* Research Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statistics.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <stat.icon className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold text-primary">{stat.value}</CardTitle>
                <CardDescription className="font-semibold">{stat.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Research */}
        {researchReports.find(report => report.featured) && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Featured Research</h2>
            {researchReports.filter(report => report.featured).map((report) => (
              <Card key={report.id} className="overflow-hidden border-primary/20">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  <div className="bg-primary/5 flex items-center justify-center p-12">
                    <div className="text-center">
                      <FileText className="h-20 w-20 text-primary mx-auto mb-4" />
                      <Badge className="text-lg px-4 py-2">Featured Report</Badge>
                    </div>
                  </div>
                  <div className="lg:col-span-2 p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">{report.category}</Badge>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{report.pages} pages</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{report.title}</h3>
                    <p className="text-muted-foreground mb-6">{report.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {report.publishDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {report.downloadCount.toLocaleString()} downloads
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                      <Button variant="outline">
                        View Summary
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* All Research Reports */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Research Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {researchReports.filter(report => !report.featured).map((report) => (
              <Card key={report.id} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{report.category}</Badge>
                    <span className="text-sm text-muted-foreground">{report.pages} pages</span>
                  </div>
                  <CardTitle className="line-clamp-2">{report.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{report.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {report.publishDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {report.downloadCount.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Research Methodology */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Research Methodology</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Primary Research</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Direct surveys and interviews with transport companies and drivers across India.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Data Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Advanced statistical analysis of transportation data and market trends.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Geographic Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Pan-India research covering urban, semi-urban, and rural transportation networks.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Continuous Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Real-time data collection and regular updates to ensure accuracy and relevance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Research Areas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Key Research Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Market Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Market size and growth projections</li>
                  <li>• Competitive landscape analysis</li>
                  <li>• Regional market variations</li>
                  <li>• Investment trends and opportunities</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  Workforce Studies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Driver shortage analysis</li>
                  <li>• Skills gap assessment</li>
                  <li>• Training and development needs</li>
                  <li>• Employment patterns and trends</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  Technology Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Digital transformation trends</li>
                  <li>• Technology adoption rates</li>
                  <li>• ROI analysis of tech investments</li>
                  <li>• Future technology roadmap</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Policy & Regulation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Regulatory compliance analysis</li>
                  <li>• Policy impact assessment</li>
                  <li>• Government initiatives evaluation</li>
                  <li>• Recommendations for policy makers</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary/5 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Partner with Our Research Team</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Collaborate with us on custom research projects or access our premium research services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Request Custom Research
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Research Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
