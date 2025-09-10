import React, { useState, useEffect } from "react";
import {
  FaTrash,
  FaEye,
  FaSignOutAlt,
  FaSearch,
  FaEdit,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAllJobs, deleteJobByJobId, updateJobByJobId } from "../firebase/helpers/firestoreHelpers"; // ✅ updated import

export default function Job() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobFunctions, setJobFunctions] = useState([]);

  // ✅ New state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editJobData, setEditJobData] = useState({});

  // ✅ State for logout modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem("adminId");
        setName(email);

        const allJobs = await getAllJobs();
        setJobs(allJobs);

        recalcJobFunctions(allJobs);
      } catch (error) {
        console.error("Failed to load job dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recalcJobFunctions = (jobList) => {
    const functionCount = {};
    jobList.forEach((job) => {
      if (job.jobFunction) {
        functionCount[job.jobFunction] = (functionCount[job.jobFunction] || 0) + 1;
      }
    });
    const functionsArray = Object.entries(functionCount).map(([title, count], index) => ({
      id: index + 1,
      title,
      count,
    }));
    setJobFunctions(functionsArray);
  };

  const filteredJobs = jobFunctions.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.count.toString().includes(searchTerm)
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const goToNewPage = () => navigate("/dashboard");

   const goToJob = () => {
    navigate("/create-job");
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await deleteJobByJobId(jobId);

      const updatedJobs = jobs.filter((job) => job.jobId !== jobId);
      setJobs(updatedJobs);

      recalcJobFunctions(updatedJobs);

      if (selectedJob && updatedJobs.every((j) => j.jobFunction !== selectedJob.title)) {
        setShowViewModal(false);
        setSelectedJob(null);
      }

      alert("Job deleted successfully!");
    } catch (error) {
      console.error("Failed to delete job:", error);
      alert("Error deleting job. Check console.");
    }
  };

  const handleEdit = (job) => {
    setIsEditing(true);
    setEditJobData(job);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await updateJobByJobId(editJobData.jobId, editJobData);

      const updatedJobs = jobs.map(job =>
        job.jobId === editJobData.jobId ? editJobData : job
      );
      setJobs(updatedJobs);
      recalcJobFunctions(updatedJobs);

      alert("Job updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update job:", error);
      alert("Error updating job.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <p className="text-xl font-medium text-gray-700">Loading job dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
          {/* Header */}
          <div className="relative mb-12">
            {/* ✅ Updated Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              aria-label="Sign out"
              className="absolute top-0 right-0 flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 shadow-md transition font-medium"
            >
              <FaSignOutAlt />
            </button>
    

        <button
          onClick={goToNewPage}
          className="absolute top-12 right-0 flex items-center gap-2 bg-transparent text-[#FBA504] py-2.5 rounded-lg transition font-medium"
        >
          <span className="text-red-600">||</span>Admin dashboard
        </button>

        <button
       onClick={goToJob}
       aria-label="Go to new page"
       className="absolute top-20 right-7.5 flex items-center gap-2 bg-transparent text-[#FBA504] py-2.5 rounded-lg  transition font-medium"
>
       {/* <FaArrowRight /> */}
       <span className="text-red-600">||</span>Post new Job 
       </button>

        <div className="mb-10">
          <h1 className="text-[#6222CC] text-[42px] font-bold mb-4 leading-tight font-[jost]">
            Administrator Job Dashboard
          </h1>
          <p className="font-[heebo] text-lg text-gray-700 font-medium flex items-center gap-2">
            <span className="text-green-500 text-xl">👋</span>
            Glad to see you back,{" "}
            <span className="text-blue-700 font-semibold">{name}</span>!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 font-[heebo]">
          <div className="flex-1 bg-[#F6F4F9] rounded-2xl shadow-lg p-6 min-w-[220px] border-l-4" style={{ borderColor: "#6222CC" }}>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-600">Total Job Functions</p>
            <p className="mt-2 text-3xl font-bold" style={{ color: "#6222CC" }}>{jobFunctions.length}</p>
          </div>
          <div className="flex-1 bg-[#F6F4F9] rounded-2xl shadow-lg p-6 min-w-[220px] border-l-4" style={{ borderColor: "#726D7B" }}>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-600">Total Jobs</p>
            <p className="mt-2 text-3xl font-bold" style={{ color: "#726D7B" }}>{jobs.length}</p>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-gradient-to-r from-[#F4EEFB] via-[#E9DDFB] to-[#FAF4EC] rounded-xl shadow border border-gray-200 p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="font-[jost] text-[18px] font-semibold text-[#6222CC]">Featured Jobs</h2>
          <div className="bg-[#F6F4F9] relative w-full sm:w-96 shadow-md rounded-[10px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#726D7B] w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs by title or count..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-[10px] text-sm w-full text-[#726D7B]"
            />
          </div>
        </div>

        <div className="overflow-x-auto font-[Poppins] shadow-md border border-gray-300 rounded-lg bg-[#F6F4F9]">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left font-semibold border-b-2 border-gray-300">S.No.</th>
                <th className="px-6 py-3 text-left font-semibold border-b-2 border-gray-300">Job Functions</th>
                <th className="px-6 py-3 text-left font-semibold border-b-2 border-gray-300">No. of Jobs</th>
                <th className="px-6 py-3 text-left font-semibold border-b-2 border-gray-300">Available Jobs</th>
                <th className="px-6 py-3 text-left font-semibold border-b-2 border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">No jobs found.</td>
                </tr>
              ) : (
                filteredJobs.map((job, index) => (
                  <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-100 transition">
                    <td className="py-3 px-4 pl-8">{index + 1}</td>
                    <td className="py-3 px-4 pl-8">{job.title}</td>
                    <td className="py-3 px-4 pl-15">{job.count}</td>
                    <td className="py-3 px-4">
                      <button
                        className="p-2 ml-11 rounded-lg hover:bg-slate-100 text-blue-600"
                        title="View"
                        onClick={() => {
                          setSelectedJob(job);
                          setShowViewModal(true);
                          setIsEditing(false); // ✅ reset edit mode when viewing
                        }}
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-3 px-4 flex items-center gap-3">
                      <button
                        className="p-2 ml-6 rounded-lg hover:bg-slate-100 text-red-600"
                        title="Delete"
                        onClick={() => {
                          const jobsToDelete = jobs.filter(j => j.jobFunction === job.title);
                          jobsToDelete.forEach(j => handleDelete(j.jobId));
                        }}
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

      {/* View Modal */}
      {showViewModal && selectedJob && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 flex justify-between items-center bg-gradient-to-r from-[#EADCFB] via-[#D8C0FA] to-[#F5EBD4] border border-gray-300">
              <div>
                <h3 className="text-2xl font-semibold text-white font-[jost]">JOB FOR :</h3>
                <p className="text-sm text-white/80">{selectedJob.title}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="bg-white/20 hover:bg-rose-400 text-white w-8 h-8 rounded-full flex items-center justify-center">✕</button>
            </div>

            <div className="p-6 overflow-y-auto bg-[#F6F4F9] space-y-8">
              {jobs
                .filter(job => job.jobFunction === selectedJob.title)
                .map(job => (
                  <div key={job.jobId} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 relative">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-[#6222CC]">Available Job : {job.jobId}</h4>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(job)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition" title="Edit Job">
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(job.jobId)} className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition" title="Delete Job">
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {isEditing && editJobData.jobId === job.jobId ? (
                      <form onSubmit={handleSaveEdit} className="space-y-4 mb-4">
                        {["title", "company", "location", "type", "salary", "skills", "responsibilities", "description"].map((key) => (
                          <div key={key}>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                            <input
                              type="text"
                              value={editJobData[key] || ""}
                              onChange={(e) => setEditJobData({ ...editJobData, [key]: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        ))}
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#6222CC] text-white rounded-md hover:bg-[#FBA504] transition"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Job ID</p>
                            <div className="text-sm text-gray-800 bg-gray-50 rounded-md px-3 py-2 border border-gray-200">{job.jobId}</div>
                          </div>

                          {["title", "company", "location", "type", "salary"].map(key => (
                            <div key={key}>
                              <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                              <div className="text-sm text-gray-800 bg-gray-50 rounded-md px-3 py-2 border border-gray-200">{job[key] || "-"}</div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6">
                          <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Skills</p>
                          <div className="text-sm text-gray-800 bg-gray-50 rounded-md px-3 py-2 border border-gray-200 whitespace-pre-line">{job.skills || "-"}</div>
                        </div>

                        <div className="mt-6">
                          <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Responsibilities</p>
                          <div className="text-sm text-gray-800 bg-gray-50 rounded-md px-3 py-2 border border-gray-200 whitespace-pre-line">{job.responsibilities || "-"}</div>
                        </div>

                        <div className="mt-6">
                          <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Description</p>
                          <div className="text-sm text-gray-800 bg-gray-50 rounded-md px-3 py-2 border border-gray-200 whitespace-pre-line">{job.description || "-"}</div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* ✅ Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 font-[poppins] ">Confirm Logout</h3>
            <p className="text-gray-600 font-[heebo]">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4 font-[jost]">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
