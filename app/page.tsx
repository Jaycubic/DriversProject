'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MainNavigation } from '@/components/layout/MainNavigation';
import { 
  Truck, 
  Users, 
  Shield, 
  MessageCircle, 
  CheckCircle, 
  Star, 
  ArrowRight,
  Phone,
  MapPin,
  Clock,
  Award
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Connect. Drive. <span className="text-primary">Succeed.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              India's leading platform connecting professional drivers with transport companies. 
              Join thousands of verified drivers and companies transforming the transportation industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/driver/register">
                  Register as Driver
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/company/register">
                  Register Company
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10,000+</div>
                <div className="text-sm text-muted-foreground">Verified Drivers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">2,500+</div>
                <div className="text-sm text-muted-foreground">Transport Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50,000+</div>
                <div className="text-sm text-muted-foreground">Successful Trips</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose DriverConnect?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive solutions for modern transportation needs with cutting-edge technology and verified networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>100% Verified Network</CardTitle>
                <CardDescription>
                  All drivers and companies undergo thorough background verification and document validation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Background checks</li>
                  <li>• Document verification</li>
                  <li>• Real-time validation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Smart Communication</CardTitle>
                <CardDescription>
                  Advanced communication platform with multi-language support and real-time tracking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Real-time messaging</li>
                  <li>• GPS integration</li>
                  <li>• Multi-language support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Professional Matching</CardTitle>
                <CardDescription>
                  AI-powered matching system connecting the right drivers with the right opportunities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Skill-based matching</li>
                  <li>• Route optimization</li>
                  <li>• Performance ratings</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>24/7 Support</CardTitle>
                <CardDescription>
                  Round-the-clock customer support and emergency assistance for all users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Emergency helpline</li>
                  <li>• Technical support</li>
                  <li>• Multi-language assistance</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Pan-India Coverage</CardTitle>
                <CardDescription>
                  Extensive network covering all major routes across North, South, East, and West India.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 28 states coverage</li>
                  <li>• Major highway routes</li>
                  <li>• Urban & rural areas</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Industry Recognition</CardTitle>
                <CardDescription>
                  Award-winning platform recognized by industry leaders and government bodies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Industry awards</li>
                  <li>• Government recognition</li>
                  <li>• Safety certifications</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How DriverConnect Works</h2>
            <p className="text-xl text-muted-foreground">
              Simple, secure, and efficient process for drivers and companies
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* For Drivers */}
            <div>
              <h3 className="text-2xl font-bold mb-8 text-center">For Drivers</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold mb-2">Register & Verify</h4>
                    <p className="text-muted-foreground">Complete your profile with documents and get verified within 24 hours.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold mb-2">Browse Opportunities</h4>
                    <p className="text-muted-foreground">Access thousands of job opportunities from verified transport companies.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold mb-2">Connect & Drive</h4>
                    <p className="text-muted-foreground">Get matched with suitable jobs and start earning with professional support.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Companies */}
            <div>
              <h3 className="text-2xl font-bold mb-8 text-center">For Companies</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold mb-2">Company Registration</h4>
                    <p className="text-muted-foreground">Register your transport company and get access to verified driver network.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold mb-2">Find Drivers</h4>
                    <p className="text-muted-foreground">Search and connect with professional drivers based on your requirements.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold mb-2">Manage Fleet</h4>
                    <p className="text-muted-foreground">Use our platform to communicate, track, and manage your entire fleet efficiently.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground">
              Trusted by thousands of drivers and companies across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">Excellent Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  "DriverConnect helped me find consistent work with reputable companies. The verification process gives me confidence in the jobs I take."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Rajesh Kumar</p>
                    <p className="text-sm text-muted-foreground">Professional Driver</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">Game Changer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  "Finding reliable drivers was always a challenge. DriverConnect's verification system and communication tools have transformed our operations."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Truck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Priya Sharma</p>
                    <p className="text-sm text-muted-foreground">ABC Transport Ltd.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">Highly Recommended</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  "The platform's safety features and 24/7 support give us peace of mind. Our drivers feel more secure and connected."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Amit Patel</p>
                    <p className="text-sm text-muted-foreground">Quick Logistics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Transportation Business?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of drivers and companies already using DriverConnect to grow their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link href="/auth/signup">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/contact">
                Contact Sales
                <Phone className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">DriverConnect</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Connecting professional drivers with transport companies across India.
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary">Trusted</Badge>
                <Badge variant="secondary">Verified</Badge>
                <Badge variant="secondary">Secure</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Drivers</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/driver/register" className="hover:text-primary">Register as Driver</Link></li>
                <li><Link href="/auth/login" className="hover:text-primary">Driver Login</Link></li>
                <li><Link href="/services" className="hover:text-primary">Find Jobs</Link></li>
                <li><Link href="/blog" className="hover:text-primary">Driver Resources</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Companies</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/company/register" className="hover:text-primary">Register Company</Link></li>
                <li><Link href="/auth/login" className="hover:text-primary">Company Login</Link></li>
                <li><Link href="/services" className="hover:text-primary">Find Drivers</Link></li>
                <li><Link href="/research" className="hover:text-primary">Industry Reports</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                <li><Link href="/news" className="hover:text-primary">News & Updates</Link></li>
                <li><Link href="/blacklisted-drivers" className="hover:text-primary">Safety Database</Link></li>
                <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 DriverConnect Technologies Pvt. Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
