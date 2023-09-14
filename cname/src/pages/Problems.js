import React, { useState } from "react";
import ProblemItem from "../components/problemItem";

const Data_of_problems = [
  {
    title: "Problems",
    error: "0",
    warnings: "25",
    success: "200",
  },
  {
    title: "Blacklist",
    error: "0",
    warnings: "25",
    success: "200",
  },
  {
    title: "Mail Server",
    error: "0",
    warnings: "25",
    success: "200",
  },
  {
    title: "Web Server",
    error: "0",
    warnings: "25",
    success: "200",
  },
  {
    title: "DNS",
    error: "0",
    warnings: "25",
    success: "200",
  },
];

const Problems = () => {
  const [selectedDiv, setSelectedDiv] = useState(null);

  const handleClick = (index) => {
    setSelectedDiv((prevSelectedDiv) =>
      prevSelectedDiv === index ? null : index
    );
  };

  return (
    <div className="flex justify-between">
      {Data_of_problems.map((item, index) => (
        <ProblemItem
          key={index}
          index={index}
          title={item.title}
          error={item.error}
          warnings={item.warnings}
          success={item.success}
          isSelected={selectedDiv === index}
          handleClick={handleClick}
        />
      ))}
    </div>
  );
};

export default Problems;
