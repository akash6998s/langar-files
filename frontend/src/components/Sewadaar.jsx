import React, { useState, useEffect } from "react";

const Sewadaar = () => {
  const [sewadaars, setSewadaars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://langar-db-csvv.onrender.com/member-full-details");
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-white">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-t-yellow-500 border-b-orange-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-yellow-800 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-white px-4 py-8 font-serif">
      <button
        onClick={() => (window.location.href = "/")}
        className="inline-block text-sm text-red-800 hover:text-red-600 font-semibold transition"
      >
        <span className="mb-2">← </span>Back to Home
      </button>
      <h1 className="text-4xl text-center text-orange-900 font-bold my-8 tracking-wide decoration-yellow-500 underline-offset-8">
        सेवादार सूची
      </h1>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {sewadaars.map((sewadaar) => (
          <div
            key={sewadaar.roll_no}
            className="bg-white relative rounded-3xl p-6 shadow-xl border border-orange-200 transition-transform hover:scale-[1.02] hover:shadow-2xl overflow-hidden"
          >
            {/* Roll Number Badge */}
            <div className="absolute top-3 left-3 bg-orange-400 text-white font-bold px-3 py-1 rounded-full shadow-sm z-20">
              {sewadaar.roll_no}
            </div>

            {/* Halo Behind Image */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-100 via-orange-50 to-white blur-2xl z-0" />

            <div className="flex flex-col items-center z-10 relative">
              {/* Profile Frame */}
              <div className="w-28 h-28 rounded-full border-4 border-orange-400 ring ring-yellow-300 shadow-md overflow-hidden mb-4 bg-white">
                <img
                  src={`https://langar-db-csvv.onrender.com/uploads/${sewadaar.img}`}
                  alt={sewadaar.fullName}
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-xl text-orange-800 font-bold tracking-wide mb-1">
                {sewadaar.fullName}
              </h2>

              <div className="w-full text-sm text-gray-700 space-y-2 mt-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-orange-600">📞</span>
                  <span>{sewadaar.phone_no}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-600">🏠</span>
                  <span>{sewadaar.address}</span>
                </div>
                {sewadaar.sewa_type && (
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600">🛐</span>
                    <span className="text-orange-700 font-medium">
                      सेवा: {sewadaar.sewa_type}
                    </span>
                  </div>
                )}
                {sewadaar.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600">📧</span>
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
