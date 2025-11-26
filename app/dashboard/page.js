"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, BarChart3, Database, Filter, RefreshCw, Target, TrendingUp, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
    Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
    Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis,
    Radar, RadarChart, ResponsiveContainer, Scatter, ScatterChart,
    Tooltip, XAxis, YAxis, ZAxis
} from "recharts";

const DashboardPage = () => {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
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

        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                const fieldMap = {
                    endYear: 'end_year',
                    pest: 'pestle',
                    topic: 'topic',
                    sector: 'sector',
                    region: 'region',
                    source: 'source',
                    swot: 'swot',
                    country: 'country',
                    city: 'city'
                };

                const field = fieldMap[key];
                if (key === 'endYear') {
                    filtered = filtered.filter(r => r[field]?.toString() === value);
                } else {
                    filtered = filtered.filter(r => r[field] === value);
                }
            }
        });

        setFilteredRecords(filtered);
    };

    useEffect(() => {
        applyFilters();
    }, [filters, records]);

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

    const getUniqueValues = (field) => {
        return [...new Set(records.map(r => r[field]).filter(Boolean))].sort();
    };

    const activeFilterCount = Object.values(filters).filter(v => v !== "").length;

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
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="text-center">
                    <RefreshCw className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-6" />
                    <p className="text-2xl font-semibold text-slate-700">Loading Dashboard...</p>
                    <p className="text-slate-500 mt-2">Fetching your data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">

                {/* Header */}
                <div className="text-center mb-10">
                    <Badge className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-3">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Analytics Dashboard
                    </Badge>

                    <h1 className="text-5xl font-bold bg-linear-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mt-4">
                        Data Visualization Hub
                    </h1>

                    <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
                        Real-time insights from server-side MongoDB queries, combined with advanced visualizations and filters.
                    </p>
                </div>

                {/* Toggle Filters (Mobile) */}
                <div className="lg:hidden mb-6">
                    <Button
                        onClick={() => setShowFilters(!showFilters)}
                        variant="outline"
                        className="w-full flex items-center justify-between py-4"
                    >
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                            <Filter className="w-5 h-5 text-blue-600" /> Filters
                            {activeFilterCount > 0 && (
                                <Badge className="bg-blue-600 text-white">{activeFilterCount}</Badge>
                            )}
                        </span>
                        <span className="text-slate-500">{showFilters ? "-" : "+"}</span>
                    </Button>
                </div>

                {/* Filters Section */}
                <div className={`mb-10 ${!showFilters && "hidden lg:block"}`}>
                    <Card className="shadow-xl">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <CardTitle className="flex items-center gap-2">
                                    <Filter className="w-6 h-6 text-blue-600" />
                                    Filters
                                    {activeFilterCount > 0 && (
                                        <Badge variant="secondary">{activeFilterCount} active</Badge>
                                    )}
                                </CardTitle>

                                <Button
                                    onClick={resetFilters}
                                    className="bg-linear-to-r from-blue-600 to-indigo-600 text-white"
                                    size="sm"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Reset All
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                                {[
                                    { key: "endYear", label: "End Year", field: "end_year" },
                                    { key: "topic", label: "Topic", field: "topic" },
                                    { key: "sector", label: "Sector", field: "sector" },
                                    { key: "region", label: "Region", field: "region" },
                                    { key: "pest", label: "PESTLE", field: "pestle" },
                                    { key: "source", label: "Source", field: "source" },
                                    { key: "swot", label: "SWOT", field: "swot" },
                                    { key: "country", label: "Country", field: "country" },
                                    { key: "city", label: "City", field: "city" }
                                ].map(({ key, label, field }) => (
                                    <Select
                                        key={key}
                                        value={filters[key]}
                                        onValueChange={(val) =>
                                            setFilters({ ...filters, [key]: val === "all" ? "" : val })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={`All ${label}s`} />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="all">All {label}s</SelectItem>
                                            {getUniqueValues(field).map((val) => (
                                                <SelectItem key={val} value={val}>{val}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ))}

                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                    <Card className="bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:-translate-y-1 transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex justify-between">
                                Total Records
                                <Database className="w-8 h-8 text-blue-200" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{records.length}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-linear-to-br from-purple-500 to-purple-600 text-white shadow-xl hover:-translate-y-1 transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex justify-between">
                                Avg Intensity
                                <TrendingUp className="w-8 h-8 text-purple-200" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{avgIntensity}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-xl hover:-translate-y-1 transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex justify-between">
                                Avg Likelihood
                                <Activity className="w-8 h-8 text-emerald-200" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{avgLikelihood}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-linear-to-br from-pink-500 to-pink-600 text-white shadow-xl hover:-translate-y-1 transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex justify-between">
                                Avg Relevance
                                <Target className="w-8 h-8 text-pink-200" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{avgRelevance}</p>
                        </CardContent>
                    </Card>

                </div>

                {/* Charts (Add your charts here, unchanged) */}
                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
                    {/* Sector Distribution */}
                    <Card className="shadow-xl hover:shadow-2xl transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Top 10 Sectors by Count</CardTitle>
                            <CardDescription>Distribution of records across major sectors</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={sectorChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Bar dataKey="value" fill="url(#blueGradient)" radius={[8, 8, 0, 0]} />
                                    <defs>
                                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#1d4ed8" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Topics Distribution */}
                    <Card className="shadow-xl hover:shadow-2xl transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Top Topics Distribution</CardTitle>
                            <CardDescription>Most discussed topics in the dataset</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={topicChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name.slice(0, 15)}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={window.innerWidth < 640 ? 60 : 80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {topicChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Year vs Intensity Trend */}
                    <Card className="shadow-xl hover:shadow-2xl transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Average Intensity by Year</CardTitle>
                            <CardDescription>Temporal trend analysis of intensity metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={yearChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="avgIntensity" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Region Distribution */}
                    <Card className="shadow-xl hover:shadow-2xl transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Records by Region</CardTitle>
                            <CardDescription>Geographic distribution of data points</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={regionChartData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis type="number" tick={{ fontSize: 12 }} />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Bar dataKey="value" fill="url(#pinkGradient)" radius={[0, 8, 8, 0]} />
                                    <defs>
                                        <linearGradient id="pinkGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#ec4899" />
                                            <stop offset="100%" stopColor="#db2777" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Country Radar */}
                    <Card className="shadow-xl hover:shadow-2xl transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Top Countries - Multi-Metric</CardTitle>
                            <CardDescription>Comparative analysis across key metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="country" tick={{ fontSize: 12 }} />
                                    <PolarRadiusAxis tick={{ fontSize: 12 }} />
                                    <Radar name="Intensity" dataKey="intensity" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                    <Radar name="Likelihood" dataKey="likelihood" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                                    <Radar name="Relevance" dataKey="relevance" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                                    <Legend />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* PESTLE Analysis */}
                    <Card className="shadow-xl hover:shadow-2xl transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">PESTLE Average Intensity</CardTitle>
                            <CardDescription>Strategic framework analysis</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={pestleChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Bar dataKey="avgIntensity" fill="url(#cyanGradient)" radius={[8, 8, 0, 0]} />
                                    <defs>
                                        <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#06b6d4" />
                                            <stop offset="100%" stopColor="#0891b2" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Scatter Plot - Full Width */}
                <Card className="shadow-xl hover:shadow-2xl transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Intensity vs Likelihood Scatter</CardTitle>
                        <CardDescription>Correlation analysis with relevance as bubble size</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis type="number" dataKey="x" name="Intensity" tick={{ fontSize: 12 }} />
                                <YAxis type="number" dataKey="y" name="Likelihood" tick={{ fontSize: 12 }} />
                                <ZAxis type="number" dataKey="z" range={[50, 500]} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                <Legend />
                                <Scatter name="Data Points" data={scatterData} fill="#6366f1" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default DashboardPage;
