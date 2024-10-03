// frontend/src/components/Plotter.js
import React, { useState } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import { Rnd } from 'react-rnd';  // Import the Rnd component

const Plotter = () => {
    const [functionStr, setFunctionStr] = useState('');
    const [variables, setVariables] = useState(1);
    const [image, setImage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePlot = async () => {
        try {
            setError(''); // Reset error
            setLoading(true); // Start loading

            const response = await axios.post('http://192.168.1.16:5000/plot', {
                functionStr,
                variables,
            }, {
                headers: {
                    'Content-Type': 'application/json' // Ensure JSON content type is set
                }
            });

            setImage(response.data.image); // Set the Base64 image string received from backend
        } catch (error) {
            setError(error.response?.data?.error || 'An error occurred while plotting.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="flex h-screen plot-container"> {/* Apply new class for layout */}
            <Rnd
                default={{
                    x: 0,
                    y: 0,
                    width: "20%",
                    height: "100%",
                }}
                minWidth="150"
                minHeight="100%"
                enableResizing={{ right: true }}
                dragHandleClassName="handle"
                className="bg-white border shadow-lg"
            >
                <div className="handle p-4 cursor-move">
                    <h1 className="text-2xl font-bold">Math Function Plotter</h1>
                    <input
                        type="text"
                        className="border border-gray-300 rounded p-2 my-4 w-full"
                        placeholder="Enter function (e.g., sin(x) + x^2)"
                        value={functionStr}
                        onChange={(e) => setFunctionStr(e.target.value)}
                    />
                    <select
                        className="border border-gray-300 rounded p-2 my-2 w-full"
                        value={variables}
                        onChange={(e) => setVariables(e.target.value)}
                    >
                        <option value={1}>1 Variable</option>
                        <option value={2}>2 Variables</option>
                    </select>
                    <button
                        className="bg-blue-500 text-white rounded px-4 py-2 w-full"
                        onClick={handlePlot}
                    >
                        Plot
                    </button>
                    {loading && (
                        <div className="flex justify-center my-4">
                            <ThreeDots color="#00BFFF" height={80} width={80} />
                        </div>
                    )}
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            </Rnd>
            <div className="plot-area"> {/* This container will adjust its width */}
                {image && (
                    <div className="mt-4">
                        <img src={image} alt="Plot" className="max-w-full" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Plotter;
