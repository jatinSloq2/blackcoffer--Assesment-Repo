"use client"

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Database, Filter, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

const DashboardPage = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    endYear: "",
    topic: "",
    sector: "",
    region: "",
    pest: "",
    source: "",
    swot: "",
    country: "",
    city: ""
  });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/data");
      const json = await res.json();
      if (json.success) {
        setRecords(json.data);
        setFilteredRecords(json.data);
      }
    } catch (err) {
      console.error("Error fetching DB data", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

 

  const applyFilters = () => {
    let filtered = [...records];

    if (filters.endYear) {
      filtered = filtered.filter(r => r.end_year?.toString() === filters.endYear);
    }
    if (filters.topic) {
      filtered = filtered.filter(r => r.topic === filters.topic);
    }
    if (filters.sector) {
      filtered = filtered.filter(r => r.sector === filters.sector);
    }
    if (filters.region) {
      filtered = filtered.filter(r => r.region === filters.region);
    }
    if (filters.pest) {
      filtered = filtered.filter(r => r.pestle === filters.pest);
    }
    if (filters.source) {
      filtered = filtered.filter(r => r.source === filters.source);
    }
    if (filters.swot) {
      filtered = filtered.filter(r => r.swot === filters.swot);
    }
    if (filters.country) {
      filtered = filtered.filter(r => r.country === filters.country);
    }
    if (filters.city) {
      filtered = filtered.filter(r => r.city === filters.city);
    }

    setFilteredRecords(filtered);
  };

   useEffect(() => {
    applyFilters();
  }, [filters, records,]);

  const resetFilters = () => {
    setFilters({
      endYear: "",
      topic: "",
      sector: "",
      region: "",
      pest: "",
      source: "",
      swot: "",
      country: "",
      city: ""
    });
  };

  // Get unique values for filters
  const getUniqueValues = (field) => {
    return [...new Set(records.map(r => r[field]).filter(Boolean))].sort();
  };

  // Calculate statistics
  const avgIntensity = filteredRecords.length > 0 
    ? (filteredRecords.reduce((sum, r) => sum + (r.intensity || 0), 0) / filteredRecords.length).toFixed(2)
    : 0;

  const avgLikelihood = filteredRecords.length > 0
    ? (filteredRecords.reduce((sum, r) => sum + (r.likelihood || 0), 0) / filteredRecords.length).toFixed(2)
    : 0;

  const avgRelevance = filteredRecords.length > 0
    ? (filteredRecords.reduce((sum, r) => sum + (r.relevance || 0), 0) / filteredRecords.length).toFixed(2)
    : 0;

  // Prepare chart data
  const sectorData = filteredRecords.reduce((acc, r) => {
    if (r.sector) {
      acc[r.sector] = (acc[r.sector] || 0) + 1;
    }
    return acc;
  }, {});

  const sectorChartData = Object.entries(sectorData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const topicData = filteredRecords.reduce((acc, r) => {
    if (r.topic) {
      acc[r.topic] = (acc[r.topic] || 0) + 1;
    }
    return acc;
  }, {});

  const topicChartData = Object.entries(topicData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const regionData = filteredRecords.reduce((acc, r) => {
    if (r.region) {
      acc[r.region] = (acc[r.region] || 0) + 1;
    }
    return acc;
  }, {});

  const regionChartData = Object.entries(regionData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const yearIntensityData = filteredRecords
    .filter(r => r.start_year && r.start_year !== "")
    .reduce((acc, r) => {
      const year = r.start_year;
      if (!acc[year]) {
        acc[year] = { year, totalIntensity: 0, count: 0 };
      }
      acc[year].totalIntensity += r.intensity || 0;
      acc[year].count += 1;
      return acc;
    }, {});

  const yearChartData = Object.values(yearIntensityData)
    .map(d => ({
      year: d.year,
      avgIntensity: (d.totalIntensity / d.count).toFixed(2)
    }))
    .sort((a, b) => a.year - b.year)
    .slice(0, 15);

  const countryData = filteredRecords.reduce((acc, r) => {
    if (r.country) {
      if (!acc[r.country]) {
        acc[r.country] = { intensity: 0, likelihood: 0, relevance: 0, count: 0 };
      }
      acc[r.country].intensity += r.intensity || 0;
      acc[r.country].likelihood += r.likelihood || 0;
      acc[r.country].relevance += r.relevance || 0;
      acc[r.country].count += 1;
    }
    return acc;
  }, {});

  const radarData = Object.entries(countryData)
    .map(([country, data]) => ({
      country,
      intensity: (data.intensity / data.count).toFixed(1),
      likelihood: (data.likelihood / data.count).toFixed(1),
      relevance: (data.relevance / data.count).toFixed(1)
    }))
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 6);

  const pestleData = filteredRecords.reduce((acc, r) => {
    if (r.pestle) {
      if (!acc[r.pestle]) {
        acc[r.pestle] = { intensity: 0, count: 0 };
      }
      acc[r.pestle].intensity += r.intensity || 0;
      acc[r.pestle].count += 1;
    }
    return acc;
  }, {});

  const pestleChartData = Object.entries(pestleData)
    .map(([name, data]) => ({
      name,
      avgIntensity: (data.intensity / data.count).toFixed(2)
    }));

  const scatterData = filteredRecords
    .filter(r => r.intensity && r.likelihood && r.relevance)
    .slice(0, 100)
    .map(r => ({
      x: r.intensity,
      y: r.likelihood,
      z: r.relevance,
      name: r.topic || "Unknown"
    }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#ef4444'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-slate-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="text-center mb-10">
        <Badge className="bg-blue-100 text-blue-600 px-4 py-2 text-sm font-semibold">
          <BarChart3 className="w-4 h-4 mr-2 inline" />
          Dashboard Analytics
        </Badge>
        <h1 className="text-5xl font-bold text-slate-900 mt-4">
          Data Visualization Dashboard
        </h1>
        <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
          Real-time insights from MongoDB data, displayed through charts and interactive filters.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </span>
            <button
              onClick={resetFilters}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Reset Filters
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <select
              value={filters.endYear}
              onChange={(e) => setFilters({ ...filters, endYear: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All End Years</option>
              {getUniqueValues("end_year").map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <select
              value={filters.topic}
              onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Topics</option>
              {getUniqueValues("topic").map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={filters.sector}
              onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sectors</option>
              {getUniqueValues("sector").map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Regions</option>
              {getUniqueValues("region").map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <select
              value={filters.pest}
              onChange={(e) => setFilters({ ...filters, pest: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All PEST</option>
              {getUniqueValues("pestle").map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select
              value={filters.source}
              onChange={(e) => setFilters({ ...filters, source: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sources</option>
              {getUniqueValues("source").map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={filters.swot}
              onChange={(e) => setFilters({ ...filters, swot: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All SWOT</option>
              {getUniqueValues("swot").map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Countries</option>
              {getUniqueValues("country").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Cities</option>
              {getUniqueValues("city").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="shadow-lg hover:shadow-xl transition">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg">
              <span>Total Records</span>
              <Database className="w-6 h-6 text-blue-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-slate-800">{filteredRecords.length}</p>
            <p className="text-sm text-slate-500 mt-2">Out of {records.length} total</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition">
          <CardHeader>
            <CardTitle className="text-lg">Avg Intensity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-purple-600">{avgIntensity}</p>
            <p className="text-sm text-slate-500 mt-2">Across all records</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition">
          <CardHeader>
            <CardTitle className="text-lg">Avg Likelihood</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-pink-600">{avgLikelihood}</p>
            <p className="text-sm text-slate-500 mt-2">Probability score</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition">
          <CardHeader>
            <CardTitle className="text-lg">Avg Relevance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-orange-600">{avgRelevance}</p>
            <p className="text-sm text-slate-500 mt-2">Relevance metric</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sector Distribution */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Top 10 Sectors by Count</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Topics Distribution */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Top Topics Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topicChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topicChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Year vs Intensity Trend */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Average Intensity by Year</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgIntensity" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Region Distribution */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Records by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Country Radar */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Top Countries - Multi-Metric Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="country" />
                <PolarRadiusAxis />
                <Radar name="Intensity" dataKey="intensity" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Radar name="Likelihood" dataKey="likelihood" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Radar name="Relevance" dataKey="relevance" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* PESTLE Analysis */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>PESTLE Average Intensity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pestleChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgIntensity" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Scatter Plot */}
      <Card className="shadow-xl mb-8">
        <CardHeader>
          <CardTitle>Intensity vs Likelihood Scatter (Size: Relevance)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" name="Intensity" />
              <YAxis type="number" dataKey="y" name="Likelihood" />
              <ZAxis type="number" dataKey="z" range={[50, 500]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="Data Points" data={scatterData} fill="#6366f1" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;