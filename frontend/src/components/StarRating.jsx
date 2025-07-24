import { FaStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
  const percentage = (rating / 5) * 100;

  return (
   <div className="relative inline-block w-[80px] h-[18.5px]">
      {/* Gray background stars */}
      <div className="absolute top-0 left-0 flex text-gray-300">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="w-4 h-4" />
        ))}
      </div>

      {/* Yellow stars with clipping */}
      <div
        className="absolute top-0 left-0 flex text-yellow-400 overflow-hidden"
        style={{ width: `${percentage}%` }}
      >
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="w-4 h-4  flex-shrink-0" />
        ))}
      </div>
    </div>
  );
};

export default StarRating;