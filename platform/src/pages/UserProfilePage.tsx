// import React, { useEffect, useState } from "react";
// import { userApi } from "../api/userApi";
// import { UserProfileDTO } from "../types";
// import { PageHeader } from "../components/ui";
// import { User } from "lucide-react";
// import UserInfoCard from "../components/users/UserInfoCard";
// import UserTeamsCard from "../components/users/UserTeamsCard";

// const UserProfilePage: React.FC = () => {
//   const [user, setUser] = useState<UserProfileDTO | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     userApi.getMyProfile()
//       .then(setUser)
//       .catch(err => {
//         if (err instanceof Error) setError(err.message);
//         else setError("Не удалось загрузить профиль");
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return <div className="flex justify-center items-center h-64">
//       <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//     </div>;
//   }

//   if (error) {
//     return <p className="text-center text-red-400">{error}</p>;
//   }

//   if (!user) {
//     return <p className="text-center text-gray-400">Профиль не найден</p>;
//   }

//   return (
//     <div>
//       <PageHeader title="Мой профиль" icon={<User className="h-6 w-6" />} />

//       <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <UserInfoCard user={user} />
//         </div>
//         <UserTeamsCard teams={user.teams || []} />
//       </div>
//     </div>
//   );
// };

// export default UserProfilePage;
