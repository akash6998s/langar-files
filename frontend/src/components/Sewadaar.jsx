import React, { useState, useEffect } from "react";

const Sewadaar = () => {
  const [sewadaars, setSewadaars] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://langar-db-csvv.onrender.com/member-full-details"
        );
        const members = await res.json();
        const formatted = members.map((s) => ({
          ...s,
          fullName: `${s.name} ${s.last_name}`.trim(),
        }));
        setSewadaars(formatted);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fffbea]">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-12 h-12 border-4 border-dashed border-[#d97706] rounded-full animate-spin"></div>
          <div className="text-[#5c4324] font-semibold text-xl">
            प्रतीक्षा करें...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffbea] px-4 py-8 font-serif">
      <button
        onClick={() => (window.location.href = "/")}
        className="p-2 rounded-full hover:bg-red-100 text-red-800 hover:text-red-600 transition"
        title="Back to Home"
      >
        {/* Heroicon: Arrow Left */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

      <h1 className="text-4xl text-center text-[#d97706] font-bold my-10  decoration-[#5c4324] underline-offset-8">
        सेवादार सूची
      </h1>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {sewadaars.map((sewadaar) => (
          <div
            key={sewadaar.roll_no}
            className="bg-white rounded-3xl p-6 shadow-md border border-[#f1d8b0] hover:shadow-xl transition-transform hover:scale-105 relative"
          >
            <div className="absolute top-3 left-3 bg-[#d97706] text-white text-xs px-3 py-1 rounded-full shadow">
              #{sewadaar.roll_no}
            </div>

            <div className="flex flex-col items-center relative">
              <div className="w-24 h-24 rounded-full border-4 border-[#d97706] shadow-inner overflow-hidden mb-4 bg-white">
                <img
                  src={`https://langar-db-csvv.onrender.com/uploads/${sewadaar.img}`}
                  alt={sewadaar.fullName}
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-lg text-[#5c4324] font-bold mb-1">
                {sewadaar.fullName}
              </h2>

              <div className="w-full text-sm text-gray-700 space-y-2 mt-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#d97706]">📞</span>
                  <span>{sewadaar.phone_no}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#d97706]">🏠</span>
                  <span>{sewadaar.address}</span>
                </div>
                {sewadaar.sewa_type && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#d97706]">🛐</span>
                    <span className="text-[#5c4324] font-medium">
                      सेवा: {sewadaar.sewa_type}
                    </span>
                  </div>
                )}
                {sewadaar.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#d97706]">📧</span>
                    <span>{sewadaar.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sewadaar;
