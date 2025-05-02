import React, { useEffect, useState } from 'react';

const FinanceTable = () => {
  const [data, setData] = useState({
    totalDonations: 0,
    totalExpenses: 0,
    netAmount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://langar-db-csvv.onrender.com/overall-summary');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full py-8 bg-[#fffaf3]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 px-4">
        {/* Total Donations */}
        <div className="bg-[#fce6a4] shadow-md rounded-2xl p-6 text-center border border-[#ffcc70]">
          <h3 className="text-lg font-semibold text-[#6b2400] mb-2">कुल दान राशि</h3>
          <p className="text-2xl font-bold text-[#6b2400]">₹ {data.totalDonations}</p>
        </div>

        {/* Total Expenses */}
        <div className="bg-[#f8d3d3] shadow-md rounded-2xl p-6 text-center border border-[#ff9999]">
          <h3 className="text-lg font-semibold text-[#6b2400] mb-2">कुल खर्च</h3>
          <p className="text-2xl font-bold text-[#6b2400]">₹ {data.totalExpenses}</p>
        </div>

        {/* Net Amount */}
        <div className="bg-[#d7f8d3] shadow-md rounded-2xl p-6 text-center border border-[#99e699]">
          <h3 className="text-lg font-semibold text-[#6b2400] mb-2">शुद्ध राशि</h3>
          <p className="text-2xl font-bold text-[#6b2400]">₹ {data.netAmount}</p>
        </div>
      </div>
    </div>
  );
};

export default FinanceTable;
