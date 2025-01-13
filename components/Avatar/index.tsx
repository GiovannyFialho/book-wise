import { User } from "phosphor-react";

import {
  AvatarFallback,
  AvatarImage,
  Avatar as UIAvatar,
} from "@/components/ui/avatar";

interface AvatarProps {
  image: string | undefined;
  size: "lg" | "md" | "sm";
}

export function Avatar({ image, size = "lg" }: AvatarProps) {
  return (
    <div
      className={`${size === "lg" && `h-20 w-20`} ${size === "md" && `h-14 w-14`} ${size === "sm" && `h-10 w-10`} flex items-center justify-center rounded-full bg-gradient-vertical`}
    >
      <UIAvatar
        className={`${size === "lg" && `h-20 w-20`} ${size === "md" && `h-14 w-14`} ${size === "sm" && `h-10 w-10`} p-1`}
      >
        <AvatarImage src={image} alt="" className="rounded-full" />

        <AvatarFallback className="bg-gray-950">
          <User size={40} />
        </AvatarFallback>
      </UIAvatar>
    </div>
  );
}
