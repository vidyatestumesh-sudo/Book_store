import React from "react";

const corners = [
    {
        id: 1,
        title: "Positivity Corner",
        description:
            "The individual who, having confronted the depths of wickedness within, silently commits to its eradication at its very source, initiates an unstoppable ripple effect that dismantles the darkness in countless others.",
        image: "/b2.jpg",
        bgColor: "#bc6430",
    },
    {
        id: 2,
        title: "The Sufi Corner",
        description:
            "He that looks at a white wall and sees himself on it has reached the veil between form and formlessness, where the self dissolves into the divine mirror of existence.",
        image: "/b1.jpg",
        author: "Anil Kumar",
        bgColor: "#8c2f24",
    },
];

const Corners = () => {
    return (
        <section className="bg-[#e9e0d4] py-16 px-6 font-serif">
            {/* Cards */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                {corners.map((corner) => (
                    <div key={corner.id} className="relative pt-14">
                        {/* Hanging Pin + Ropes */}
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
                            {/* Pin */}
                            <div className="w-4 h-4 bg-[#d5a56f] rounded-full z-20"></div>

                            {/* Ropes connecting to card */}
                            <svg
                                viewBox="0 0 100 50"
                                className="w-15 h-14 -mt-1 z-10"
                                preserveAspectRatio="none"
                            >
                                <line
                                    x1="50"
                                    y1="0"
                                    x2="5"
                                    y2="60"
                                    stroke="#d5a56f"
                                    strokeWidth="4"
                                />
                                <line
                                    x1="50"
                                    y1="0"
                                    x2="95"
                                    y2="60"
                                    stroke="#d5a56f"
                                    strokeWidth="4"
                                />
                            </svg>
                        </div>


                        {/* Card */}
                        <div
                            className="rounded-lg shadow-md text-white overflow-hidden h-[500px] flex flex-col justify-between"
                            style={{
                                backgroundColor: corner.bgColor,
                            }}
                        >
                            <div className="px-6 py-8 text-center">
                                {/* Title */}
                                <h3 className="text-2xl font-semibold mb-4 relative">
                                    {corner.title}
                                    {/* Decorative feather (optional) */}
                                    <span className="block w-full h-4 mt-1">
                                        <img
                                            src="/feather.png"
                                            alt="decoration"
                                            className="mx-auto opacity-20 w-6"
                                        />
                                    </span>
                                </h3>

                                {/* Image */}
                                <div className="w-full h-48 overflow-hidden rounded-md mb-4">
                                    <img
                                        src={corner.image}
                                        alt={corner.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Description */}
                                <p className="text-sm leading-relaxed">{corner.description}</p>

                                {/* Author */}
                                {corner.author && (
                                    <p className="mt-4 italic text-sm text-right">– {corner.author}</p>
                                )}

                                {/* Arrows */}
                                <div className="flex justify-center gap-4 mt-6">
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-white hover:bg-white hover:text-[#bc6430] transition">
                                        ←
                                    </button>
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-white hover:bg-white hover:text-[#bc6430] transition">
                                        →
                                    </button>
                                </div>

                                {/* Read More (for non-author card) */}
                                {!corner.author && (
                                    <div className="mt-4 text-center">
                                        <a
                                            href="#"
                                            className="inline-flex items-center gap-1 text-white hover:underline"
                                        >
                                            Read More
                                            <span className="text-lg">→</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Corners;
