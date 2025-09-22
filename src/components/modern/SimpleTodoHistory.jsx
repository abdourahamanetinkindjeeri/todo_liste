// const SimpleTodoHistory = ({ history = [] }) => {
//   return (
//     <div className="p-4 mt-4 bg-white rounded-lg shadow">
//       <h2 className="mb-3 text-lg font-semibold">Historique des tâches</h2>
//       {history.length === 0 ? (
//         <div className="text-gray-500">Aucune action historique trouvée.</div>
//       ) : (
//         <ul className="space-y-3">
//           {history.map((item) => (
//             <li key={item.id} className="pb-2 border-b last:border-b-0">
//               <div className="flex items-center justify-between">
//                 <span className="font-medium text-blue-600">{item.action}</span>
//                 <span className="text-xs text-gray-400">
//                   {new Date(item.createdAt).toLocaleString()}
//                 </span>
//               </div>
//               {/* <div className="mt-1 text-sm text-gray-700">
//                 {item.description}
//               </div> */}
//               <div className="mt-1 text-xs text-gray-500">
//                 Par : {item.user.prenom} {item.user.nom} ({item.user.email})
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default SimpleTodoHistory;
