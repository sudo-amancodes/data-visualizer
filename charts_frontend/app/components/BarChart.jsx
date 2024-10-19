'use client';

import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const API_URL = 'http://127.0.0.1:8000/api/bar-chart-data/';

const BarChartComponent = () => {
    const [barData, setBarData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Get the data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                // Format the data for the bar chart
                const formattedData = result.labels.map((label, index) => ({
                    name: label,
                    value: result.data[index],
                }));

                setBarData(formattedData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-xl text-red-500">Error: {error}</p>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-xl text-blue-500">Loading data...</p>
            </div>
        );
    }

    // No data state
    if (!barData || barData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-xl text-red-500">No data available to display the chart.</p>
            </div>
        );
    }

    // Render BarChart with fetched barData
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={300}
                data={barData}
                margin={{
                    right: 30,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" fill="#10b981" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartComponent;

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
                <p className="text-medium text-lg">{label}</p>
                <p className="text-sm text-blue-400">
                    Value:
                    <span className="ml-2">${payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
};

