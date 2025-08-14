import React, { useState, useEffect } from "react";
import { FaTrash, FaEye, FaSignOutAlt, FaUndo, FaSearch } from "react-icons/fa";
import {
  getAllApplications,
  archiveApplication,
  getAllArchivedApplications, // We'll add this in helper.js
  restoreApplication          // We'll add this in helper.js
} from "../firebase/helpers/firestoreHelpers";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [applicants, setApplicants] = useState([]);
  const [archivedApplicants, setArchivedApplicants] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [formData, setFormData] = useState({});
  const [name, setName] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  const fetchData = async () => {
    try {
      const email = localStorage.getItem("adminId");
      setName(email);

      const [activeData, archivedData] = await Promise.all([
        getAllApplications(),
        getAllArchivedApplications()
      ]);

      setApplicants(activeData || []);
      setArchivedApplicants(archivedData || []);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);


  const filteredApplicants = applicants.filter((a) => {
  const name = `${a.firstName || ""} ${a.lastName || ""}`.trim();
  const email = a.email || "";
  
  return (
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );
});

const filteredArchived = archivedApplicants.filter((a) => {
  const name = `${a.firstName || ""} ${a.lastName || ""}`.trim();
  const email = a.email || "";
  
  return (
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );
});

  const totalApplications = applicants.length;
  const todayDate = new Date().toISOString().split("T")[0];
  const todayApplications = applicants.filter(
    (a) => (a.submissionDate || a.submittedAt || "").slice(0, 10) === todayDate
  ).length;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllApplications();
        setApplicants(data);
        console.log(applicants);
      } catch (error) {
        console.error("Failed to fetch applicants:", error);
      }
    };
    fetchData();
    console.log(applicants);
  }, []);

  const openViewModal = (index, isArchived = false) => {
    setSelectedIndex(index);
    setFormData(isArchived ? archivedApplicants[index] : applicants[index]);
    setShowViewModal(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleDelete = async (index) => {
  try {
    const application = applicants[index];
    await archiveApplication(application.id);
    setApplicants((prev) => prev.filter((_, i) => i !== index));
    setArchivedApplicants((arch) => [application, ...arch]);
  } catch (error) {
    console.error("Error archiving:", error);
  }
};

  const handleRestore = async (index) => {
  try {
    const application = archivedApplicants[index];
    await restoreApplication(application.id);
    setArchivedApplicants((prev) => prev.filter((_, i) => i !== index));
    setApplicants((act) => [application, ...act]);
  } catch (error) {
    console.error("Error restoring:", error);
  }
};

  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center">
          <p className="text-xl font-medium text-gray-700">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const renderTable = (list, isArchived = false) => (
    <div className="overflow-x-auto font-[Poppins] shadow-md shadow-gray-300 border border-gray-300 rounded-xl bg-[#F6F4F9]">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-[#F6F4F9] font-[Poppins]">
          <tr>
            <th className="px-6 py-3 text-left text-base font-semibold text-gray-700 border-b-2 border-gray-300">
              S.No.
            </th>
            <th className="px-6 py-3 text-left text-base font-semibold text-gray-700 border-b-2 border-gray-300">
              Name
            </th>
            <th className="px-6 py-3 text-left text-base font-semibold text-gray-700 border-b-2 border-gray-300">
              Email
            </th>
            <th className="px-6 py-3 text-left text-base font-semibold text-gray-700 border-b-2 border-gray-300">
              Submitted On
            </th>
            <th className="px-6 py-3 text-left text-base font-semibold text-gray-700 border-b-2 border-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-gray-500">
                {isArchived
                  ? "No archived applicants."
                  : "No applications found."}
              </td>
            </tr>
          )}
          {list.map((a, index) => {
            
              (a.submittedAt || a.appliedAt || "").slice(0, 10) || "-";

            return (
              <tr
                key={index}
                className="border-b border-gray-200 last:border-none hover:bg-gray-100 transition font-[heebo]"
              >
                <td className="py-3 px-4 font-[heebo]">{index + 1}</td>
                <td className="py-3 px-4">{a.firstName} {a.lastName}</td>
                <td className="py-3 px-4 font-[heebo]">{a.email}</td>
                <td className="py-3 px-4 font-[heebo]">{a.submissionDate}</td>
                <td className="py-3 px-4 font-[heebo] flex items-center gap-3">
                  <button
                    onClick={() => openViewModal(index, isArchived)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition text-blue-600"
                    title="View"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                  {isArchived ? (
                    <button
                      onClick={() => handleRestore(index)}
                      className="p-2 rounded-lg hover:bg-slate-100 transition text-green-600 flex items-center gap-1"
                      title="Restore"
                    >
                      <FaUndo className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(index)}
                      className="p-2 rounded-lg hover:bg-slate-100 transition text-red-600 flex items-center gap-1"
                      title="Archive"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-[#EADCFB] via-[#D8C0FA] to-[#F5EBD4]">
      {/* Header */}
      <div className="relative mb-12">
        {/* Sign Out Button - Top Right */}
        <button
          onClick={handleLogout}
          aria-label="Sign out"
          className="absolute top-0 right-0 flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 shadow-md transition font-medium"
        >
          <FaSignOutAlt />
        </button>

        {/* Title & Greeting */}
        <div className="mb-10">
          <h1
            className="text-white text-[42px] font-bold mb-4 leading-tight font-[jost] animated slideInDown"
            style={{ textShadow: "2px 2px 8px rgba(138, 79, 255, 0.4)" }}
          >
            Administrator Dashboard
          </h1>

          <p className="text-lg text-gray-700 font-medium flex items-center gap-2 animate-fade-in">
            <span className="text-green-500 text-xl">👋</span>
            Glad to see you back,{" "}
            <span className="text-blue-700 font-semibold">{name}</span>!
          </p>
        </div>

        {/* Stats Cards */}
        <div
          className="flex flex-col sm:flex-row gap-6"
          style={{ fontFamily: '"Heebo", "Jost", "Poppins", sans-serif' }}
        >
          {[
            {
              label: "Total Applications",
              value: totalApplications,
              color: "#6222CC",
            },
            {
              label: "Applications Today",
              value: todayApplications,
              color: "#726D7B",
            },
            {
              label: "Archived Applications",
              value: archivedApplicants.length,
              color: "#FBA504",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group flex-1 bg-white rounded-2xl shadow-lg p-6 min-w-[220px] border-l-4 transition-transform duration-300 ease-in-out hover:scale-105"
              style={{ borderColor: item.color }}
            >
              <p
                className="text-xs font-medium uppercase tracking-wide transition-all duration-300 ease-in-out"
                style={{ color: "#726D7B" }}
              >
                {item.label}
              </p>
              <p
                className="mt-2 text-3xl font-bold transition-colors duration-300 ease-in-out"
                style={{ color: item.color }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs & Search */}
      <div
        className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6 mb-8"
        style={{ fontFamily: '"Heebo", "Jost", "Poppins", sans-serif' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 font-[jost] text-[15px]">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-full transition ${
                activeTab === "active"
                  ? "bg-[#6222CC] text-white"
                  : "bg-gray-100 text-[#726D7B] hover:bg-gray-200"
              }`}
            >
              Active Applicants
            </button>
            <button
              onClick={() => setActiveTab("archived")}
              className={`px-4 py-2 rounded-full transition ${
                activeTab === "archived"
                  ? "bg-[#FBA504] text-white"
                  : "bg-gray-100 text-[#726D7B] hover:bg-gray-200"
              }`}
            >
              Archived Applicants
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-96 shadow-md shadow-gray-300 rounded-[10px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#726D7B] w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-[10px] text-sm focus:outline-none focus:ring-1 focus:ring-[#6222CC] w-full text-[#726D7B]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-[#F6F4F9] shadow-lg shadow-purple-200 rounded-lg">
          {activeTab === "active" && renderTable(filteredApplicants, false)}
          {activeTab === "archived" && renderTable(filteredArchived, true)}
        </div>
      </div>

      {/* View-only Modal */}
      {showViewModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center bg-gradient-to-r from-[#EADCFB] via-[#D8C0FA] to-[#F5EBD4] border border-gray-300">
              <div>
                <h3 className="text-2xl font-semibold text-white font-[jost]">
                  View Applicant
                </h3>
                <p className="text-sm text-white/80">
                  {formData.fullName || formData.name}
                </p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                aria-label="Close"
                className="bg-white/20 hover:bg-rose-400 text-white w-8 h-8 rounded-full flex items-center justify-center transition duration-200"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto bg-[#F6F4F9]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  ["firstName", "First Name"],
                ["lastName", "Last Name"],
                ["email", "Email"],
                ["phone", "Mobile Number"],
                ["address", "Address"],
                ["experience", "Experience"],
                ["linkedin", "LinkedIn Profile"],
                ["portfolio", "Portfolio URL"],
                ["position", "Position"],
                ["referral", "Referral"],
                ["relocate", "Willing to Relocate"],
                ["salary", "Expected Salary"],
                ["startDate", "Start Date"],
                ["submissionDate", "Submission Date"],
                ].map(([key, label]) => {
                  let value = formData[key];
                  if (key === "preferredLocations" || key === "jobSectors") {
                    value = Array.isArray(value) ? value.join(", ") : value;
                  }
                  if (key === "declaration") {
                    value = formData.declaration ? "Yes" : "No";
                  }
                  if (key === "submittedAt") {
                    value = (
                      formData.submittedAt ||
                      formData.appliedAt ||
                      ""
                    ).toString();
                  }
                  return (
                    <div key={key}>
                      <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide font-[poppins]">
                        {label}
                      </p>
                      {key === "resumeURL" ? (
                        <a
                          href={formData.resumeURL || formData.resume || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-blue-600 underline break-all"
                        >
                          {formData.resumeURL || formData.resume || "-"}
                        </a>
                      ) : (
                        <div className="text-sm text-gray-800 bg-gray-50 rounded-md px-3 py-2 border border-gray-200 font-[heebo]">
                          {value || "-"}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}