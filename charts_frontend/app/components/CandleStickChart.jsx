'use client';

import { useEffect, useState } from 'react';
import {
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Bar,
    Cell,
    Legend,
} from 'recharts';

const API_URL = 'http://127.0.0.1:8000/api/candlestick-data/';

const CandleStickChartComponent = () => {
    const [candleData, setCandleData] = useState([]);
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

                // Format the data for the candlestick chart
                const formattedData = result.data.map((entry) => ({
                    ts: entry.x,
                    open: entry.open,
                    high: entry.high,
                    low: entry.low,
                    close: entry.close,
                }));

                setCandleData(formattedData);
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
    if (!candleData || candleData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-xl text-red-500">No data available to display the chart.</p>
            </div>
        );
    }

    // Prepare the data with open and close in an array for rendering
    const prepareData = (data) => {
        return data.map(({ open, close, ...other }) => ({
            ...other,
            openClose: [open, close],
        }));
    };

    const data = prepareData(candleData);

    // Calculate min and max values for the Y-axis
    const minValue = data.reduce(
        (minValue, { low, openClose: [open, close] }) => {
            const currentMin = Math.min(low, open, close);
            return minValue === null || currentMin < minValue ? currentMin : minValue;
        },
        null
    );

    const maxValue = data.reduce(
        (maxValue, { high, openClose: [open, close] }) => {
            const currentMax = Math.max(high, open, close);
            return currentMax > maxValue ? currentMax : maxValue;
        },
        minValue
    );

    // Custom Candlestick shape
    const Candlestick = (props) => {
        const { x, y, width, height, low, high, openClose: [open, close] } = props;
        const isGrowing = open < close;
        const color = isGrowing ? 'green' : 'red';
        const ratio = Math.abs(height / (open - close));
        // Render the candlestick based on the data 
        return (
            <g stroke={color} fill="none" strokeWidth="2">
                <path
                    d={`
                  M ${x},${y}
                  L ${x},${y + height}
                  L ${x + width},${y + height}
                  L ${x + width},${y}
                  L ${x},${y}
                `}
                />
                {/* bottom line -> red line */}
                {isGrowing ? (
                    <path
                        d={`
                    M ${x + width / 2}, ${y + height}
                    v ${(open - low) * ratio}
                  `}
                    />
                ) : (
                    <path
                        d={`
                    M ${x + width / 2}, ${y}
                    v ${(close - low) * ratio}
                  `}
                    />
                )}
                {/* top line -> green line */}
                {isGrowing ? (
                    <path
                        d={`
                    M ${x + width / 2}, ${y}
                    v ${(close - high) * ratio}
                  `}
                    />
                ) : (
                    <path
                        d={`
                    M ${x + width / 2}, ${y + height}
                    v ${(open - high) * ratio}
                  `}
                    />
                )}
            </g>
        );
    };


    // Render Candlestick chart with fetched data
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
            >
                <XAxis dataKey="ts" />
                <YAxis domain={[minValue, maxValue]} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                    dataKey="openClose"
                    fill="#8884d8"
                    shape={<Candlestick />}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'blue' : 'orange'} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CandleStickChartComponent;

const CustomTooltip = ({ active, payload, label }) => {

    if (active && payload && payload.length) {
        const { openClose, high, low } = payload[0].payload;
        return (
            <div className="p-4 bg-gray-800 text-white rounded-lg">
                <p>Open: ${openClose[0]}</p>
                <p>Close: ${openClose[1]}</p>
                <p>High: ${high}</p>
                <p>Low: ${low}</p>
            </div>
        );
    }
    return null;
};
