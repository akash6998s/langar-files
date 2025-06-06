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
    rollNo: "",
    amount: "",
    month: "",
    year: "",
    type: "", // ✅ initialize type
  });

  const [addMemberData, setAddMemberData] = useState({
    roll_no: "",
    name: "",
    last_name: "",
    phone_no: "",
    address: "",
    isAdmin: false,
    img: "", // <-- new key for filename
  });

  // State for editing member
  const [editMemberData, setEditMemberData] = useState({
    roll_no: "",
    name: "",
    last_name: "",
    phone_no: "",
    address: "",
    isAdmin: false,
  });

  const [activeSection, setActiveSection] = useState("attendance");
  const [showRollNumberPopup, setShowRollNumberPopup] = useState(false);
  const [availableRollNumbers, setAvailableRollNumbers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [members, setMembers] = useState([]);

  const sections = [
    { key: "attendance", label: "Add Attendance" },
    { key: "donation", label: "Add Donation" },
    { key: "expense", label: "Add Expense" },
    { key: "editMember", label: "Add / Edit Member" },
    { key: "deleteMember", label: "Remove Member" },
    { key: "deleteAttendance", label: "Remove Attendance" },
  ];

  // Populate edit form when roll number is selected
  useEffect(() => {
    if (editMemberData.roll_no) {
      const selected = members.find(
        (member) => member.roll_no === editMemberData.roll_no
      );
      if (selected) {
        setEditMemberData({
          roll_no: selected.roll_no,
          name: selected.name,
          last_name: selected.last_name,
          phone_no: selected.phone_no,
          address: selected.address,
          isAdmin: selected.isAdmin || false,
        });
      }
    }
  }, [editMemberData.roll_no, members]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch("http://localhost:5000/member-full-details");
        const data = await res.json();
        if (data && Array.isArray(data)) {
          setMembers(data);
        } else {
          console.error("Data is not an array or invalid structure.");
        }
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    const fetchRollNumbers = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/member-full-details");
        const data = await res.json();
        setAvailableRollNumbers(data.map((m) => m.roll_no));
      } catch (error) {
        console.error("Error fetching main data:", error);
      } finally {
        setLoading(false); // Data loading complete
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
  const handleRollNoChange = (e) => {
    const selectedRollNo = e.target.value;
    setEditMemberData({
      ...editMemberData,
      roll_no: selectedRollNo,
    });

    // Find the selected member by roll_no and update the form fields
    const selectedMember = members.find(
      (member) => member.roll_no === parseInt(selectedRollNo)
    );

    if (selectedMember) {
      setEditMemberData({
        roll_no: selectedMember.roll_no,
        name: selectedMember.name,
        last_name: selectedMember.last_name,
        phone_no: selectedMember.phone_no,
        address: selectedMember.address,
        isAdmin: selectedMember.isAdmin,
      });
    }
  };

  // Handle input change for form fields
  const handleEditMemberData = (e) => {
    const { name, value } = e.target;
    setEditMemberData({
      ...editMemberData,
      [name]: value,
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle the file upload logic (e.g., uploading the file to your server or saving it locally)
      setEditMemberData({
        ...editMemberData,
        image: file, // You can store the file or its URL
      });
    }
  };

  const handleEditMember = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append form data
    formData.append("roll_no", editMemberData.roll_no);
    formData.append("name", editMemberData.name);
    formData.append("last_name", editMemberData.last_name);
    formData.append("phone_no", editMemberData.phone_no);
    formData.append("address", editMemberData.address);
    if (editMemberData.image) {
      formData.append("image", editMemberData.image);
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/edit-member", {
        method: "POST",
        body: formData, // Send the FormData object directly
      });

      if (!response.ok) {
        throw new Error("Failed to update member");
      }

      const result = await response.json();

      // Show modal with backend message or fallback
      setModalMessage(result.message || "Member updated successfully!");
      setShowModal(true);
    } catch (error) {
      console.error("Error updating member:", error);
      const message =
        error.response?.data?.error ||
        "Failed to update member. Please try again.";
      setModalMessage(message);
      setShowModal(true);
    } finally {
      setLoading(false); // This ensures the loader stops in both success and error cases
    }
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

    if (filtered.length === 0) {
      setModalMessage("No roll numbers selected.");
      setShowModal(true);
      return;
    }

    // Set input value and copy to clipboard
    if (inputRef.current) {
      inputRef.current.value = filtered.join(", ");
      navigator.clipboard
        .writeText(inputRef.current.value)
        .then(() => console.log("Copied to clipboard"))
        .catch((err) => console.error("Clipboard copy failed", err));
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/update-attendance", {
        attendance: filtered,
        month,
        year: Number(year),
        day: Number(day),
      });

      setModalMessage(res.data.message || "Attendance updated successfully!");
      setShowModal(true);

      setAttendanceData((prev) => ({ ...prev, attendance: {} }));
    } catch (error) {
      console.error("Error submitting attendance:", error);
      setModalMessage("Failed to update attendance. Please try again.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteAttendance = async () => {
    const { attendance, month, year, day } = attendanceData;
    const filtered = Object.keys(attendance).filter((r) => attendance[r]);

    if (filtered.length === 0) {
      setModalMessage("No roll numbers selected.");
      setShowModal(true);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/delete-attendance", {
        attendance: filtered,
        month,
        year: Number(year),
        day: Number(day),
      });

      setModalMessage(res.data.message || "Attendance deleted successfully!");
      setShowModal(true);
      setAttendanceData((prev) => ({ ...prev, attendance: {} }));
    } catch (error) {
      console.error("Error deleting attendance:", error);
      const message =
        error.response?.data?.error || "Failed to delete attendance.";
      setModalMessage(message);
      setShowModal(true);
      setLoading(false);
    }
  };

  const addExpense = async () => {
    const { amount, description, month, year } = expenseData;

    if (!amount || !description.trim()) {
      setModalMessage("Amount and Description are required.");
      setShowModal(true);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/add-expense", {
        amount: Number(amount),
        description: description.trim(),
        month,
        year: Number(year),
      });

      setModalMessage(res.data.message || "Expense added successfully!");
      setShowModal(true);

      setExpenseData({ ...expenseData, amount: "", description: "" });
    } catch (error) {
      console.error("Error adding expense:", error);
      setModalMessage("Failed to add expense. Please try again.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async () => {
    const { rollNo } = removeMember;

    if (!rollNo) {
      setModalMessage("Please select a Roll Number.");
      setShowModal(true);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/delete-member", {
        rollNo: parseInt(rollNo),
      });

      setModalMessage(res.data.message || "Member deleted successfully!");
      setShowModal(true);
      setRemoveMember({ rollNo: "" });
    } catch (error) {
      console.error("Error deleting member:", error);
      setModalMessage("Failed to delete member. Please try again.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const addDonation = async () => {
    const { amount, rollNo, month, year, type } = donationData;

    if (!rollNo || !amount || !month || !year || !type) {
      setModalMessage("All fields are required.");
      setShowModal(true);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/update-donations", {
        rollNo,
        amount: Number(amount),
        month,
        year: Number(year),
        type,
      });

      setModalMessage(res.data.message || "Donation added successfully!");
      setShowModal(true);
      setDonationData({ ...donationData, amount: "", rollNo: "", type: "" });
    } catch (error) {
      console.error("Error adding donation:", error);
      setModalMessage("Failed to add donation. Please try again.");
      setShowModal(true);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-indigo-100 via-orange-200 to-white">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 border-8 border-solid border-transparent border-t-orange-600 rounded-full animate-spin"></div>
          <div className="text-orange-700 font-semibold text-2xl">Loading</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl space-y-10">
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <p className="text-gray-800">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

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
      <div className="w-full overflow-x-auto">
        <div className="flex gap-4 px-4 py-3 min-w-max">
          {sections.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full font-medium transition-all duration-300 border
          ${
            activeSection === key
              ? "bg-[#d97706] text-white border-[#b45309] shadow-md"
              : "bg-[#fef3c7] text-[#78350f] border-[#fcd34d] hover:bg-[#fde68a] hover:border-[#fbbf24]"
          }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Attendance & Delete Attendance Section */}
      {(activeSection === "attendance" ||
        activeSection === "deleteAttendance") && (
        <div className="bg-[#fff9f0] p-6 rounded-2xl shadow-lg space-y-6 border border-[#fcd34d]">
          <h2 className="text-2xl font-semibold text-[#9a3412]">
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
              className="border border-yellow-300 px-4 py-2 rounded w-full bg-[#fffefc] shadow-sm text-[#92400e] placeholder-[#b45309]"
              value={Object.keys(attendanceData.attendance).join(", ")}
            />
            <button
              onClick={() => setShowRollNumberPopup(true)}
              className="px-4 py-2 bg-[#65a30d] hover:bg-[#4d7c0f] text-white font-medium rounded shadow"
            >
              +
            </button>
          </div>

          {renderRollNoPopup()}

          <button
            onClick={
              activeSection === "attendance" ? addAttendance : deleteAttendance
            }
            className="w-full bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#ca8a04] hover:to-[#92400e] text-white font-semibold py-2 rounded-lg transition shadow-md"
          >
            {activeSection === "attendance"
              ? "Add Attendance"
              : "Delete Attendance"}
          </button>
        </div>
      )}

      {/* Expense Section */}
      {activeSection === "expense" && (
        <div className="bg-[#fffaf0] p-6 rounded-2xl shadow-xl space-y-6 border border-[#fde68a]">
          <h2 className="text-2xl font-semibold text-[#9a3412]">Add Expense</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="border border-yellow-300 px-3 py-2 rounded bg-[#fffefc] shadow-sm text-[#78350f]"
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
              className="border border-yellow-300 px-3 py-2 rounded bg-[#fffefc] shadow-sm text-[#78350f]"
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
            className="border border-yellow-300 px-3 py-2 rounded w-full bg-[#fffefc] shadow-sm text-[#92400e] placeholder-[#b45309]"
            value={expenseData.amount}
            onChange={(e) =>
              setExpenseData({ ...expenseData, amount: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Enter Description"
            className="border border-yellow-300 px-3 py-2 rounded w-full bg-[#fffefc] shadow-sm text-[#92400e] placeholder-[#b45309]"
            value={expenseData.description}
            onChange={(e) =>
              setExpenseData({ ...expenseData, description: e.target.value })
            }
          />

          <button
            onClick={addExpense}
            className="w-full bg-gradient-to-r from-[#d97706] to-[#92400e] hover:from-[#fbbf24] hover:to-[#78350f] text-white font-semibold py-2 rounded-lg shadow transition"
          >
            Add Expense
          </button>
        </div>
      )}

      {/* Add Member Section */}
      {activeSection === "editMember" && (
        <div className="bg-[#fffaf0] p-6 rounded-2xl shadow-xl space-y-6 border border-[#fde68a]">
          <h2 className="text-2xl font-semibold text-[#9a3412]">Add / Edit Member</h2>

          <form onSubmit={handleEditMember} className="space-y-5">
            {/* Select Roll Number */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#78350f] mb-1">
                Select Roll No
              </label>
              <select
                name="roll_no"
                value={editMemberData.roll_no}
                onChange={handleRollNoChange}
                className="block w-full px-4 py-2 border border-yellow-300 rounded bg-[#fffdf8] shadow-sm text-[#78350f]"
                required
              >
                <option value="">--Select Roll No--</option>
                {Array.isArray(members) && members.length > 0 ? (
                  <>
                    {members.map((member) => (
                      <option key={member.roll_no} value={member.roll_no}>
                        {member.roll_no}
                      </option>
                    ))}
                    <option value={members.length + 1}>
                      {members.length + 1}
                    </option>
                  </>
                ) : (
                  <option value="1">Add New Roll No: 1</option>
                )}
              </select>
            </div>

            {/* Input fields */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#78350f] mb-1">
                First Name
              </label>
              <input
                type="text"
                name="name"
                value={editMemberData.name}
                onChange={handleEditMemberData}
                className="block w-full px-4 py-2 border border-yellow-300 rounded bg-[#fffdf8] shadow-sm text-[#78350f] placeholder-[#b45309]"
                required
                placeholder="Enter First Name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#78350f] mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={editMemberData.last_name}
                onChange={handleEditMemberData}
                className="block w-full px-4 py-2 border border-yellow-300 rounded bg-[#fffdf8] shadow-sm text-[#78350f] placeholder-[#b45309]"
                placeholder="Enter Last Name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#78350f] mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone_no"
                value={editMemberData.phone_no}
                onChange={handleEditMemberData}
                className="block w-full px-4 py-2 border border-yellow-300 rounded bg-[#fffdf8] shadow-sm text-[#78350f] placeholder-[#b45309]"
                required
                placeholder="Enter Phone Number"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#78350f] mb-1">
                Address
              </label>
              <input
                name="address"
                value={editMemberData.address}
                onChange={handleEditMemberData}
                className="block w-full px-4 py-2 border border-yellow-300 rounded bg-[#fffdf8] shadow-sm text-[#78350f] placeholder-[#b45309]"
                required
                placeholder="Enter Address"
              />
            </div>

            {/* Upload Image Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#78350f] mb-1">
                Upload Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleImageUpload}
                className="block w-full px-4 py-2 border border-yellow-300 rounded bg-[#fffdf8] shadow-sm text-[#78350f]"
                accept="image/*"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#d97706] to-[#92400e] hover:from-[#fbbf24] hover:to-[#78350f] text-white font-semibold py-2 rounded-lg shadow transition"
            >
              Update Member
            </button>
          </form>
        </div>
      )}

      {/* Delete Member */}
      {activeSection === "deleteMember" && (
        <div className="bg-[#fff8e1] p-6 rounded-2xl shadow-xl space-y-6 border border-[#fcd34d]">
          <h2 className="text-2xl font-semibold text-[#9a3412]">
            Remove Member
          </h2>

          <select
            className="w-full px-4 py-2 border border-yellow-300 rounded bg-[#fffdf8] shadow-sm text-[#78350f] focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
            className="w-full bg-gradient-to-r from-[#dc2626] to-[#7f1d1d] hover:from-[#ef4444] hover:to-[#991b1b] text-white font-semibold py-2 rounded-lg shadow transition"
          >
            Remove Member
          </button>
        </div>
      )}

      {/* Donation Section */}
      {activeSection === "donation" && (
        <div className="bg-[#fff7e6] p-6 rounded-2xl shadow-xl space-y-6 border border-[#fcd34d]">
          <h2 className="text-2xl font-semibold text-[#9a3412]">
            Add Donation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="border px-4 py-2 rounded bg-[#fffdf8] shadow-sm text-[#6b4226] focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
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
              className="border px-4 py-2 rounded bg-[#fffdf8] shadow-sm text-[#6b4226] focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
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
            className="w-full border px-4 py-2 rounded bg-[#fffdf8] shadow-sm text-[#6b4226] focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
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
            className="border px-4 py-2 rounded w-full bg-[#fffdf8] shadow-sm text-[#6b4226] focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
            value={donationData.amount}
            onChange={(e) =>
              setDonationData({ ...donationData, amount: e.target.value })
            }
          />

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="donation"
                name="type"
                checked={donationData.type === "donation"}
                onChange={() =>
                  setDonationData({ ...donationData, type: "donation" })
                }
                className="h-6 w-6 text-[#d97706] border-gray-300 rounded-full focus:ring-[#d97706] transition duration-200"
              />
              <label htmlFor="donation" className="text-sm text-[#6b4226]">
                Donation
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="fine"
                name="type"
                checked={donationData.type === "fine"}
                onChange={() =>
                  setDonationData({ ...donationData, type: "fine" })
                }
                className="h-6 w-6 text-[#f44336] border-gray-300 rounded-full focus:ring-[#f44336] transition duration-200"
              />
              <label htmlFor="fine" className="text-sm text-[#6b4226]">
                Fine
              </label>
            </div>
          </div>

          <button
            onClick={addDonation}
            className="w-full bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#ca8a04] hover:to-[#92400e] text-white font-semibold py-2 rounded-lg transition shadow-md"
            disabled={!donationData.type} // Disable button if no type is selected
          >
            Add Donation
          </button>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
