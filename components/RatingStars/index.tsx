import { FaRegStar, FaRegStarHalfStroke, FaStar } from "react-icons/fa6";

interface RatingStarsProps {
  rate: number;
}

export function RatingStars({ rate }: RatingStarsProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        if (index + 1 <= Math.floor(rate)) {
          return <FaStar key={index} className="text-purple-100" size={24} />;
        } else if (index < Math.ceil(rate) && rate % 1 !== 0) {
          return (
            <FaRegStarHalfStroke
              key={index}
              className="text-purple-100"
              size={24}
            />
          );
        } else {
          return (
            <FaRegStar key={index} className="text-purple-100" size={24} />
          );
        }
      })}
    </div>
  );
}
