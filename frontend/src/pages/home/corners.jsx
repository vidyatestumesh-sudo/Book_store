import React, { useState } from "react";

const corners = [
    {
        id: 1,
        title: "Positivity Corner",
        description:
            "The individual who, having confronted the depths of wickedness within, silently commits to its eradication at its very source, initiates an unstoppable ripple effect that dismantles the darkness in countless others.",
        image: "/positivity-corner-1.webp",
        bgColor: "#bc6430",
    },
    {
        id: 2,
        title: "The Sufi Corner",
        quotes: [
            "He that looks at a white wall and sees himself on it has reached the veil between form and formlessness, where the self dissolves into the divine mirror of existence.",
            "When the soul lies down in that grass, the world is too full to talk about. Ideas, language... even the phrase each other—doesn’t make any sense.",
            "Don't grieve. Anything you lose comes round in another form.",
        ],
        image: "/the-sufi-corner-1.webp",
        author: "Anil Kumar",
        bgColor: "#8c2f24",
    },
];

const Corners = () => {
    const [quoteIndexes, setQuoteIndexes] = useState(
        corners.map(() => 0) // Initialize one index per corner
    );

    const handleQuoteChange = (cornerIndex, direction) => {
        setQuoteIndexes((prev) => {
            const newIndexes = [...prev];
            const quotesLength = corners[cornerIndex].quotes?.length || 1;
            newIndexes[cornerIndex] =
                (newIndexes[cornerIndex] + direction + quotesLength) % quotesLength;
            return newIndexes;
        });
    };

    return (
        <section className="bg-white py-16 px-6 font-serif">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                {corners.map((corner, index) => (
                    <div key={corner.id} className="relative pt-14">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
                            <div className="w-4 h-4 bg-[#d5a56f] rounded-full z-20"></div>
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

                        <div
                            className="rounded-lg shadow-md text-white overflow-hidden h-[500px] flex flex-col justify-between"
                            style={{
                                backgroundColor: corner.bgColor,
                            }}
                        >
                            <div className="px-6 py-8 text-center">
                                <h3 className="text-2xl font-semibold mb-4 relative">
                                    {corner.title}
                                    <span className="block w-full h-4 mt-1">
                                        <img
                                            src="motif.webp"
                                            alt="decoration"
                                            className="mx-auto opacity-20 w-6"
                                        />
                                    </span>
                                </h3>

                                <div className="w-full h-48 overflow-hidden px-5 rounded-md mb-4">
                                    <img
                                        src={corner.image}
                                        alt={corner.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Description or Quotes */}
                                {corner.quotes ? (
                                    <p className="text-sm leading-relaxed italic">
                                        “{corner.quotes[quoteIndexes[index]]}”
                                    </p>
                                ) : (
                                    <p className="text-sm leading-relaxed">{corner.description}</p>
                                )}

                                {/* Author */}
                                {corner.author && (
                                    <p className="mt-4 italic text-sm text-right">– {corner.author}</p>
                                )}

                                {/* Footer Row */}
                                <div className="mt-6 flex items-center justify-between px-2">
                                    {!corner.author ? (
                                        <a
                                            href="#"
                                            className="inline-flex items-center gap-1 text-white hover:underline text-sm"
                                        >
                                            Read More <span className="text-lg">→</span>
                                        </a>
                                    ) : (
                                        <span></span>
                                    )}

                                    <div className="flex gap-3">
                                        {corner.quotes?.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => handleQuoteChange(index, -1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-white hover:bg-white hover:text-[#8c2f24] transition"
                                                >
                                                    ←
                                                </button>
                                                <button
                                                    onClick={() => handleQuoteChange(index, 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-white hover:bg-white hover:text-[#8c2f24] transition"
                                                >
                                                    →
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Corners;
