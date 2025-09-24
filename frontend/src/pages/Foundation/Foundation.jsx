// Foundation.jsx
import React, { useEffect, useState } from "react";

const Foundation = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

        fetch(`${baseUrl}/api/home/banner`)
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setError("Failed to load banner content");
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

    return (
        <div className="container">
            <div className="max-w-screen-8xl mx-auto font-Figtree overflow-hidden pt-4 px-4 min-h-[700px] sm:min-h-[750px] md:min-h-[800px] lg:min-h-[500px] xl:min-h-[600px] 2xl:min-h-[700px]">
                <div className="breadcrumb-container w-full text-left mb-0 font-figtree font-lite">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb m-0 p-0">
                            <li className="breadcrumb-item">
                                <a href="/" className="text-gray">Home</a>
                            </li>
                            <li className="breadcrumb-item">
                                <a href="/foundation" className="!text-gray-600">The Foundation</a>
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="max-w-screen-8xl mx-auto font-Figtree overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[700px] sm:min-h-[750px] md:min-h-[800px] lg:min-h-[500px] xl:min-h-[600px] 2xl:min-h-[700px]">
                    {/* Right Image Section (mirrored) */}
                    <div className="flex items-center justify-center px-4 lg:px-8 xl:px-12 2xl:px-16 h-full order-2 lg:order-2">
                        <img
                            src={data.imageUrl}
                            alt="Langshott Foundation Author"
                            className="w-full max-h-[700px] object-contain mx-auto select-none transition duration-300"
                        />
                    </div>

                    {/* Left Text Section (mirrored) */}
                    <div className="relative bg-transparent px-4 pt-5 text-center flex flex-col justify-center items-center overflow-y-auto max-w-[700px] xl:max-w-[800px] mx-auto h-full order-1 lg:order-1">

                        {/* Logo */}
                        <div className="mb-3 sm:mb-5">
                            <img
                                src={data.logoUrl}
                                alt={data.title}
                                className="h-26 sm:h-30 max-h-34 w-auto block select-none mx-auto mt-0"
                            />
                        </div>

                        {/* Title Section */}
                        <div className="relative inline-block text-center">
                            <h1 className="text-[30px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight mt-4 mb-4 sm:mb-6">
                                {data.title}
                            </h1>
                            <img
                                src="/motif.webp"
                                alt="feather"
                                className="absolute left-1/2 -bottom-2 sm:-bottom-0 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 h-auto opacity-15 mb-4 md:mb-6"
                            />
                        </div>

                        {/* Description */}
                        <p className="text-[16px] sm:text-[18px] md:text-[18px] lg:text-[20px] xl:text-[20px] text-black-800 font-Figtree font-regular leading-tight lg:leading-[1.3] mt-2 lg:mt-4 mb-3 px-2 sm:px-2 text-center">
                            {data.description}
                        </p>

                        {/* Stars Divider */}
                        <div className="flex justify-center gap-2 text-gray-600 mb-0 font-bellmt flex-wrap">
                            {[...Array(data.starsCount || 6)].map((_, i) => (
                                <span key={i} className="text-2xl sm:text-3xl lg:text-4xl">*</span>
                            ))}
                        </div>

                        {/* Highlighted Quote */}
                        <p className="text-[17px] sm:text-[22px] md:text-[24px] lg:text-[25px] xl:text-[25px] font-Figtree font-regular leading-snug leading-tight text-[#8c2f2f] italic lg:leading-[1.3] px-4 sm:px-10 text-center">
                            "{data.quote}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Foundation;
