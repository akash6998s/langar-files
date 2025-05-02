import React, { useEffect, useState } from "react";
import AllExpensesTable from "../components/AllExpensesTable";
import DonationsTable from "../components/DonationsTable";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const getDaysInMonth = (year, monthName) => {
  const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const days = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, monthIndex, i);
    const day = date.toLocaleString("default", { weekday: "short" });
    days.push({ date: i, day });
  }

  return days;
};

export default function AttendanceTable() {
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [students, setStudents] = useState({});
  const [activeTab, setActiveTab] = useState("attendance");
  const [summaryData, setSummaryData] = useState({
    totalDonations: 0,
    totalExpenses: 0,
    netAmount: 0,
  }); // New state for summary data
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch attendance data
    fetch("https://langar-db-csvv.onrender.com/attendance")
      .then((res) => res.json())
      .then((data) => {
        const result = data[0];
        setAttendanceData(result);

        const years = Object.keys(result);
        if (years.length > 0) {
          const currentYear = new Date().getFullYear().toString();
          const defaultYear = years.includes(currentYear)
            ? currentYear
            : years[0];
          const months = Object.keys(result[defaultYear]);
          const defaultMonth = months.includes(
            new Date().toLocaleString("default", { month: "long" })
          )
            ? new Date().toLocaleString("default", { month: "long" })
            : months[0];
          setSelectedYear(defaultYear);
          setSelectedMonth(defaultMonth);
        }
      });

    // Fetch student names
    fetch("https://langar-db-csvv.onrender.com/member-full-details")
      .then((res) => res.json())
      .then((data) => {
        const formatted = {};
        data.forEach((student) => {
          const fullName = `${student.name} ${student.last_name}`.trim();
          formatted[student.roll_no] = fullName;
        });
        setStudents(formatted);
      });

    // Fetch overall summary data
    fetch("https://langar-db-csvv.onrender.com/overall-summary")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSummaryData(data.data); // Store the summary data
        }
      });
  }, []);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedMonth("");
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const daysInMonth =
    selectedYear && selectedMonth
      ? getDaysInMonth(selectedYear, selectedMonth)
      : [];

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-orange-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        {/* Logo on the left with half width */}
        <div className="w-1/2 flex justify-start">
          <img className="w-24 h-auto object-contain" src={logo} alt="logo" />
        </div>

        {/* Button on the right with half width */}
        <div className="w-1/2 flex justify-end">
          <button
            onClick={() => navigate("/superadminlogin")}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
          >
            Super Admin
          </button>
        </div>
      </div>
      <h1 className="text-2xl text-center font-bold text-orange-700 mb-6 underline decoration-orange-400">
        श्री सुदर्शन सेना भोजन वितरण
      </h1>

      {/* Summary Data Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-orange-200 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-orange-800">
            Total Donations
          </h3>
          <p className="text-2xl text-green-600">
            {summaryData.totalDonations}
          </p>
        </div>
        <div className="p-4 bg-orange-200 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-orange-800">
            Total Expenses
          </h3>
          <p className="text-2xl text-red-600">{summaryData.totalExpenses}</p>
        </div>
        <div className="p-4 bg-orange-200 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-orange-800">Net Amount</h3>
          <p className="text-2xl text-blue-600">{summaryData.netAmount}</p>
        </div>
      </div>

      {/* Toggle Buttons for Attendance, Expense, and Donations */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-2 py-2 border rounded-md w-24 sm:w-40 text-center ${
            activeTab === "attendance"
              ? "bg-orange-500 text-white"
              : "bg-white text-orange-500"
          }`}
        >
          Attendance
        </button>
        <button
          onClick={() => setActiveTab("expense")}
          className={`px-2 py-2 border rounded-md w-24 sm:w-40 text-center ${
            activeTab === "expense"
              ? "bg-orange-500 text-white"
              : "bg-white text-orange-500"
          }`}
        >
          Expenses
        </button>
        <button
          onClick={() => setActiveTab("donations")}
          className={`px-2 py-2 border rounded-md w-24 sm:w-40 text-center ${
            activeTab === "donations"
              ? "bg-orange-500 text-white"
              : "bg-white text-orange-500"
          }`}
        >
          Donations
        </button>
      </div>

      {/* Dropdowns for Year and Month (only show for Attendance tab) */}
      {activeTab === "attendance" && (
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <select
            className="px-4 py-2 border rounded-md w-full sm:w-48"
            value={selectedYear}
            onChange={handleYearChange}
          >
            {Object.keys(attendanceData).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 border rounded-md w-full sm:w-48"
            value={selectedMonth}
            onChange={handleMonthChange}
            disabled={!selectedYear}
          >
            <option value="">Select Month</option>
            {selectedYear &&
              Object.keys(attendanceData[selectedYear]).map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Render Table based on Active Tab */}
      {activeTab === "attendance" && selectedYear && selectedMonth ? (
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] shadow-md rounded-lg">
          <table className="w-full text-sm text-center border border-orange-300 bg-white rounded">
            <thead className="bg-orange-200 text-orange-900">
              <tr>
                <th className="border border-orange-300 px-3 py-2 sticky top-0 left-0 bg-orange-200 z-10">
                  Roll No
                </th>
                <th className="border border-orange-300 px-3 py-2 sticky top-0 left-0 bg-orange-200 z-10">
                  Name
                </th>
                {daysInMonth.map(({ date, day }) => (
                  <th
                    key={date}
                    className="border border-orange-300 px-2 py-2 sticky top-0 bg-orange-200"
                  >
                    {date} <br /> ({day})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(students).map(([roll, name]) => (
                <tr
                  key={roll}
                  className="hover:bg-orange-50 transition duration-200"
                >
                  <td className="border border-orange-200 px-2 py-2 sticky left-0 bg-white">
                    {roll}
                  </td>
                  <td className="border border-orange-200 px-2 py-2 font-medium text-left sticky left-0 bg-white">
                    {name}
                  </td>
                  {daysInMonth.map(({ date }) => {
                    const present =
                      attendanceData[selectedYear]?.[selectedMonth]?.[date] ||
                      {};
                    return (
                      <td
                        key={date}
                        className="border border-orange-100 px-2 py-2 text-green-600"
                      >
                        {present[roll] === "present" ? "✔️" : ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === "expense" ? (
        <AllExpensesTable />
      ) : activeTab === "donations" ? (
        <DonationsTable />
      ) : (
        <p className="text-center text-orange-700 font-medium">
          ⏳ Loading data...
        </p>
      )}
    </div>
  );
}
