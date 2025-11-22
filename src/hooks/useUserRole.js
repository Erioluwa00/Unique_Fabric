// // hooks/useUserRole.js
// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';

// export const useUserRole = () => {
//   const { user } = useContext(AuthContext);
  
//   const getUserRole = () => {
//     if (!user) return null;
//     return user.role || (user.isAdmin ? 'admin' : 'customer');
//   };

//   const hasPermission = (allowedRoles) => {
//     const userRole = getUserRole();
//     return userRole && allowedRoles.includes(userRole);
//   };

//   const isAdmin = () => getUserRole() === 'admin';
//   const isManager = () => getUserRole() === 'manager';
//   const isStaff = () => getUserRole() === 'staff';
//   const isCustomer = () => getUserRole() === 'customer';

//   return {
//     userRole: getUserRole(),
//     hasPermission,
//     isAdmin,
//     isManager,
//     isStaff,
//     isCustomer
//   };
// };