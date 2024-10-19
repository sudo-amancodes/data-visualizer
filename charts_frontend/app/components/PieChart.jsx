'use client';

import { useEffect, useState } from 'react';
import {
    PieChart,
    Pie,
    Tooltip,
    Cell,
    ResponsiveContainer,
    Legend,
} from 'recharts';

const API_URL = 'http://127.0.0.1:8000/api/pie-chart-data/';

const COLORS = ['#ff0000', '#0088FE', '#FFBB28'];

const PieChartComponent = () => {
    const [pieData, setPieData] = useState([]);
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

                // Format the data for the pie chart
                const formattedData = result.labels.map((label, index) => ({
                    name: label,
                    value: result.data[index],
                }));

                setPieData(formattedData);
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
    if (!pieData || pieData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-xl text-red-500">No data available to display the chart.</p>
            </div>
        );
    }

    // Render PieChart with fetched pieData
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Legend />

                <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius="80%"
                    fill="#8884d8"
                    label
                >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default PieChartComponent;

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { name, value } = payload[0];
        return (
            <div className="p-4 bg-gray-800 text-white rounded-lg">
                <p className="font-semibold">{name}</p>
            </div>
        );
    }
    return null;
};
