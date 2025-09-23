'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, Newspaper, TrendingUp, AlertCircle, Award } from 'lucide-react';
import Link from 'next/link';

const newsArticles = [
  {
    id: 1,
    title: "Government Announces New Safety Regulations for Commercial Vehicles",
    excerpt: "Ministry of Road Transport and Highways introduces stricter safety norms for commercial vehicles, including mandatory GPS tracking and driver fatigue monitoring systems.",
    author: "Transportation Desk",
    date: "September 22, 2025",
    category: "Policy",
    readTime: "4 min read",
    image: "🏛️",
    breaking: true
  },
  {
    id: 2,
    title: "DriverConnect Reaches 10,000 Verified Drivers Milestone",
    excerpt: "The platform celebrates a major milestone with over 10,000 verified professional drivers and 2,500 registered transport companies across India.",
    author: "Company News",
    date: "September 21, 2025",
    category: "Company",
    readTime: "3 min read",
    image: "🎉"
  },
  {
    id: 3,
    title: "Electric Vehicle Adoption in Commercial Transportation Sector",
    excerpt: "Major transport companies are increasingly adopting electric vehicles for last-mile delivery, driven by government incentives and environmental concerns.",
    author: "Industry Reporter",
    date: "September 20, 2025",
    category: "Technology",
    readTime: "6 min read",
    image: "⚡"
  },
  {
    id: 4,
    title: "Driver Shortage Crisis: Industry Leaders Propose Solutions",
    excerpt: "Transport industry associations meet with government officials to discuss strategies for addressing the growing shortage of professional drivers.",
    author: "Policy Correspondent",
    date: "September 19, 2025",
    category: "Industry",
    readTime: "5 min read",
    image: "👥"
  },
  {
    id: 5,
    title: "New Highway Infrastructure Projects to Boost Transportation",
    excerpt: "Government approves ₹50,000 crore highway development projects that will significantly improve connectivity between major industrial centers.",
    author: "Infrastructure Desk",
    date: "September 18, 2025",
    category: "Infrastructure",
    readTime: "4 min read",
    image: "🛣️"
  },
  {
    id: 6,
    title: "Digital Payment Systems Gain Traction in Transportation",
    excerpt: "Transport companies are rapidly adopting digital payment solutions for driver payments and fuel transactions, improving transparency and efficiency.",
    author: "Fintech Reporter",
    date: "September 17, 2025",
    category: "Technology",
    readTime: "3 min read",
    image: "💳"
  },
  {
    id: 7,
    title: "Road Safety Week: Focus on Commercial Vehicle Safety",
    excerpt: "National Road Safety Week highlights the importance of commercial vehicle safety with special training programs for professional drivers.",
    author: "Safety Correspondent",
    date: "September 16, 2025",
    category: "Safety",
    readTime: "5 min read",
    image: "🚦"
  },
  {
    id: 8,
    title: "Fuel Price Impact on Transportation Costs",
    excerpt: "Rising fuel prices continue to impact transportation costs, prompting companies to explore alternative fuel options and route optimization.",
    author: "Economic Reporter",
    date: "September 15, 2025",
    category: "Economics",
    readTime: "4 min read",
    image: "⛽"
  }
];

const categories = ["All", "Policy", "Company", "Technology", "Industry", "Infrastructure", "Safety", "Economics"];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredNews = selectedCategory === "All" 
    ? newsArticles 
    : newsArticles.filter(article => article.category === selectedCategory);

  const breakingNews = newsArticles.filter(article => article.breaking);
  const regularNews = newsArticles.filter(article => !article.breaking);

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Transportation News</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed with the latest news, updates, and developments in the Indian transportation industry.
          </p>
        </div>

        {/* Breaking News */}
        {breakingNews.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <h2 className="text-2xl font-bold text-red-500">Breaking News</h2>
            </div>
            {breakingNews.map((article) => (
              <Card key={article.id} className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="destructive">Breaking</Badge>
                    <Badge variant="secondary">{article.category}</Badge>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{article.readTime}</span>
                  </div>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <CardDescription>{article.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {article.date}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/news/${article.id}`}>
                        Read More <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredNews.filter(article => !article.breaking).map((article) => (
            <Card key={article.id} className="h-full flex flex-col">
              <CardHeader>
                <div className="text-4xl mb-4 text-center">{article.image}</div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{article.category}</Badge>
                  <span className="text-sm text-muted-foreground">{article.readTime}</span>
                </div>
                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                <CardDescription className="line-clamp-3">{article.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {article.date}
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/news/${article.id}`}>
                    Read Full Article <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Industry Highlights */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Industry Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Market Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500 mb-2">+15%</div>
                <p className="text-sm text-muted-foreground">
                  Transportation sector growth in Q3 2025
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Safety Awards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500 mb-2">250+</div>
                <p className="text-sm text-muted-foreground">
                  Companies recognized for safety excellence
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Newspaper className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Policy Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-500 mb-2">12</div>
                <p className="text-sm text-muted-foreground">
                  New regulations introduced this quarter
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Safety Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500 mb-2">-8%</div>
                <p className="text-sm text-muted-foreground">
                  Reduction in commercial vehicle accidents
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* News Sources */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our News Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="h-6 w-6 text-primary" />
                  Government & Regulatory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Ministry of Road Transport and Highways</li>
                  <li>• State Transport Departments</li>
                  <li>• Central Motor Vehicle Rules updates</li>
                  <li>• GST Council notifications</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Industry & Market
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Transport industry associations</li>
                  <li>• Market research reports</li>
                  <li>• Company announcements</li>
                  <li>• Technology partnerships</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Subscribe to our daily news digest for the latest transportation industry updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
            />
            <Button>Subscribe to News</Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Get daily updates delivered to your inbox. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
