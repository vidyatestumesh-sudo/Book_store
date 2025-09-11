import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const thoughts = [
  {
    id: 1,
    title: "The Silent Chant",
    text: `In the depths of your being, there is a chant that makes no sound. It does not move, yet it breathes life into all that you are. This silent chant is the heartbeat of eternity, the hidden flame of the soul that is still, unmoving, yet illuminating every corner of your existence. It is the song of timelessness, resounding not in words, but in presence. When you rest in this nucleus of silence, you awaken to the truth: you are not merely a passing echo, but the eternal note itself.\n– Anil Kumar`,
  },
  {
    id: 2,
    title: "Communion",
    text: `The hand that reaches out, not to conquer but to commune, is the doorway to peace. But only hearts emptied of pride and filled with the Divine can truly embrace the other as self.\n– Anil Kumar`,
  },
  {
    id: 3,
    title: "T.E.M.P.L.E.",
    text: `T.E.M.P.L.E.\nTranquil Embrace of Mindful Presence, Love, and Expansion\nIt is a non-descript sanctuary of silence, presence and conscious growth where one communes with infinite, not through dogma, but through deep inner experience and unity.\n– Anil Kumar`,
  },
  {
    id: 4,
    title: "Mindful Grace",
    text: `I welcome the material world with mindful grace, knowing that true wealth is measured in intention. I walk in the world with spirit as my compass and abundance as my companion.\nAll I receive, I elevate; all I give, I sanctify.\nIn me, matter and spirit live as one.\n– Anil Kumar`,
  },
  {
    id: 5,
    title: "Eternity GPS",
    text: `I typed ETERNITY into my car’s satellite navigation. I got this: "Calculating route to: ETERNITY… this may take a while." Estimated time of arrival: Unknown. Travel safely, traveller of time! "In 500 billion light years, take a slight turn left at the edge of time.“ You’re already there. You just haven’t realized it yet. “You have arrived … but Eternity was inside you all along.”\n– Anil Kumar`,
  },
  {
    id: 6,
    title: "Universal Identity",
    text: `I am a microcosm of the universe,\ninseparable from its vastness.\nI will endure as long as the universe itself.\nI am not merely a cog in the machine –\nI am the machine!\n– Anil Kumar`,
  },
  {
    id: 7,
    title: "The Highly Evolved Mind",
    text: `A highly evolved mind transcends ordinary thought patterns and limitations, demonstrating clarity, wisdom, and insight. Operating beyond the confines of the ego, it possesses an expansive awareness that embraces complexity with ease and finds unity in diversity. Such a mind is deeply attuned to the material and spiritual realms, effortlessly integrating knowledge, experience, and intuition.\nIt exemplifies compassion, empathy, and a deeply-baked understanding of interconnectedness, allowing it to live with purpose, balance, and harmony.\n– Anil Kumar`,
  },
  {
    id: 8,
    title: "Many Lifetimes",
    text: `I am the product of countless cycles of birth and death,\nmy inner fabric woven over many lifetimes.\nI don't hold my parents responsible for my existence,\nbut I honour them for their role in the journey of my being.\n– Anil Kumar`,
  },
  {
    id: 9,
    title: "Rainbow of Joy",
    text: `Happiness is perpetual.\nIt begins with the first glimpse of a rainbow,\nand continues as one follows its arc.\nWhen the rainbow fades, it is time to pause,\nand eagerly anticipate its return.\nThe cycle never ceases.\nThe interval between the stop and start is the perfect time to revitalise with optimism.\n– Anil Kumar`,
  },
  {
    id: 10,
    title: "Wholeness",
    text: `Blissfulness, elation, ecstasy and rhapsody, and barbarity, brutality, and beastliness are from the same one source created by the perceptions of life, and exist on the two extreme ends of the same spectrum of the inner states. When one experiences wholeness one will strike upon the eternal truth that all fragmentation is the child of deluded thinking.\n– Anil Kumar`,
  },
  {
    id: 11,
    title: "The Spider and the Wall",
    text: `If you use a sledgehammer to kill a spider on the wall, you may destroy the spider but the wall will break too.\nFor every spider you kill there will be ten more. How many walls will you break?\nFeral minds will live in ignominy.\n– Anil Kumar`,
  },
  {
    id: 12,
    title: "Reflections",
    text: `'If you see love in the other, that's because it's in you.\nEqually, turn to yourself and repair your emotions if you see hate and anger in the other'\n– Anil Kumar`,
  },
  {
    id: 13,
    title: "Divine Intelligence",
    text: `What AI?\nEncased within the vast expanse of cosmic consciousness resides a hyper-scalable Divine Intelligence – the origin of all creation, possessing a potency that far surpasses the limits of the human mind's imagination.\n– Anil Kumar`,
  },
  {
    id: 14,
    title: "Gratitude",
    text: `Gratitude is a growth hormone.\nIts transformational qualities turn 'enough' to 'more', so I can be generous.\n– Anil Kumar`,
  },
  {
    id: 15,
    title: "The Power of Belief",
    text: `Belief is a language of creation that we are gifted with.\n– Anil Kumar`,
  },
];


const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

const ReaderThoughts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Word count helper
  const wordCount = (text) => text.trim().split(/\s+/).length;

  // Responsive: Get slice of 1 or 2 depending on word count
  const getVisibleThoughts = () => {
    const first = thoughts[currentIndex];
    const firstWords = wordCount(first.text);

    if (isMobile() || firstWords > 60) {
      return [first];
    }

    const second = thoughts[currentIndex + 1];
    const secondWords = second ? wordCount(second.text) : 0;

    if (second && secondWords <= 60) {
      return [first, second];
    }

    return [first];
  };

  const visibleThoughts = getVisibleThoughts();

  const handlePrev = () => {
    if (currentIndex > 0) {
      // Go back by one if current thought is single
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    const nextIndex = currentIndex + visibleThoughts.length;
    if (nextIndex < thoughts.length) {
      setCurrentIndex(nextIndex);
    }
  };

return (
    <div className="min-h-screen py-16 font-serif">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-stretch shadow-md rounded-xl overflow-hidden">
        
        {/* Left Image */}
        <div className="relative w-full h-full">
          <img
            src="/my-mind.webp"
            alt="mind"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Content */}
        <div className="relative bg-[#e6e8da] p-10 flex flex-col justify-center">
          {/* Gradient overlay */}
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-l from-[#e6e8da] to-transparent pointer-events-none z-0" />

          {/* Title */}
          <div className="relative mb-12 text-left z-10 mt-2">
            <div className="relative inline-block">
              <img
                src="/motif.webp"
                alt="feather"
                className="absolute top-1/2 left-1/2 w-20 md:w-28 transform -translate-x-1/2 -translate-y-1/2 opacity-20 z-0"
              />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-playfair relative z-10">
                What’s On My Mind?
              </h2>
            </div>
          </div>

          {/* Thought Grid */}
          <div
            className={`grid ${
              visibleThoughts.length === 2 ? "grid-cols-2" : "grid-cols-1"
            } gap-8 z-10`}
          >
            {visibleThoughts.map((thought) => (
              <div key={thought.id} className="space-y-4">
                <h3 className="text-4xl font-light text-red-700 font-figtree">
                  {String(thought.id).padStart(2, "0")}
                </h3>
                <p className="text-gray-800 leading-relaxed whitespace-pre-line font-figtree">
                  <span className="block font-bold mb-2">{thought.title}</span>
                  {thought.text}
                </p>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-start gap-6 mt-10 z-10">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-400 text-gray-700 disabled:opacity-30"
            >
              ←
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex + 2 >= thoughts.length}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-400 text-gray-700 disabled:opacity-30"
            >
              →
            </button>

            <span className="text-gray-700 text-sm font-figtree">
              {String(Math.ceil((currentIndex + 1) / 2)).padStart(2, "0")} /{" "}
              {String(Math.ceil(thoughts.length / 2)).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ReaderThoughts;