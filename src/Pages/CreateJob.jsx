import { useState } from "react";
import { saveJob } from "../firebase/helpers/firestoreHelpers";

export default function CreateJob() {
  const jobFunctions = [
    "Consultant",
    "Engineering Services",
    "Enterprise Application Services",
    "Application Development and Maintenance",
    "Developer",
    "Cloud and Infrastructure Services",
    "Data and Analytics",
    "Infosys Quality Engineering",
    "Digital Experience (DX)",
    "Testing",
    "Business Consulting",
    "Cyber Security",
  ];

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    jobFunction: jobFunctions[0],
    responsibilities: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const id = await saveJob(formData);
      alert(`✅ Job created successfully! (ID: ${id})`);

      setFormData({
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        salary: "",
        description: "",
        jobFunction: jobFunctions[0],
        responsibilities: "",
        skills: "",
      });
    } catch (error) {
      console.error("❌ Error creating job:", error);
      alert("Failed to create job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-white p-6 font-[Poppins]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#F6F4F9] shadow-2xl rounded-2xl p-10 w-full max-w-3xl border border-gray-300"
      >
        <h2 className="text-3xl font-bold text-[#6222CC] mb-6 text-center font-[Jost] tracking-wide">
          Create New Job
        </h2>

        {/* Job Title */}
        <div className="mb-5">
          <label className="block text-[#726D7B] font-semibold mb-2 text-sm uppercase tracking-wide">
            Job Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-[#6222CC] focus:outline-none text-gray-700 shadow-sm"
          />
        </div>

        {/* Company */}
        <div className="mb-5">
          <label className="block text-[#726D7B] font-semibold mb-2 text-sm uppercase tracking-wide">
            Company
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-[#6222CC] text-gray-700 shadow-sm"
          />
        </div>

        {/* Location */}
        <div className="mb-5">
          <label className="block text-[#726D7B] font-semibold mb-2 text-sm uppercase tracking-wide">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-[#6222CC] text-gray-700 shadow-sm"
          />
        </div>

        {/* Job Function */}
        <div className="mb-5">
          <label className="block text-[#726D7B] font-semibold mb-2 text-sm uppercase tracking-wide">
            Job Function
          </label>
          <select
            name="jobFunction"
            value={formData.jobFunction}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-[#6222CC] text-gray-700 shadow-sm"
          >
            {jobFunctions.map((func, index) => (
              <option key={index} value={func}>
                {func}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type */}
        <div className="mb-5">
          <label className="block text-[#726D7B] font-semibold mb-2 text-sm uppercase tracking-wide">
            Job Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-[#6222CC] text-gray-700 shadow-sm"
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>
        </div>

        {/* Salary */}
        <div className="mb-5">
          <label className="block text-[#726D7B] font-semibold mb-2 text-sm uppercase tracking-wide">
            Salary (LPA)
          </label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
            placeholder="e.g. 5.5"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-[#6222CC] text-gray-700 shadow-sm"
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block text-[#726D7B] font-semibold mb-2 text-sm uppercase tracking-wide">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-[#6222CC] text-gray-700 shadow-sm"
          />
        </div>

        {/* Roles & Responsibilities */}
        <div className="mb-5">
          <label className="block text-[#726D7B] font-semibold mb-2 text-sm uppercase tracking-wide">
            Roles & Responsibilities
          </label>
          <textarea
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleChange}
            rows="5"
            placeholder="List responsibilities here..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-[#6222CC] text-gray-700 shadow-sm"
          />
        </div>

        {/* Skills */}
        <div className="mb-8">
          <label className="block text-[#726D7B] font-semibold mb-2 text-sm uppercase tracking-wide">
            Skills
          </label>
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            rows="4"
            placeholder="Required skills e.g. Java, React, SQL..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-[#6222CC] text-gray-700 shadow-sm"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6222CC] text-white py-3 rounded-lg hover:bg-[#4e1ba3] transition-all shadow-lg font-semibold tracking-wide disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}
