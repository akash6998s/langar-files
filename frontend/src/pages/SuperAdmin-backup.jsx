import React, { useState, useEffect } from "react";
import axios from "axios";

const SuperAdmin = () => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

  const [attendanceData, setAttendanceData] = useState({
    attendance: {},
    month: "",
    year: "",
    day: "",
  });

  const [expenseData, setExpenseData] = useState({
    amount: "",
    description: "",
    month: "",
    year: "",
  });

  const [donationData, setDonationData] = useState({
    amount: "",
    rollNo: "",
    month: "",
    year: "",
  });

  const [activeSection, setActiveSection] = useState("attendance");
  const [showRollNumberPopup, setShowRollNumberPopup] = useState(false);
  const [availableRollNumbers, setAvailableRollNumbers] = useState([]);

  useEffect(() => {
    const fetchRollNumbers = async () => {
      try {
        const res = await fetch("https://langar-db-csvv.onrender.com/member-full-details");
        const data = await res.json();
        setAvailableRollNumbers(data.map((m) => m.roll_no));
      } catch (err) {
        console.error("Failed to fetch roll numbers:", err);
      }
    };
    fetchRollNumbers();
  }, []);

  useEffect(() => {
    const date = new Date();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const day = date.getDate();

    setAttendanceData((prev) => ({
      ...prev,
      month,
      year,
      day: day.toString(),
    }));
    setExpenseData((prev) => ({ ...prev, month, year }));
    setDonationData((prev) => ({ ...prev, month, year }));
  }, []);

  const handleMonthYearChange = (type, value) => {
    setAttendanceData((prev) => ({ ...prev, [type]: value, day: "1" }));
  };

  const handleRollNoClick = (rollNo) => {
    setAttendanceData((prev) => {
      const updated = { ...prev.attendance };
      if (updated[rollNo]) delete updated[rollNo];
      else updated[rollNo] = true;
      return { ...prev, attendance: updated };
    });
  };

  const addAttendance = async () => {
    const { attendance, month, year, day } = attendanceData;
    const filtered = Object.keys(attendance).filter((r) => attendance[r]);
    if (filtered.length === 0) return alert("No roll numbers selected.");
    try {
      const res = await axios.post("https://langar-db-csvv.onrender.com/update-attendance", {
        attendance: filtered,
        month,
        year: Number(year),
        day: Number(day),
      });
      alert(res.data.message);
      setAttendanceData((prev) => ({ ...prev, attendance: {} }));
    } catch (err) {
      console.error("Error adding attendance:", err);
      alert("Failed to add attendance.");
    }
  };

  const addExpense = async () => {
    const { amount, description, month, year } = expenseData;
    if (!amount || !description.trim())
      return alert("Amount and Description required.");
    try {
      const res = await axios.post("https://langar-db-csvv.onrender.com/add-expense", {
        amount: Number(amount),
        description: description.trim(),
        month,
        year: Number(year),
      });
      alert(res.data.message);
      setExpenseData((prev) => ({ ...prev, amount: "", description: "" }));
    } catch (err) {
      console.error("Error adding expense:", err);
      alert("Failed to add expense.");
    }
  };

  const addDonation = async () => {
    const { amount, rollNo, month, year } = donationData;
    if (!rollNo || !amount || !month || !year)
      return alert("All fields are required.");
    try {
      const res = await axios.post("https://langar-db-csvv.onrender.com/update-donations", {
        rollNo,
        amount: Number(amount),
        month,
        year: Number(year),
      });
      alert(res.data.message);
      setDonationData((prev) => ({ ...prev, amount: "", rollNo: "" }));
    } catch (err) {
      console.error("Error adding donation:", err);
      alert("Failed to add donation.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow space-y-6">
      <button
        onClick={() => {
          window.location.href = "/";
        }}
        className="mb-4 px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-center text-gray-800">
        SuperAdmin Dashboard
      </h1>

      <div className="flex justify-center gap-4">
        {["attendance", "expense", "donation"].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-md transition font-semibold ${
              activeSection === section
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>

      {activeSection === "attendance" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-700">
            Add Attendance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              className="border px-3 py-2 rounded"
              value={attendanceData.year}
              onChange={(e) => handleMonthYearChange("year", e.target.value)}
            >
              {[...Array(10)].map((_, i) => {
                const y = new Date().getFullYear() - 5 + i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>

            <select
              className="border px-3 py-2 rounded"
              value={attendanceData.month}
              onChange={(e) => handleMonthYearChange("month", e.target.value)}
            >
              {monthNames.map((month) => (
                <option key={month}>{month}</option>
              ))}
            </select>

            <select
              className="border px-3 py-2 rounded"
              value={attendanceData.day}
              onChange={(e) =>
                setAttendanceData({ ...attendanceData, day: e.target.value })
              }
            >
              {Array.from({
                length: daysInMonth(
                  monthNames.indexOf(attendanceData.month) + 1,
                  attendanceData.year
                ),
              }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 items-center">
            <input
              readOnly
              type="text"
              placeholder="Selected Roll Numbers"
              className="border px-3 py-2 rounded w-full"
              value={Object.keys(attendanceData.attendance).join(", ")}
            />
            <button
              onClick={() => setShowRollNumberPopup(true)}
              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              +
            </button>
          </div>

          {showRollNumberPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white w-[90%] max-w-md rounded-lg p-5 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Select Roll Numbers</h3>
                  <button
                    onClick={() => setShowRollNumberPopup(false)}
                    className="text-red-500 hover:underline"
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                  {availableRollNumbers.map((rollNo) => (
                    <button
                      key={rollNo}
                      onClick={() => handleRollNoClick(rollNo)}
                      className={`px-2 py-1 border rounded text-sm ${
                        attendanceData.attendance[rollNo]
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {rollNo}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={addAttendance}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add Attendance
          </button>
        </div>
      )}

      {activeSection === "expense" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-700">Add Expense</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              className="border px-3 py-2 rounded"
              value={expenseData.year}
              onChange={(e) =>
                setExpenseData({ ...expenseData, year: e.target.value })
              }
            >
              {[...Array(10)].map((_, i) => {
                const y = new Date().getFullYear() - 5 + i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>

            <select
              className="border px-3 py-2 rounded"
              value={expenseData.month}
              onChange={(e) =>
                setExpenseData({ ...expenseData, month: e.target.value })
              }
            >
              {monthNames.map((month) => (
                <option key={month}>{month}</option>
              ))}
            </select>
          </div>

          <input
            type="number"
            placeholder="Enter Amount"
            className="border px-3 py-2 rounded w-full"
            value={expenseData.amount}
            onChange={(e) =>
              setExpenseData({ ...expenseData, amount: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Enter Description"
            className="border px-3 py-2 rounded w-full"
            value={expenseData.description}
            onChange={(e) =>
              setExpenseData({ ...expenseData, description: e.target.value })
            }
          />

          <button
            onClick={addExpense}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add Expense
          </button>
        </div>
      )}

      {activeSection === "donation" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-700">Add Donation</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              className="border px-3 py-2 rounded"
              value={donationData.year}
              onChange={(e) =>
                setDonationData({ ...donationData, year: e.target.value })
              }
            >
              {[...Array(10)].map((_, i) => {
                const y = new Date().getFullYear() - 5 + i;
                return <option key={y}>{y}</option>;
              })}
            </select>

            <select
              className="border px-3 py-2 rounded"
              value={donationData.month}
              onChange={(e) =>
                setDonationData({ ...donationData, month: e.target.value })
              }
            >
              {monthNames.map((month) => (
                <option key={month}>{month}</option>
              ))}
            </select>
          </div>

          <select
            className="w-full border px-3 py-2 rounded"
            value={donationData.rollNo}
            onChange={(e) =>
              setDonationData({ ...donationData, rollNo: e.target.value })
            }
          >
            <option value="">Select Roll Number</option>
            {availableRollNumbers.map((rollNo) => (
              <option key={rollNo} value={rollNo}>
                {rollNo}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Enter Amount"
            className="border px-3 py-2 rounded w-full"
            value={donationData.amount}
            onChange={(e) =>
              setDonationData({ ...donationData, amount: e.target.value })
            }
          />

          <button
            onClick={addDonation}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add Donation
          </button>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
