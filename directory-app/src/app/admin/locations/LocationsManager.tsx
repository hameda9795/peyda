"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { MapPin, Building2, ChevronDown, ChevronRight, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface City {
    id: string;
    name: string;
    slug: string;
    province: string | null;
    _count: {
        neighborhoods: number;
    };
}

interface Neighborhood {
    id: string;
    name: string;
    slug: string;
    cityId: string;
}

export function LocationsManager() {
    const [cities, setCities] = useState<City[]>([]);
    const [neighborhoods, setNeighborhoods] = useState<Record<string, Neighborhood[]>>({});
    const [expandedCities, setExpandedCities] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    const fetchCities = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/locations/cities');
            const data = await response.json();
            setCities(data.cities || []);
        } catch (error) {
            console.error('Error fetching cities:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCities();
    }, []);

    const toggleCity = async (cityId: string) => {
        const newExpanded = new Set(expandedCities);
        if (newExpanded.has(cityId)) {
            newExpanded.delete(cityId);
        } else {
            newExpanded.add(cityId);
            if (!neighborhoods[cityId]) {
                // Fetch neighborhoods for this city
                try {
                    const response = await fetch(`/api/admin/locations/cities/${cityId}/neighborhoods`);
                    const data = await response.json();
                    setNeighborhoods((prev) => ({ ...prev, [cityId]: data.neighborhoods || [] }));
                } catch (error) {
                    console.error('Error fetching neighborhoods:', error);
                }
            }
        }
        setExpandedCities(newExpanded);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-8">
                <div className="animate-pulse space-y-4">
                    {[1,2,3,4,5].map((i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{cities.length}</p>
                            <p className="text-sm text-gray-500">Total Cities</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {cities.reduce((sum, city) => sum + city._count.neighborhoods, 0)}
                            </p>
                            <p className="text-sm text-gray-500">Total Neighborhoods</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {[...new Set(cities.map((c) => c.province).filter(Boolean))].length}
                            </p>
                            <p className="text-sm text-gray-500">Unique Provinces</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cities List */}
            <div className="bg-white rounded-xl border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-gray-900">Cities and Neighborhoods</h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {cities.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No cities found
                        </div>
                    ) : (
                        cities.map((city) => (
                            <div key={city.id}>
                                <button
                                    onClick={() => toggleCity(city.id)}
                                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        {expandedCities.has(city.id) ? (
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        )}
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <MapPin className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">{city.name}</p>
                                            <p className="text-sm text-gray-500">{city.province || 'No province'}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {city._count.neighborhoods} neighborhoods
                                    </span>
                                </button>

                                {expandedCities.has(city.id) && neighborhoods[city.id] && (
                                    <div className="bg-gray-50 px-6 py-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {neighborhoods[city.id].length === 0 ? (
                                                <p className="text-sm text-gray-500">No neighborhoods</p>
                                            ) : (
                                                neighborhoods[city.id].map((neighborhood) => (
                                                    <div
                                                        key={neighborhood.id}
                                                        className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-slate-200"
                                                    >
                                                        <Building2 className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-700">{neighborhood.name}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
