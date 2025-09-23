'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, Truck, Shield, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: "The Future of Transportation: How Technology is Revolutionizing Fleet Management",
    excerpt: "Explore how AI, IoT, and mobile technology are transforming the way transport companies manage their fleets and communicate with drivers.",
    author: "Rajesh Kumar",
    date: "September 20, 2025",
    category: "Technology",
    readTime: "5 min read",
    image: "🚛",
    featured: true
  },
  {
    id: 2,
    title: "Driver Safety: Best Practices for Long-Distance Transportation",
    excerpt: "Essential safety guidelines and tips for professional drivers to ensure safe and efficient long-distance journeys.",
    author: "Priya Sharma",
    date: "September 18, 2025",
    category: "Safety",
    readTime: "7 min read",
    image: "🛡️"
  },
  {
    id: 3,
    title: "Building Trust: The Importance of Driver Verification in Modern Logistics",
    excerpt: "Why comprehensive background checks and document verification are crucial for maintaining safety and reliability in transportation.",
    author: "Amit Patel",
    date: "September 15, 2025",
    category: "Industry",
    readTime: "6 min read",
    image: "✅"
  },
  {
    id: 4,
    title: "Maximizing Fuel Efficiency: Tips for Transport Companies",
    excerpt: "Practical strategies to reduce fuel costs and improve operational efficiency through better route planning and driver training.",
    author: "Sunita Gupta",
    date: "September 12, 2025",
    category: "Operations",
    readTime: "8 min read",
    image: "⛽"
  },
  {
    id: 5,
    title: "The Rise of Digital Communication in Transportation",
    excerpt: "How digital platforms are replacing traditional communication methods and improving coordination between drivers and fleet managers.",
    author: "Vikram Singh",
    date: "September 10, 2025",
    category: "Technology",
    readTime: "4 min read",
    image: "📱"
  },
  {
    id: 6,
    title: "Understanding GST Compliance for Transport Companies",
    excerpt: "A comprehensive guide to GST regulations and compliance requirements for transportation businesses in India.",
    author: "Meera Joshi",
    date: "September 8, 2025",
    category: "Compliance",
    readTime: "10 min read",
    image: "📋"
  }
];

const categories = ["All", "Technology", "Safety", "Industry", "Operations", "Compliance"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">DriverConnect Blog</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay updated with the latest insights, trends, and best practices in the transportation industry.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <Card className="overflow-hidden border-primary/20">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="bg-primary/5 flex items-center justify-center p-12">
                  <div className="text-8xl">{featuredPost.image}</div>
                </div>
                <div className="p-8">
                  <Badge className="mb-4">Featured Post</Badge>
                  <h2 className="text-2xl font-bold mb-4">{featuredPost.title}</h2>
                  <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {featuredPost.date}
                    </div>
                    <Badge variant="secondary">{featuredPost.category}</Badge>
                  </div>
                  
                  <Button asChild>
                    <Link href={`/blog/${featuredPost.id}`}>
                      Read Full Article <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="h-full flex flex-col">
              <CardHeader>
                <div className="text-4xl mb-4 text-center">{post.image}</div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-muted-foreground">{post.readTime}</span>
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/blog/${post.id}`}>
                    Read More <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Subscribe to our newsletter for the latest industry insights and updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
            />
            <Button>Subscribe</Button>
          </div>
        </div>

        {/* Popular Topics */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Popular Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Truck className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Fleet Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Best practices for managing large vehicle fleets efficiently.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Driver Safety</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Safety protocols and guidelines for professional drivers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Driver Recruitment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Strategies for finding and retaining quality drivers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Industry Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Latest trends and innovations in transportation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
