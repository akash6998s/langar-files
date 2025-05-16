import React, { useEffect, useState } from "react";

const FinanceTable = ({ setLoading }) => {
  const [summaryData, setSummaryData] = useState({
    totalDonations: 0,
    totalFines: 0,
    totalExpenses: 0,
    netAmount: 0,
  });
  const [additionalData, setAdditionalData] = useState(0);

  useEffect(() => {
    const fetchAllData = async () => {
      const summaryRes = await fetch("https://langar-db-csvv.onrender.com/overall-summary");
      const summary = await summaryRes.json();
      if (summary.success) {
        setSummaryData(summary.data);
      }
    };

    const fetchAdditionalData = async () => {
      try {
        const response = await fetch("https://langar-db-csvv.onrender.com/additional");
        const result = await response.json();
        setAdditionalData(result.donatedRemoved || 0);
      } catch (error) {
        console.error("Error fetching additional data:", error);
        setAdditionalData(0);
      }
    };

    fetchAdditionalData();
    fetchAllData();
  }, []);

  const cardData = [
    {
      title: "Total Donations",
      value: summaryData.totalDonations + additionalData + summaryData.totalFines,
      bgColor: "bg-gradient-to-r from-[#FFB900] to-[#FF6600]", // Gradient from gold to orange
    },
    {
      title: "Total Expenses",
      value: summaryData.totalExpenses,
      bgColor: "bg-gradient-to-r from-[#9B2C2C] to-[#E53E3E]", // Gradient from rich red to dark red
    },
    {
      title: "Net Amount",
      value: summaryData.netAmount + additionalData,
      bgColor: "bg-gradient-to-r from-[#38A169] to-[#2F855A]", // Gradient from green to darker green
    },
  ];

  return (
    <div className=" bg-white">
    <div className="grid grid-col gap-4">
      {cardData.map((item, idx) => (
        <div
          key={idx}
          className={`flex flex-col items-center justify-center ${item.bgColor} shadow-xl p-5 sm:p-6`}
        >
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-4 tracking-wide text-center">
            {item.title}
          </h3>
          <p className="text-3xl sm:text-4xl font-bold text-white animate__animated animate__fadeIn animate__delay-1s">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  </div>
  );
};

export default FinanceTable;
