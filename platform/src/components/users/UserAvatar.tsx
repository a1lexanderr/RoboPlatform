import React from "react";
import { User } from "lucide-react";
import { ImageDTO } from "@/types";

interface UserAvatarProps {
  image?: ImageDTO | null;
  size?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ image, size = 96 }) => {
  return (
    <div
      className="relative rounded-full overflow-hidden bg-gray-700 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {image ? (
        <img
          src={image.url}
          alt={image.title || "User avatar"}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            target.nextElementSibling?.classList.remove("hidden");
          }}
        />
      ) : null}
      <User className={`absolute text-gray-500 ${image ? "hidden" : ""}`} size={size / 2} />
    </div>
  );
};

export default UserAvatar;
