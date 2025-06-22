import React, { useEffect, useState } from "react";
import AllExpensesTable from "../components/AllExpensesTable";
import DonationsTable from "../components/DonationsTable";
import FinanceTable from "../components/FinanceTable";
import { Link } from "react-router-dom";
import { Users, ChevronDown } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("attendance");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true); // Indicate data loading has started

        // Fetch attendance data
        const attendanceRes = await fetch(
          "https://langar-db-csvv.onrender.com/attendance"
        );
        const attendance = await attendanceRes.json();
        const result = attendance[0];
        setAttendanceData(result);

        // Set default selected year and month based on current date
        const years = Object.keys(result);
        if (years.length > 0) {
          const currentYear = new Date().getFullYear().toString();
          const defaultYear = years.includes(currentYear)
            ? currentYear
            : years[0];
          const months = Object.keys(result[defaultYear]);
          const currentMonth = new Date().toLocaleString("default", {
            month: "long",
          });
          const defaultMonth = months.includes(currentMonth)
            ? currentMonth
            : months[0];

          setSelectedYear(defaultYear);
          setSelectedMonth(defaultMonth);
        }

        // Fetch member details and format them as roll_no => full name
        const membersRes = await fetch(
          "https://langar-db-csvv.onrender.com/member-full-details"
        );
        const members = await membersRes.json();
        const formatted = {};
        members.forEach((student) => {
          const fullName = `${student.name} ${student.last_name}`.trim();
          formatted[student.roll_no] = fullName;
        });
        setStudents(formatted);
      } catch (error) {
        console.error("Error fetching main data:", error);
      } finally {
        setLoading(false); // Data loading complete
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-indigo-100 via-orange-200 to-white">
        <div className="flex flex-col items-center space-y-6">
          {/* Spinner with a soft color */}
          <div className="w-16 h-16 border-8 border-solid border-transparent border-t-orange-600 rounded-full animate-spin"></div>

          {/* Spiritual Text with 'Jai Gurudev' */}
          <div className="text-orange-700 font-semibold text-2xl">Loading</div>
        </div>
      </div>
    );
  }

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
    <div className="p-4 sm:p-6 bg-gradient-to-br ">
      {/* Super Admin Button */}
      <div className="w-full flex justify-end mb-6 px-2">
        <div className="relative">
          {/* Dropdown Toggle Button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-semibold px-5 py-2.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <Users className="w-5 h-5" />
            <ChevronDown
              className={`w-4 h-4 transform transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 mt-3 w-48 bg-white border border-[#facc15] rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in">
              <Link
                to="/superadminlogin"
                className="block px-5 py-3 text-sm text-[#92400e] hover:bg-[#fff7e6] font-medium transition-colors duration-200"
                onClick={() => setOpen(false)}
              >
                🔐 Super Admin
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Title Section */}
      <h1 className="text-4xl sm:text-5xl text-center font-extrabold text-[#6A4C28] mb-8 sm:mb-12 tracking-wider">
        <span className="block text-5xl sm:text-6xl text-[#6A4C28] mb-3 leading-snug">
          श्री सुदर्शन सेना
        </span>
        <span className="block text-3xl sm:text-4xl font-semibold text-[#8B5E3C]">
          भोजन वितरण
        </span>
      </h1>

      {/* Finance Table */}

      {/* Navigation Tabs for Attendance, Expenses, and Donations */}
      {/* <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {["attendance", "expenses", "donations"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2.5 rounded text-sm font-semibold border transition-all duration-300 ease-in-out 
        ${
          activeTab === tab
            ? "bg-gradient-to-r from-[#FFB900] to-[#FF8800] text-white shadow-md border-transparent scale-105"
            : "bg-white text-[#000] border-[#FFB900] hover:bg-[#FFF3D1] hover:text-[#000]"
        }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div> */}

      <button className="w-full sm:w-48 mb-4 h-12 bg-gradient-to-r from-[#FDE68A] to-[#FBBF24] text-white font-semibold rounded-lg shadow-md hover:bg-[#FBBF24] hover:scale-105 transition-all duration-300">
        <Link
          to="/Sewadaar"
          className="flex items-center justify-center gap-2 w-full h-full text-sm text-[#7C3AED] hover:text-white transition-colors duration-200"
          onClick={() => setOpen(false)}
        >
          <span>👥</span> All Sewadaars
        </Link>
      </button>

      {/* Attendance Filters (Year and Month Selection) */}
      {activeTab === "attendance" && (
        <div className="flex justify-center gap-2 mb-6 flex-nowrap overflow-x-auto">
          <select
            className="px-5 py-3 border border-[#e3b04b] rounded-lg bg-[#fff9ec] text-[#5c2d06] shadow focus:outline-none focus:ring-2 focus:ring-[#e3b04b] w-full sm:w-52 transition-all duration-200"
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
            className="px-5 py-3 border border-[#e3b04b] rounded-lg bg-[#fff9ec] text-[#5c2d06] shadow focus:outline-none focus:ring-2 focus:ring-[#e3b04b] w-full sm:w-52 transition-all duration-200"
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

      {/* Render Table Based on Active Tab and Filters */}
      {activeTab === "attendance" && selectedYear && selectedMonth ? (
        <div className="overflow-x-auto overflow-y-auto h-[calc(100vh-300px)] shadow-lg rounded-lg bg-white">
          <table className="w-full text-sm text-center border border-gray-300 bg-white rounded-lg">
            <thead className="bg-orange-100 text-orange-800">
              <tr>
                <th className="border border-gray-300 px-2 py-2 sticky top-0 left-0 bg-orange-100 z-10">
                  क्रम
                </th>
                <th className="border border-gray-300 px-2 py-2 sticky top-0 left-0 bg-orange-100 z-10">
                  नाम
                </th>
                {daysInMonth.map(({ date, day }) => (
                  <th
                    key={date}
                    className="border border-gray-300 px-2 py-2 sticky top-0 bg-orange-100"
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
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="border border-gray-200 px-2 py-2 sticky left-0 bg-white">
                    {roll}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 font-medium text-left sticky left-0 bg-white">
                    {name}
                  </td>
                  {daysInMonth.map(({ date }) => {
                    const present =
                      attendanceData[selectedYear]?.[selectedMonth]?.[date] ||
                      {};
                    return (
                      <td
                        key={date}
                        className="border border-gray-100 px-2 py-2 text-green-600"
                      >
                        {present[roll] === "present" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-green-700 inline-block"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === "expenses" ? (
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
