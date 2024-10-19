'use client';

import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

const API_URL = 'http://127.0.0.1:8000/api/line-chart-data/';

const LineChartComponent = () => {
    const [lineData, setLineData] = useState([]);
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

                // Format the data for the line chart
                const formattedData = result.labels.map((label, index) => ({
                    name: label,
                    value: result.data[index],
                }));

                setLineData(formattedData);
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
    if (!lineData || lineData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-xl text-red-500">No data available to display the chart.</p>
            </div>
        );
    }

    // Render LineChart with fetched lineData
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
                <Legend />

            </LineChart>
        </ResponsiveContainer>
    );
};

export default LineChartComponent;

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { name, value } = payload[0];
        return (
            <div className="p-4 bg-gray-800 text-white rounded-lg">
                <p className="font-semibold">{name}</p>
                <p className="mt-1">
                    Value: <span className="font-bold">${value}</span>
                </p>
            </div>
        );
    }
    return null;
};
