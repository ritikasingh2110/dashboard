import React, { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function Dashboard() {
  const totalApplications = 150;
  const todayApplications = 12;

    const [applicants, setApplicants] = useState([
  {
    name: "A Sharma",
    mobile: "9876543210",
    email: "asharma@example.com",
    gender: "Male",
    dob: "1995-04-20",
    location: "Delhi / Delhi / Central",
    qualification: "B.Tech",
    experience: "Fresher",
    workLocation: "Delhi",
    sector: "IT",
    resume: "http://example.com/resume1",
    submissionDate: "2025-07-29",
    declaration: true,
  },
  {
    name: "R Verma",
    mobile: "9123456780",
    email: "rverma@example.com",
    gender: "Female",
    dob: "1996-06-10",
    location: "Mumbai / Maharashtra / Western",
    qualification: "MCA",
    experience: "1 Year",
    workLocation: "Mumbai",
    sector: "Finance",
    resume: "http://example.com/resume2",
    submissionDate: "2025-07-30",
    declaration: true,
  },
  {
    name: "P Mehta",
    mobile: "9812345678",
    email: "pmehta@example.com",
    gender: "Female",
    dob: "1994-08-12",
    location: "Ahmedabad / Gujarat / Western",
    qualification: "MBA",
    experience: "2 Years",
    workLocation: "Ahmedabad",
    sector: "Marketing",
    resume: "http://example.com/resume3",
    submissionDate: "2025-07-28",
    declaration: false,
  },
  {
    name: "K Verma",
    mobile: "9001234567",
    email: "kverma@example.com",
    gender: "Male",
    dob: "1993-11-01",
    location: "Chandigarh / Punjab / North",
    qualification: "M.Tech",
    experience: "3 Years",
    workLocation: "Remote",
    sector: "Research",
    resume: "http://example.com/resume4",
    submissionDate: "2025-07-25",
    declaration: true,
  },
  {
    name: "D Joshi",
    mobile: "7894561230",
    email: "djoshi@example.com",
    gender: "Male",
    dob: "1990-01-15",
    location: "Bangalore / Karnataka / South",
    qualification: "B.Sc",
    experience: "5+ Years",
    workLocation: "Bangalore",
    sector: "Development",
    resume: "http://example.com/resume5",
    submissionDate: "2025-07-27",
    declaration: true,
  },
]);


  const [selectedIndex, setSelectedIndex] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);

  const openModal = (index) => {
    setSelectedIndex(index);
    setFormData(applicants[index]);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = () => {
    const updated = [...applicants];
    updated[selectedIndex] = formData;
    setApplicants(updated);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Applications
          </h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {totalApplications}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-600">
          <h2 className="text-lg font-semibold text-gray-600">
            Applications Today
          </h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {todayApplications}
          </p>
        </div>
      </div>

      {/* Applicants List */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Applicants List
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs border-b">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((a, index) => (
                <tr
                  key={index}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{a.name}</td>
                  <td className="py-3 px-4 flex items-center gap-4">
                    <button
                      onClick={() => openModal(index)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-md"
                      title="Edit"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 p-2 rounded-md"
                      title="Delete"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Edit Applicant</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["name", "Full Name"],
                ["mobile", "Mobile Number"],
                ["email", "Email"],
                ["gender", "Gender"],
                ["dob", "DOB"],
                ["location", "City / State / District"],
                ["qualification", "Qualification"],
                ["experience", "Experience Type"],
                ["workLocation", "Work Location(s)"],
                ["sector", "Sector(s)"],
                ["resume", "Resume Link"],
                ["submissionDate", "Submission Date"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    type={key === "dob" || key === "submissionDate" ? "date" : "text"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              ))}

              <div className="col-span-full">
                <label className="inline-flex items-center mt-2">
                  <input
                    type="checkbox"
                    name="declaration"
                    checked={formData.declaration || false}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Declaration Accepted
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-700 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
