// import React from "react";
// import { UserProfileDTO } from "@/types";
// import UserAvatar from "./UserAvatar";

// interface UserInfoCardProps {
//   user: UserProfileDTO;
// }

// const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => {
//   return (
//     <div className="bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center gap-6 border border-gray-700">
//       <UserAvatar image={user.image} size={96} />

//       <div className="flex flex-col">
//         <h2 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h2>
//         <p className="text-gray-400">@{user.username}</p>
//         <p className="text-gray-400">{user.email}</p>
//         {user.phoneNumber && <p className="text-gray-400">{user.phoneNumber}</p>}
//       </div>
//     </div>
//   );
// };

// export default UserInfoCard;
