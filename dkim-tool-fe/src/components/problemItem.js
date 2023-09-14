// import { useState } from "react";

// const ProblemItem = ({ title, error, success, warnings }) => {
//   const [isSelected, setIsSelected] = useState(false);

//   const handleClick = () => {
//     setIsSelected(true);
//   };
//   return (
//     <div className="p-[30px] w-[20%]" onClick={handleClick}>
//       <div className="border-[1px] w-[100%] border-[#ddd]">
//         <div className="border-b-[1px] p-[20px] text-center border-[#ddd]  bg-[#f5f5f5]">
//           <img />
//           <h2>{title}</h2>
//         </div>
//         <div className="border-b-[1px] p-[10px] text-center border-[#ddd] flex justify-center items-center">
//           <span
//             className={`flex items-center text-[#FF3333]  ${isSelected} ? "text-[#3a3a3a]"`}
//           >
//             <span className="flex-none">x</span>
//             <span className="ml-[10px]">{error}</span>
//             <span className="ml-[10px]">Errors</span>
//           </span>
//         </div>
//         <div className="border-b-[1px] p-[10px] text-center border-[#ddd] flex justify-center items-center">
//           <span className="flex items-center text-[#f0ad4e]">
//             <span className="flex-none">!</span>
//             <span className="ml-[10px]">{warnings}</span>
//             <span className="ml-[10px]">Warnings</span>
//           </span>
//         </div>
//         <div className="border-b-[1px] p-[10px] text-center border-[#ddd] flex justify-center items-center">
//           <span className="flex items-center text-[#198754]">
//             <span className="flex-none">x</span>
//             <span className="ml-[10px]">{success}</span>
//             <span className="ml-[10px]">Passed</span>
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ProblemItem;

// import { useState } from "react";

// const ProblemItem = ({ title, error, success, warnings, index }) => {
//   const [selectedDiv, setSelectedDiv] = useState(0);

//   const handleClick = () => {
//     setSelectedDiv(index);
//   };

//   return (
//     <div
//       className={`p-[30px] w-[20%] text-[#000000] ${
//         selectedDiv === index ? "selected" : ""
//       }`}
//       onClick={handleClick}
//     >
//       <div
//         className={`border-[1px] w-[100%] border-[#ddd] ${
//           selectedDiv === index ? "selected" : ""
//         }`}
//       >
//         <div className="border-b-[1px] p-[20px] text-center border-[#ddd]  bg-[#f5f5f5]">
//           <img alt="Problem Icon" />
//           <h2>{title}</h2>
//         </div>
//         <div className="border-b-[1px] p-[10px] text-center border-[#ddd] flex justify-center items-center">
//           <span
//             className={`flex items-center ${
//               selectedDiv === index ? "text-[#FF3333]" : "text-[#000000]"
//             }`}
//           >
//             <span className="flex-none">x</span>
//             <span className="ml-[10px]">{error}</span>
//             <span className="ml-[10px]">Errors</span>
//           </span>
//         </div>
//         <div className="border-b-[1px] p-[10px] text-center border-[#ddd] flex justify-center items-center">
//           <span
//             className={`flex items-center ${
//               selectedDiv === index ? "text-[#f0ad4e]" : "text-[#000000]"
//             }`}
//           >
//             <span className="flex-none">!</span>
//             <span className="ml-[10px]">{warnings}</span>
//             <span className="ml-[10px]">Warnings</span>
//           </span>
//         </div>
//         <div className="border-b-[1px] p-[10px] text-center border-[#ddd] flex justify-center items-center">
//           <span
//             className={`flex items-center ${
//               selectedDiv === index ? "text-[#198754]" : "text-[#000000]"
//             }`}
//           >
//             <span className="flex-none">x</span>
//             <span className="ml-[10px]">{success}</span>
//             <span className="ml-[10px]">Passed</span>
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProblemItem;

import React from "react";

const ProblemItem = ({
  title,
  error,
  success,
  warnings,
  index,
  isSelected,
  handleClick,
}) => {
  return (
    <div
      className={`p-[20px] w-[20%] cursor-pointer ${
        isSelected ? "text-[#3a3a3a] selected shadow-xl" : "text-[#000000]"
      }`}
      onClick={() => handleClick(index)}
    >
      <div
        className={`border-[1px] w-[100%] border-[#ddd] ${
          isSelected ? "selected" : ""
        }`}
      >
        <div className="border-b-[1px] p-[20px] text-center border-[#ddd]  bg-[#f5f5f5]">
          <img alt="Problem Icon" />
          <h2>{title}</h2>
        </div>
        <div className="border-b-[1px] p-[10px] text-center border-[#ddd] flex justify-center items-center">
          <span
            className={`flex items-center ${
              isSelected ? "text-[#FF3333]" : "text-[#000000]"
            }`}
          >
            <span className="flex-none">x</span>
            <span className="ml-[10px]">{error}</span>
            <span className="ml-[10px]">Errors</span>
          </span>
        </div>
        <div className="border-b-[1px] p-[10px] text-center border-[#ddd] flex justify-center items-center">
          <span
            className={`flex items-center ${
              isSelected ? "text-[#f0ad4e]" : "text-[#000000]"
            }`}
          >
            <span className="flex-none">!</span>
            <span className="ml-[10px]">{warnings}</span>
            <span className="ml-[10px]">Warnings</span>
          </span>
        </div>
        <div className="border-b-[1px] p-[10px] text-center border-[#ddd] flex justify-center items-center">
          <span
            className={`flex items-center ${
              isSelected ? "text-[#198754]" : "text-[#000000]"
            }`}
          >
            <span className="flex-none">x</span>
            <span className="ml-[10px]">{success}</span>
            <span className="ml-[10px]">Passed</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProblemItem;
