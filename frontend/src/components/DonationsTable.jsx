import React, { useEffect, useState } from "react";

const DonationsTable = () => {
  const [donationData, setDonationData] = useState({});
  const [memberDetails, setMemberDetails] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [tableData, setTableData] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donationRes, memberRes] = await Promise.all([
          fetch("https://langar-db-csvv.onrender.com/donations"),
          fetch("https://langar-db-csvv.onrender.com/member-full-details"),
        ]);

        const donationJson = await donationRes.json();
        const memberJson = await memberRes.json();

        setDonationData(donationJson);
        setMemberDetails(memberJson);

        const now = new Date();
        const currYear = String(now.getFullYear());
        const currMonth = monthNames[now.getMonth()];

        if (donationJson[currYear]?.[currMonth]) {
          setSelectedYear(currYear);
          setSelectedMonth(currMonth);
        } else {
          const firstYear = Object.keys(donationJson)[0] || "";
          const firstMonth = donationJson[firstYear]
            ? Object.keys(donationJson[firstYear])[0]
            : "";
          setSelectedYear(firstYear);
          setSelectedMonth(firstMonth);
        }
      } catch (error) {
        console.error("Error fetching donation data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      const monthData = donationData[selectedYear]?.[selectedMonth] || {};
      const data = memberDetails.map((member, index) => {
        const entry = monthData[index + 1] || 0;
        let donation = 0;
        let fine = 0;

        if (typeof entry === "object") {
          donation = entry.donation || 0;
          fine = entry.fine || 0;
        } else {
          donation = entry;
        }

        return {
          roll_no: index + 1,
          name: `${member.name} ${member.last_name}`,
          amount: donation,
          fine: fine,
        };
      });

      // Calculate total donations including fines
      const total = data.reduce(
        (sum, item) => sum + item.amount + item.fine,
        0
      );
      setTableData(data);
      setTotalDonations(total);
    }
  }, [donationData, memberDetails, selectedYear, selectedMonth]);

  const years = Object.keys(donationData);
  const months = selectedYear ? Object.keys(donationData[selectedYear]) : [];

  return (
    <>
      {/* Selectors */}
      <div className="flex justify-center gap-2 mb-6 flex-nowrap overflow-x-auto">
        {/* Year Selector */}
        <select
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            setSelectedMonth("");
            setTableData([]);
          }}
          className="px-5 py-3 border border-[#e3b04b] rounded-lg bg-[#fff9ec] text-[#5c2d06] shadow focus:outline-none focus:ring-2 focus:ring-[#e3b04b] w-full sm:w-52 transition-all duration-200"
        >
          <option value="">वर्ष चुनें</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Month Selector */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          disabled={!selectedYear}
          className="px-5 py-3 border border-[#e3b04b] rounded-lg bg-[#fff9ec] text-[#5c2d06] shadow focus:outline-none focus:ring-2 focus:ring-[#e3b04b] w-full sm:w-52 transition-all duration-200"
        >
          <option value="">माह चुनें</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <div className="rounded-3xl bg-gradient-to-tr from-[#fffaf0] via-[#fef4dd] to-[#fffaf0]">
        <div className="max-w-6xl overflow-hidden mx-auto bg-white rounded-3xl shadow-xl border border-[#e8c98e]">
          {/* Total Donations */}
          {tableData.length > 0 && (
            <div className="text-center w-100">
              <div className="text-xl font-semibold text-green-900 bg-green-100 px-8 py-3 shadow-sm border border-green-300">
                इस महीने की राशि: ₹ {totalDonations}
              </div>
            </div>
          )}

          {/* Donations Table */}
          {tableData.length > 0 ? (
            <div className="overflow-x-auto overflow-y-auto max-h-[500px] shadow-lg rounded-lg bg-white">
              <table className="w-full text-sm text-center border border-gray-300 bg-white rounded-lg">
                <thead className="bg-[#fff4d3] text-[#6b3c00] text-[17px] tracking-wide sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-3 border border-[#f0d28a] text-left">
                      क्रम
                    </th>
                    <th className="py-3 px-5 border border-[#f0d28a] text-left">
                      सेवक का नाम
                    </th>
                    <th className="py-3 px-3 border border-[#f0d28a] text-left">
                      दान राशि
                    </th>
                    <th className="py-3 px-3 border border-[#f0d28a] text-left">
                      जुर्माना
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[#4b3200] font-medium">
                  {tableData.map((row) => (
                    <tr
                      key={row.roll_no}
                      className="hover:bg-[#fff8e7] transition-all duration-200"
                    >
                      <td className="py-2 px-3 border border-[#f5e2b0]">
                        {row.roll_no}
                      </td>
                      <td className="py-2 px-5 border border-[#f5e2b0]">
                        {row.name}
                      </td>
                      <td className="py-2 px-3 border border-[#f5e2b0] text-green-800 font-semibold">
                        ₹ {row.amount}
                      </td>
                      <td className="py-2 px-3 border border-[#f5e2b0] text-red-600 font-semibold">
                        ₹ {row.fine}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-[#a87400] mt-12 italic text-lg">
              अभी कोई दान जानकारी उपलब्ध नहीं है।
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default DonationsTable;
