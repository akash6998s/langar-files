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
    <div className="py-8 max-w-7xl mx-auto shadow-2xl rounded-lg bg-gradient-to-r from-orange-100 to-yellow-200">
      {/* Section Title */}
      <h2 className="text-3xl font-semibold text-center text-orange-700 mb-8 tracking-wide">
        📜 सभी खर्चों की जानकारी
      </h2>

      {/* Display expenses if available */}
      {expenses.length > 0 ? (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-orange-100 text-orange-800">
              <tr>
                <th className="px-6 py-4 text-left">वर्ष</th>
                <th className="px-6 py-4 text-left">माह</th>
                <th className="px-6 py-4 text-left">राशि</th>
                <th className="px-6 py-4 text-left">विवरण</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-6 py-4 font-medium">{item.year}</td>
                  <td className="px-6 py-4 capitalize">{item.month}</td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    ₹ {item.amount}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-4 italic">
          कोई खर्चा रिकॉर्ड नहीं मिला।
        </p>
      )}
    </div>
  );
};

export default AllExpensesTable;
