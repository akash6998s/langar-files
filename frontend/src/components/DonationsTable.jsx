import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import FinanceTable from "./FinanceTable"

const DonationsTable = () => {
  const [donationData, setDonationData] = useState({});
  const [memberDetails, setMemberDetails] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [tableData, setTableData] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const tableRef = useRef();
  const [loading, setLoading] = useState(false);



  const handleDownloadPDF = () => {
    setLoading(true);
  
    const originalNode = tableRef.current;
  
    // Clone the original node
    const clone = originalNode.cloneNode(true);
  
    // Inline styles for PDF rendering
    clone.style.width = "100%";
    clone.style.border = "1px solid #f2dbb5";
    clone.style.background = "#ffffff";
    clone.style.fontSize = "14px";
  
    // Add inline styles to all table elements
    clone.querySelectorAll("table, th, td, thead, tbody, tr").forEach((el) => {
      el.style.border = "1px solid #f2dbb5";
      el.style.borderCollapse = "collapse";
      el.style.padding = "8px";
      el.style.color = "#4b1c0d";
      el.style.fontFamily = "sans-serif";
      el.style.backgroundColor = "#fff";
    });
  
    // Add background to header manually
    clone.querySelectorAll("thead tr").forEach((el) => {
      el.style.backgroundColor = "#fff1d0";
      el.style.fontWeight = "bold";
    });
  
    // Add a wrapper in the body to render off-screen
    const hiddenContainer = document.createElement("div");
    hiddenContainer.style.position = "fixed";
    hiddenContainer.style.top = "-10000px";
    hiddenContainer.appendChild(clone);
    document.body.appendChild(hiddenContainer);
  
    const opt = {
      margin: 0.5,
      filename: "donations.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };
  
    html2pdf()
      .set(opt)
      .from(clone)
      .save()
      .then(() => {
        document.body.removeChild(hiddenContainer);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };
  


  // const handleDownloadPDF = async () => {
  //   setLoading(true);
  
  //   const input = tableRef.current;
  //   const originalHeight = input.style.height;
  //   const originalOverflow = input.style.overflow;
  
  //   input.style.height = "auto";
  //   input.style.overflow = "visible";
  
  //   await new Promise((resolve) => setTimeout(resolve, 500));
  
  //   const canvas = await html2canvas(input, {
  //     scale: 2,
  //     useCORS: true,
  //     scrollY: -window.scrollY,
  //   });
  
  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF("p", "mm", "a4");
  
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = pdf.internal.pageSize.getHeight();
  
  //   const imgWidth = canvas.width;
  //   const imgHeight = canvas.height;
  
  //   const ratio = pdfWidth / imgWidth;
  //   const scaledHeight = imgHeight * ratio;
  
  //   let position = 0;
  //   let pageHeight = pdfHeight * (canvas.height / scaledHeight);
  
  //   while (position < canvas.height) {
  //     const canvasPage = document.createElement("canvas");
  //     canvasPage.width = canvas.width;
  //     canvasPage.height = Math.min(pageHeight, canvas.height - position);
  
  //     const ctx = canvasPage.getContext("2d");
  //     ctx.drawImage(
  //       canvas,
  //       0,
  //       position,
  //       canvas.width,
  //       canvasPage.height,
  //       0,
  //       0,
  //       canvas.width,
  //       canvasPage.height
  //     );
  
  //     const pageData = canvasPage.toDataURL("image/png");
  //     if (position !== 0) pdf.addPage();
  //     pdf.addImage(pageData, "PNG", 0, 0, pdfWidth, (canvasPage.height * pdfWidth) / canvas.width);
  
  //     position += pageHeight;
  //   }
  
  //   input.style.height = originalHeight;
  //   input.style.overflow = originalOverflow;
  
  //   pdf.save("donations.pdf");
  //   setLoading(false);
  // };
  

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
          phone_no: member.phone_no,
          amount: donation,
          fine: fine,
        };
      });

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
      {loading && (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-indigo-100 via-orange-200 to-white">
          <div className="flex flex-col items-center space-y-6">
            {/* Spinner with a soft color */}
            <div className="w-16 h-16 border-8 border-solid border-transparent border-t-orange-600 rounded-full animate-spin"></div>

            {/* Spiritual Text with 'Jai Gurudev' */}
            <div className="text-orange-700 font-semibold text-2xl">
              Loading
            </div>
          </div>
        </div>
      )}
      <div className="px-2 py-8 bg-[#fff7eb] min-h-screen">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-[#4b1c0d] mb-6 underline underline-offset-8 decoration-[#e3b04b]">
          सेवक दान विवरण
        </h2>

        {/* Year & Month Selectors */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setSelectedMonth("");
              setTableData([]);
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#fff3d1] to-[#fce5b5] text-[#5c2d06] font-medium shadow-md border border-[#e3b04b] focus:outline-none focus:ring-2 focus:ring-[#e3b04b] w-full sm:w-52"
          >
            <option value="">वर्ष चुनें</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            disabled={!selectedYear}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#fff3d1] to-[#fce5b5] text-[#5c2d06] font-medium shadow-md border border-[#e3b04b] focus:outline-none focus:ring-2 focus:ring-[#e3b04b] w-full sm:w-52"
          >
            <option value="">माह चुनें</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        {tableData.length > 0 && (
          <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 flex-wrap w-full max-w-2xl mx-auto">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-[#4b1c0d]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="सेवक के नाम से खोजें..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-[#e3a857] rounded-md bg-[#fffaf0] text-[#4b1c0d] focus:outline-none focus:ring-2 focus:ring-[#e3a857]"
              />
            </div>
        
            {/* Download Button */}
            <button
              onClick={handleDownloadPDF}
              className="p-3 bg-[#e3b04b] text-[#4b1c0d] rounded-full shadow-md hover:bg-[#d29e3f] transition duration-300 relative group"
              title="PDF डाउनलोड करें"
            >
              <FaDownload className="text-xl" />
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#4b1c0d] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                PDF डाउनलोड करें
              </span>
            </button>
          </div>
        </div>
        
        )}
        
        {/* Table Section */}
        <div
          ref={tableRef}
          className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl border border-[#f0d8b0] overflow-hidden"
        >
          {/* Total Donations */}
          <FinanceTable/>
          {tableData.length > 0 && (
            <div className="text-center bg-gradient-to-r from-[#fff4da] to-[#ffe6b3] py-5 px-4 text-[#4b1c0d] text-xl font-bold border-b-2 border-[#e0b973] shadow-md">
              इस महीने की कुल राशि:{" "}
              <span className="text-[#a05a2c]">₹ {totalDonations}</span>
            </div>
          )}

          {/* Table */}
          {tableData.length > 0 ? (
            <div className="">
              <table className="w-full text-sm text-[#4b1c0d] border border-[#f2dbb5]">
                <thead className="bg-[#fff1d0] sticky top-0 z-10 text-base">
                  <tr>
                    <th className="py-3 px-1 border border-[#f2dbb5] text-center">
                      क्रम
                    </th>
                    <th className="py-3 px-1 border border-[#f2dbb5] text-left">
                      सेवक का नाम
                    </th>
                    <th className="py-3 px-1 border border-[#f2dbb5] text-center">
                      फोन नंबर
                    </th>
                    <th className="py-3 px-1 border border-[#f2dbb5] text-center min-w-[80px]">
                      राशि
                    </th>
                    {/* <th className="py-3 px-4 border border-[#f2dbb5] text-left">
                      जुर्माना
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {tableData
                    .filter((row) =>
                      row.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((row) => (
                      <tr
                        key={row.roll_no}
                        className="hover:bg-[#fff8e3] transition  duration-150"
                      >
                        <td className="py-2 px-1 border text-center border-[#f2dbb5]">
                          {row.roll_no}
                        </td>
                        <td className="py-2 px-1 border border-[#f2dbb5]">
                          {row.name}
                        </td>
                        <td className="py-2 px-1 text-center border border-[#f2dbb5]">
                          {row.phone_no}
                        </td>
                        <td className="py-2 px-1 text-center min-w-[80px] border border-[#f2dbb5] text-green-700 font-semibold">
                          ₹ {row.amount}
                        </td>
                        {/* <td className="py-2 px-4 border border-[#f2dbb5] text-red-600 font-semibold">
                          ₹ {row.fine}
                        </td> */}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-[#c97c00] py-12 italic text-lg">
              अभी कोई दान जानकारी उपलब्ध नहीं है।
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default DonationsTable;
