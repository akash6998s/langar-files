import React, { useEffect, useState } from "react";

const AllExpensesTable = () => {
  const [expenses, setExpenses] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://langar-db-csvv.onrender.com/expenses");
        const json = await res.json();
        const parsedData = [];

        Object.values(json).forEach((yearObj) => {
          Object.entries(yearObj).forEach(([year, monthsObj]) => {
            Object.entries(monthsObj).forEach(([month, records]) => {
              records.forEach((record) => {
                parsedData.push({
                  year,
                  month,
                  amount: record.amount,
                  description: record.description,
                });
              });
            });
          });
        });

        setExpenses(parsedData);
      } catch (error) {
        console.error("Error fetching expense data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="py-12 px-4 sm:px-8 max-w-6xl mx-auto bg-gradient-to-br from-[#FFF7EA] to-[#FFF2D0] rounded-3xl shadow-2xl border border-[#f7d89c]">

      {/* Section Title */}
      <h2 className="text-4xl font-extrabold text-center text-[#b45309] mb-12 tracking-wide drop-shadow-md">
        📜 सभी खर्चों की जानकारी
      </h2>

      {expenses.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-[#fcecc0]">
          <table className="min-w-full text-sm text-[#4b1c0d]">
            <thead className="bg-[#fff3cd] text-[#9A3412] text-base font-semibold">
              <tr>
                <th className="px-6 py-4 text-left border-b border-[#f0e4b2]">वर्ष</th>
                <th className="px-6 py-4 text-left border-b border-[#f0e4b2]">माह</th>
                <th className="px-6 py-4 text-left border-b border-[#f0e4b2]">राशि</th>
                <th className="px-6 py-4 text-left border-b border-[#f0e4b2]">विवरण</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((item, index) => (
                <tr
                  key={index}
                  className={`transition-all duration-200 ${
                    index % 2 === 0 ? "bg-[#FFFBF0]" : "bg-[#fffaf3]"
                  } hover:bg-[#FFF5DC]`}
                >
                  <td className="px-6 py-3 font-medium">{item.year}</td>
                  <td className="px-6 py-3 capitalize">{item.month}</td>
                  <td className="px-6 py-3 font-bold text-green-700">₹ {item.amount}</td>
                  <td className="px-6 py-3 text-gray-700">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-8 italic">
          कोई खर्चा रिकॉर्ड नहीं मिला।
        </p>
      )}
    </div>
  );
};

export default AllExpensesTable;
