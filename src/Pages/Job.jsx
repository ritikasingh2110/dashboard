import React, { useState, useEffect } from "react";
import {
  FaTrash,
  FaEye,
  FaSignOutAlt,
  FaUndo,
  FaSearch,
  FaArrowRight,
  FaEdit, // ✅ Added missing import
} from "react-icons/fa";
import {
  getAllApplications,
  archiveApplication,
  getAllArchivedApplications,
  restoreApplication,
} from "../firebase/helpers/firestoreHelpers";
import { useNavigate } from "react-router-dom";

export default function Job() {
  const [applicants, setApplicants] = useState([]);
  const [archivedApplicants, setArchivedApplicants] = useState([]);
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
          getAllArchivedApplications(),
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

  // Dummy job data
  const dummyJobs = [
    { id: 1, title: "Consultant", count: 4 },
    { id: 2, title: "Engineering Services", count: 2 },
    { id: 3, title: "Enterprise Application Services", count: 3 },
    { id: 4, title: "Application Development and Maintenance", count: 1 },
    { id: 5, title: "Developer", count: 5 },
    { id: 6, title: "Cloud and Infrastructure Services", count: 2 },
    { id: 7, title: "Data and Analytics", count: 3 },
    { id: 8, title: "Infosys Quality Engineering", count: 4 },
    { id: 9, title: "Digital Experience (DX)", count: 2 },
    { id: 10, title: "Testing", count: 3 },
    { id: 11, title: "Business Consulting", count: 4 },
    { id: 12, title: "Cyber Security", count: 2 },
  ];

  // Search filter
  const filteredJobs = dummyJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.count.toString().includes(searchTerm)
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const goToNewPage = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center">
          <p className="text-xl font-medium text-gray-700">
            Loading job dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="relative mb-12">
        {/* Logout button (top right) */}
        <button
          onClick={handleLogout}
          aria-label="Sign out"
          className="absolute top-0 right-0 flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 shadow-md transition font-medium"
        >
          <FaSignOutAlt />
        </button>

        {/* Admin Dashboard button (below logout) */}
        <button
          onClick={goToNewPage}
          aria-label="Go to new page"
          className="absolute top-12 right-0 flex items-center gap-2 bg-transparent text-[#FBA504] py-2.5 rounded-lg  transition font-medium"
        >
          {/* <FaArrowRight /> */}
          <span className="text-red-600">||</span>Admin dashboard
        </button>

        {/* Title & Greeting */}
        <div className="mb-10">
          <h1
            className="text-[#6222CC] text-[42px] font-bold mb-4 leading-tight font-[jost] animated slideInDown"
            style={{ textShadow: "2px 2px 8px rgba(138, 79, 255, 0.4)" }}
          >
            Administrator Job Dashboard
          </h1>

          <p className="font-[heebo] text-lg text-gray-700 font-medium flex items-center gap-2 animate-fade-in">
            <span className="text-green-500 text-xl">👋</span>
            Glad to see you back,{" "}
            <span className="text-blue-700 font-semibold">{name}</span>!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-col sm:flex-row gap-6 font-[heebo]">
          {[
            { label: "Total Job Functions", value: 12, color: "#6222CC" },
            {
              label: "Total Jobs",
              value: 120,
              color: "#726D7B",
            },
            // {
            //   label: "Archived Applications",
            //   value: archivedApplicants.length,
            //   color: "#FBA504",
            // },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex-1 bg-[#F6F4F9] rounded-2xl shadow-lg p-6 min-w-[220px] border-l-4 transition-transform duration-300 hover:scale-105"
              style={{ borderColor: item.color }}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-gray-600">
                {item.label}
              </p>
              <p
                className="mt-2 text-3xl font-bold"
                style={{ color: item.color }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs Section */}
      <div className="bg-gradient-to-r from-[#F4EEFB] via-[#E9DDFB] to-[#FAF4EC] rounded-xl shadow border border-gray-200 p-4 sm:p-6 mb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="font-[jost] text-[18px] font-semibold text-[#6222CC]">
            Featured Jobs
          </h2>

          {/* Search */}
          <div className="bg-[#F6F4F9] relative w-full sm:w-96 shadow-md shadow-gray-300 rounded-[10px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#726D7B] w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs by title or count..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-[10px] text-sm focus:outline-none focus:ring-1 focus:ring-[#6222CC] w-full text-[#726D7B]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto font-[Poppins] shadow-md shadow-purple-200 border border-gray-300 rounded-lg bg-[#F6F4F9]">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-base font-semibold border-b-2 border-gray-300">
                  S.No.
                </th>
                <th className="px-6 py-3 text-left text-base font-semibold border-b-2 border-gray-300">
                  Job Functions
                </th>
                <th className="px-6 py-3 text-left text-base font-semibold border-b-2 border-gray-300">
                  No. of Jobs
                </th>
                <th className="px-6 py-3 text-left text-base font-semibold border-b-2 border-gray-300">
                  Available Jobs
                </th>
                <th className="px-6 py-3 text-left text-base font-semibold border-b-2 border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No jobs found.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job, index) => (
                  <tr
                    key={job.id}
                    className="border-b border-gray-200 hover:bg-gray-100 transition"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{job.title}</td>
                    <td className="py-3 px-4">{job.count}</td>
                    <td className="py-3 px-4">
                      <button
                        className="p-2 ml-14 rounded-lg hover:bg-slate-100 text-blue-600"
                        title="View"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-3 px-4 flex items-center gap-3">
                      <button
                        className="p-2 ml-6 rounded-lg hover:bg-slate-100 text-red-600"
                        title="Delete"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
