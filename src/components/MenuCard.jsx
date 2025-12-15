// export default function MenuCard({ item }) {
//   return (
//     <div
//       className="bg-amber-50 shadow-md rounded-2xl p-4 border border-amber-200 
//                  hover:shadow-xl hover:scale-[1.03] transition 
//                  duration-300 animate-fadeIn"
//       data-aos="zoom-in"
//     >
//       {/* Image */}
//       <img
//         src={item.img}  
//         alt={item.name}
//         className="w-full h-48 object-cover rounded-xl mb-4"
//       />

//       {/* Title */}
//       <h3 className="text-xl font-semibold text-amber-900">{item.name}</h3>

//       {/* Price */}
//       <p className="text-amber-700 mt-1 font-medium">{item.price}</p>
//       {item.addons?.length > 0 && (
//           <div className="mt-2">
//             <p className="font-semibold text-sm text-gray-700">
//               Available Add-ons:
//             </p>

//             {item.addons.map((a, idx) => (
//               <p key={idx} className="text-gray-600 text-sm">
//                 ➕ {a.name} (+₹{a.price})
//               </p>
//             ))}
//           </div>
//         )}
//     </div>
//   );
// }
