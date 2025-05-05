import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import credentials from "../data/admin.json";
import { useNavigate } from "react-router-dom";

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
  const inputRef = useRef(null);
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

  const [removeMember, setRemoveMember] = useState({
    rollNo: "",
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

  const sections = [
    { key: "attendance", label: "Add Attendance" },
    { key: "deleteAttendance", label: "Remove Attendance" },
    { key: "expense", label: "Add Expense" },
    { key: "donation", label: "Add Donation" },
    { key: "addMember", label: "Add Member" },
    { key: "deleteMember", label: "Remove Member" },
  ];
  const [rollNumbers, setRollNumbers] = useState([]);
  useEffect(() => {
    const fetchRollNumbers = async () => {
      try {
        const response = await axios.get(
          "https://langar-db-csvv.onrender.com/empty-rollno"
        );
        setRollNumbers(response.data);
      } catch (error) {
        console.error("Error fetching roll numbers:", error);
      }
    };

    fetchRollNumbers();
  }, []);

  const [addMemberData, setAddMemberData] = useState({
    roll_no: "",
    name: "",
    last_name: "",
    phone_no: "",
    address: "",
    isAdmin: false,
  });

  // Handle form input changes
  const handleMemberData = (e) => {
    const { name, value } = e.target;
    setAddMemberData({
      ...addMemberData,
      [name]: value,
    });
  };

  const handleIsAdminCheckbox = () => {
    setAddMemberData({
      ...addMemberData,
      isAdmin: !addMemberData.isAdmin,
    });
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://langar-db-csvv.onrender.com/add-member",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addMemberData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add member");
        throw new Error(data.message || "Failed to add member");
      }

      console.log("Member added successfully:", data);
      alert("Member added successfully!");

      // ✅ Reset form fields
      setAddMemberData({
        roll_no: "",
        name: "",
        last_name: "",
        phone_no: "",
        address: "",
        isAdmin: false,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchRollNumbers = async () => {
      try {
        const res = await fetch(
          "https://langar-db-csvv.onrender.com/member-full-details"
        );
        const data = await res.json();
        setAvailableRollNumbers(data.map((m) => m.roll_no));
      } catch (err) {
        console.error("Failed to fetch roll numbers:", err);
      }
    };
    fetchRollNumbers();
  }, []);

  const navigate = useNavigate(); // Call at the top level

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Trigger prompt message
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const superAdminId = sessionStorage.getItem("superAdminId");
    const superAdminPassword = sessionStorage.getItem("superAdminPassword");

    const isAuthorized =
      superAdminId === credentials.superAdmin_login.id &&
      superAdminPassword === credentials.superAdmin_login.password;

    if (!isAuthorized) {
      navigate("/"); // Redirect if not authorized
    }
  }, [navigate]);

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

    // Set input value and copy to clipboard
    if (inputRef.current) {
      inputRef.current.value = filtered.join(", ");
      navigator.clipboard
        .writeText(inputRef.current.value)
        .then(() => console.log("Copied to clipboard"))
        .catch((err) => console.error("Clipboard copy failed", err));
    }

    try {
      const res = await axios.post(
        "https://langar-db-csvv.onrender.com/update-attendance",
        {
          attendance: filtered,
          month,
          year: Number(year),
          day: Number(day),
        }
      );
      alert(res.data.message);
      setAttendanceData((prev) => ({ ...prev, attendance: {} }));
    } catch (err) {
      console.error("Error adding attendance:", err);
      alert("Failed to add attendance.");
    }
  };

  const deleteAttendance = async () => {
    const { attendance, month, year, day } = attendanceData;
    const filtered = Object.keys(attendance).filter((r) => attendance[r]);
    if (filtered.length === 0) return alert("No roll numbers selected.");
    try {
      const res = await axios.post(
        "https://langar-db-csvv.onrender.com/delete-attendance", // Ensure backend route exists
        { attendance: filtered, month, year: Number(year), day: Number(day) }
      );
      alert(res.data.message);
      setAttendanceData((prev) => ({ ...prev, attendance: {} }));
    } catch (err) {
      console.error("Error deleting attendance:", err);
      const message =
        err.response?.data?.error || "Failed to delete attendance.";
      alert(message);
    }
  };

  const addExpense = async () => {
    const { amount, description, month, year } = expenseData;
    if (!amount || !description.trim())
      return alert("Amount and Description required.");
    try {
      const res = await axios.post(
        "https://langar-db-csvv.onrender.com/add-expense",
        {
          amount: Number(amount),
          description: description.trim(),
          month,
          year: Number(year),
        }
      );
      alert(res.data.message);
      setExpenseData({ ...expenseData, amount: "", description: "" });
    } catch (err) {
      console.error("Error adding expense:", err);
      alert("Failed to add expense.");
    }
  };
  const deleteMember = async () => {
    const { rollNo } = removeMember;
    if (!rollNo) {
      alert("Please select a Roll Number.");
      return;
    }

    try {
      const res = await axios.post(
        "https://langar-db-csvv.onrender.com/delete-member",
        {
          rollNo: parseInt(rollNo), // ensure it's sent as a number
        }
      );

      alert(res.data.message);
      setRemoveMember({ rollNo: "" });
    } catch (err) {
      console.error("Error deleting member:", err);
      alert("Failed to remove member.");
    }
  };

  const addDonation = async () => {
    const { amount, rollNo, month, year } = donationData;
    if (!rollNo || !amount || !month || !year)
      return alert("All fields are required.");
    try {
      const res = await axios.post(
        "https://langar-db-csvv.onrender.com/update-donations",
        {
          rollNo,
          amount: Number(amount),
          month,
          year: Number(year),
        }
      );
      alert(res.data.message);
      setDonationData({ ...donationData, amount: "", rollNo: "" });
    } catch (err) {
      console.error("Error adding donation:", err);
      alert("Failed to add donation.");
    }
  };

  const renderSelectFields = () => (
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
          <option key={month} value={month}>
            {month}
          </option>
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
  );

  const renderRollNoPopup = () =>
    showRollNumberPopup && (
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
    );

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl space-y-10">
      <button
        onClick={() => (window.location.href = "/")}
        className="inline-block text-sm text-red-800 hover:text-red-600 font-semibold transition"
      >
        <span className="mb-2">← </span>Back to Home
      </button>

      <h1 className="text-2xl font-extrabold text-center text-orange-700">
        SuperAdmin Dashboard
      </h1>

      {/* Section Buttons */}
      <div className="flex justify-center gap-3 flex-wrap">
        {sections.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`w-40 text-center px-5 py-2 rounded-full font-medium transition duration-200 shadow-sm ${
              activeSection === key
                ? "bg-indigo-700 text-white"
                : "bg-orange-200 text-orange-900 hover:bg-orange-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Attendance & Delete Attendance Section */}
      {(activeSection === "attendance" ||
        activeSection === "deleteAttendance") && (
        <div className="bg-gray-50 p-6 rounded-xl shadow space-y-5">
          <h2 className="text-2xl font-semibold text-blue-700">
            {activeSection === "attendance"
              ? "Add Attendance"
              : "Delete Attendance"}
          </h2>

          {renderSelectFields()}

          <div className="flex gap-3 items-center">
            <input
              ref={inputRef}
              readOnly
              type="text"
              placeholder="Selected Roll Numbers"
              className="border px-4 py-2 rounded w-full bg-white shadow-sm"
              value={Object.keys(attendanceData.attendance).join(", ")}
            />
            <button
              onClick={() => setShowRollNumberPopup(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded"
            >
              +
            </button>
          </div>

          {renderRollNoPopup()}

          <button
            onClick={
              activeSection === "attendance" ? addAttendance : deleteAttendance
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            {activeSection === "attendance"
              ? "Add Attendance"
              : "Delete Attendance"}
          </button>
        </div>
      )}

      {/* Expense Section */}
      {activeSection === "expense" && (
        <div className="bg-gray-50 p-6 rounded-xl shadow space-y-5">
          <h2 className="text-2xl font-semibold text-blue-700">Add Expense</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="border px-3 py-2 rounded bg-white shadow-sm"
              value={expenseData.year}
              onChange={(e) =>
                setExpenseData({ ...expenseData, year: e.target.value })
              }
            >
              {[...Array(10)].map((_, i) => {
                const y = new Date().getFullYear() - 5 + i;
                return <option key={y}>{y}</option>;
              })}
            </select>

            <select
              className="border px-3 py-2 rounded bg-white shadow-sm"
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
            className="border px-3 py-2 rounded w-full bg-white shadow-sm"
            value={expenseData.amount}
            onChange={(e) =>
              setExpenseData({ ...expenseData, amount: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Enter Description"
            className="border px-3 py-2 rounded w-full bg-white shadow-sm"
            value={expenseData.description}
            onChange={(e) =>
              setExpenseData({ ...expenseData, description: e.target.value })
            }
          />

          <button
            onClick={addExpense}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Add Expense
          </button>
        </div>
      )}

      {/* Add Member Section */}
      {activeSection === "addMember" && (
        <div className="bg-gray-50 p-6 rounded-xl shadow space-y-5">
          <h2 className="text-2xl font-semibold text-blue-700">Add Member</h2>
          <form onSubmit={handleAddMember} className="space-y-4">
            {[
              {
                label: "Roll No",
                name: "roll_no",
                type: "select",
                options: rollNumbers,
              },
              { label: "Name", name: "name" },
              { label: "Last Name", name: "last_name" },
              { label: "Phone No", name: "phone_no" },
              { label: "Address", name: "address" },
            ].map(({ label, name, type, options }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                {type === "select" ? (
                  <select
                    name={name}
                    value={addMemberData[name]}
                    onChange={handleMemberData}
                    required={name === "roll_no"} // Only Roll No required
                    className="mt-1 block w-full p-2 border rounded bg-white shadow-sm"
                  >
                    <option value="">Select {label}</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name={name}
                    value={addMemberData[name]}
                    onChange={handleMemberData}
                    required={name === "name"} // Only Name required
                    className="mt-1 block w-full p-2 border rounded bg-white shadow-sm"
                  />
                )}
              </div>
            ))}

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={addMemberData.isAdmin}
                onChange={handleIsAdminCheckbox}
                className="mr-2"
              />
              <label className="text-sm">Is Admin</label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Add Member
            </button>
          </form>
        </div>
      )}

      {/* Delete Member */}
      {activeSection === "deleteMember" && (
        <div className="bg-gray-50 p-6 rounded-xl shadow space-y-5">
          <h2 className="text-2xl font-semibold text-blue-700">
            Remove Member
          </h2>

          <select
            className="w-full border px-3 py-2 rounded bg-white shadow-sm"
            value={removeMember.rollNo}
            onChange={(e) =>
              setRemoveMember({ ...removeMember, rollNo: e.target.value })
            }
          >
            <option value="">Select Roll Number</option>
            {availableRollNumbers.map((rollNo) => (
              <option key={rollNo} value={rollNo}>
                {rollNo}
              </option>
            ))}
          </select>

          <button
            onClick={deleteMember}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Remove Member
          </button>
        </div>
      )}

      {/* Donation Section */}
      {activeSection === "donation" && (
        <div className="bg-gray-50 p-6 rounded-xl shadow space-y-5">
          <h2 className="text-2xl font-semibold text-blue-700">Add Donation</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="border px-3 py-2 rounded bg-white shadow-sm"
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
              className="border px-3 py-2 rounded bg-white shadow-sm"
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
            className="w-full border px-3 py-2 rounded bg-white shadow-sm"
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
            className="border px-3 py-2 rounded w-full bg-white shadow-sm"
            value={donationData.amount}
            onChange={(e) =>
              setDonationData({ ...donationData, amount: e.target.value })
            }
          />

          <button
            onClick={addDonation}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Add Donation
          </button>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
