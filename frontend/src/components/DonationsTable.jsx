import React, { useEffect, useState } from 'react';

const DonationsTable = () => {
  const [donationData, setDonationData] = useState({});
  const [memberDetails, setMemberDetails] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [tableData, setTableData] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Fetch donation and member data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donationRes, memberRes] = await Promise.all([
          fetch('https://langar-db-csvv.onrender.com/donations'),
          fetch('https://langar-db-csvv.onrender.com/member-full-details')
        ]);

        const donationJson = await donationRes.json();
        const memberJson = await memberRes.json();

        setDonationData(donationJson);
        setMemberDetails(memberJson);

        const now = new Date();
        const currYear = String(now.getFullYear());
        const currMonth = monthNames[now.getMonth()];

        // Set default selected year/month
        if (donationJson[currYear]?.[currMonth]) {
          setSelectedYear(currYear);
          setSelectedMonth(currMonth);
        } else {
          const firstYear = Object.keys(donationJson)[0] || '';
          const firstMonth = donationJson[firstYear]
            ? Object.keys(donationJson[firstYear])[0]
            : '';
          setSelectedYear(firstYear);
          setSelectedMonth(firstMonth);
        }
      } catch (error) {
        console.error('Error fetching donation data:', error);
      }
    };

    fetchData();
  }, []);

  // Update table when year/month/member data changes
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      const monthData = donationData[selectedYear]?.[selectedMonth] || {};
      const data = memberDetails.map((member, index) => ({
        roll_no: index + 1,
        name: `${member.name} ${member.last_name}`,
        amount: monthData[index + 1] || 0
      }));

      const total = data.reduce((sum, item) => sum + item.amount, 0);
      setTableData(data);
      setTotalDonations(total);
    }
  }, [donationData, memberDetails, selectedYear, selectedMonth]);

  const years = Object.keys(donationData);
  const months = selectedYear ? Object.keys(donationData[selectedYear]) : [];

  return (
    <div className="bg-gradient-to-tr from-[#fffaf0] via-[#fdf4e3] to-[#fffaf0] min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-4 border border-[#f1d9a7]">
        <h2 className="text-4xl font-bold text-[#6b2400] text-center mb-10 tracking-wide">
          मासिक दान सूची
        </h2>

        {/* Selectors */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
  {/* Year Selector */}
  <select
    value={selectedYear}
    onChange={(e) => {
      setSelectedYear(e.target.value);
      setSelectedMonth('');
      setTableData([]);
    }}
    className="w-full sm:w-48 py-2 bg-[#fff9ec] border border-[#e3b04b] rounded-lg text-[#6b2400] shadow-sm focus:ring-2 focus:ring-[#e3b04b]"
  >
    <option value="">वर्ष चुनें (Select Year)</option>
    {years.map((year) => (
      <option key={year} value={year}>{year}</option>
    ))}
  </select>

  {/* Month Selector */}
  <select
    value={selectedMonth}
    onChange={(e) => setSelectedMonth(e.target.value)}
    disabled={!selectedYear}
    className="w-full sm:w-48 py-2 bg-[#fff9ec] border border-[#e3b04b] rounded-lg text-[#6b2400] shadow-sm focus:ring-2 focus:ring-[#e3b04b]"
  >
    <option value="">माह चुनें (Select Month)</option>
    {months.map((month) => (
      <option key={month} value={month}>{month}</option>
    ))}
  </select>
</div>


        {/* Total Donations Display */}
        {tableData.length > 0 && (
          <div className="text-center mb-8">
            <span className="text-xl font-bold text-green-800 bg-green-100 px-6 py-2 rounded-full shadow-sm">
              कुल दान राशि: ₹ {totalDonations}
            </span>
          </div>
        )}

        {/* Donations Table */}
        {tableData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-[#fdf0c2] text-[#6b2400]">
                <tr>
                  <th className="py-3 px-6 text-left border border-[#e3b04b]">क्रम</th>
                  <th className="py-3 px-6 text-left border border-[#e3b04b]">सेवक का नाम</th>
                  <th className="py-3 px-6 text-left border border-[#e3b04b]">दान राशि</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {tableData.map((row) => (
                  <tr key={row.roll_no} className="hover:bg-[#fff6d0] transition-all">
                    <td className="py-2 px-2 border border-[#f7e9bb]">{row.roll_no}</td>
                    <td className="py-2 px-2 border border-[#f7e9bb]">{row.name}</td>
                    <td className="py-2 px-2 border border-[#f7e9bb] font-semibold text-green-700">
                      ₹ {row.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-[#b58700] mt-10 italic">
            अभी कोई दान जानकारी उपलब्ध नहीं है।
          </p>
        )}
      </div>
    </div>
  );
};

export default DonationsTable;
