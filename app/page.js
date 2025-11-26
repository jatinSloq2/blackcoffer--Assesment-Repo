import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Code,
  Database,
  Filter,
  Layers,
  Sparkles,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-6">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm font-semibold">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Blackcoffer Test Assignment
            </Badge>
            <h1 className="text-6xl font-bold text-slate-900 tracking-tight">
              Data Visualization
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                Dashboard Project
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              An interactive analytics dashboard built with modern web technologies to visualize complex datasets through intuitive charts, filters, and insights.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Dashboard
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2">
                <Code className="w-5 h-5 mr-2" />
                Source Code
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {/* What We Built */}
        <section>
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Target className="w-4 h-4 mr-2 inline" />
              Project Overview
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">What We Built</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A comprehensive full-stack data visualization solution with MongoDB integration and interactive analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Database className="w-8 h-8" />}
              title="Database Layer"
              description="MongoDB database populated with JSON data, optimized queries for fast retrieval"
              color="blue"
            />
            <FeatureCard
              icon={<Code className="w-8 h-8" />}
              title="Backend API"
              description="RESTful API built with Node.js/Express for seamless data access"
              color="green"
            />
            <FeatureCard
              icon={<Layers className="w-8 h-8" />}
              title="Frontend UI"
              description="React with shadcn/ui components for beautiful, responsive design"
              color="purple"
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Visualizations"
              description="D3.js powered interactive charts and graphs for data insights"
              color="orange"
            />
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Zap className="w-4 h-4 mr-2 inline" />
              Technology Stack
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Built With Modern Tools</h2>
          </div>

          <Tabs defaultValue="frontend" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
              <TabsTrigger value="frontend">Frontend</TabsTrigger>
              <TabsTrigger value="backend">Backend</TabsTrigger>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
            </TabsList>
            <TabsContent value="frontend" className="mt-8">
              <Card className="max-w-3xl mx-auto shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-6 h-6 text-blue-600" />
                    Frontend Technologies
                  </CardTitle>
                  <CardDescription>Modern React ecosystem for building user interfaces</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <TechItem name="Next.js" description="React framework with server-side rendering and routing" />
                    <TechItem name="shadcn/ui" description="Beautiful, accessible component library built on Radix UI" />
                    <TechItem name="Tailwind CSS" description="Utility-first CSS framework for rapid styling" />
                    <TechItem name="Lucide React" description="Modern icon library for beautiful UI elements" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="backend" className="mt-8">
              <Card className="max-w-3xl mx-auto shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-6 h-6 text-green-600" />
                    Backend Technologies
                  </CardTitle>
                  <CardDescription>Robust server-side architecture and database</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <TechItem name="Node.js" description="JavaScript runtime for building scalable server applications" />
                    <TechItem name="Express.js" description="Fast, minimalist web framework for Node.js" />
                    <TechItem name="MongoDB" description="NoSQL database for flexible, scalable data storage" />
                    <TechItem name="Mongoose" description="Elegant MongoDB object modeling for Node.js" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="visualization" className="mt-8">
              <Card className="max-w-3xl mx-auto shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                    Visualization Libraries
                  </CardTitle>
                  <CardDescription>Powerful tools for creating interactive data visualizations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <TechItem name="D3.js" description="Data-Driven Documents for complex, customizable visualizations" />
                    <TechItem name="Bar Charts" description="Visualizing intensity, likelihood across categories" />
                    <TechItem name="Pie Charts" description="Showing distribution of PEST and SWOT analysis" />
                    <TechItem name="Line Charts" description="Displaying trends over time for key metrics" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Key Features */}
        <section>
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <CheckCircle2 className="w-4 h-4 mr-2 inline" />
              Key Features
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Dashboard Capabilities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Filter className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Advanced Filtering System</CardTitle>
                    <CardDescription>Multi-dimensional data filtering</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <FilterItem text="End Year filter for temporal analysis" />
                  <FilterItem text="Topic and Sector categorization" />
                  <FilterItem text="Geographic filters (Region, Country, City)" />
                  <FilterItem text="PEST and SWOT analysis filters" />
                  <FilterItem text="Source-based filtering" />
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Data Visualizations</CardTitle>
                    <CardDescription>Interactive charts and insights</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <FilterItem text="Intensity analysis by topic and sector" />
                  <FilterItem text="Likelihood and relevance metrics" />
                  <FilterItem text="Yearly trend analysis with line charts" />
                  <FilterItem text="PEST framework distribution" />
                  <FilterItem text="SWOT analysis visualization" />
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center py-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Explore the Data?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Dive into interactive visualizations and discover insights
            </p>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                Launch Dashboard
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

// Helper Components
const FeatureCard = ({ icon, title, description, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
      <CardContent className="pt-6">
        <div className={`${colors[color]} w-16 h-16 rounded-xl flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
};

const TechItem = ({ name, description }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
    <div>
      <h4 className="font-semibold text-slate-900">{name}</h4>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  </div>
);

const FilterItem = ({ text }) => (
  <li className="flex items-start gap-2 text-slate-600">
    <ChevronRight className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
    <span>{text}</span>
  </li>
);

export default Home;