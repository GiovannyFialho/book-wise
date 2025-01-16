import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa6";

interface StarRatingProps {
  onRate: (rate: number) => void;
}

export function StarRating({ onRate }: StarRatingProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (value: number) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (value: number) => {
    onRate(value);
    setRating(value);
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const currentRating = hoverRating || rating;

        const isFull = currentRating >= starValue;

        return (
          <span
            key={index}
            className="cursor-pointer text-purple-100"
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
          >
            {isFull ? <FaStar size={30} /> : <FaRegStar size={30} />}
          </span>
        );
      })}
    </div>
  );
}
