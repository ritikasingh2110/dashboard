import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAdmin, getAllAdmins } from "../firebase/helpers/firestoreHelpers";

export default function Auth({ type }) {
  const navigate = useNavigate();
  const isLogin = type === "login";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // type: 'error' | 'success'

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setLoading(true);

    try {
      if (!isLogin) {
        await saveAdmin(formData);
        setMessage({ text: "Admin registered! Please sign in using your credentials.", type: "success" });
        setTimeout(() => navigate("/"), 1500);
      } else {
        const admins = await getAllAdmins();
        const match = admins.find(
          (admin) =>
            admin.email === formData.email &&
            admin.password === formData.password
        );

        if (match) {
          localStorage.setItem("adminId", match.email);
          setMessage({ text: "Login successful! Redirecting...", type: "success" });
          setTimeout(() => navigate("/dashboard"), 1500);
        } else {
          setMessage({ text: "Invalid credentials. Please try again.", type: "error" });
        }
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "An error occurred. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-[#6222CC] text-white p-10 ">
        <h1 className="text-5xl font-bold mb-4 font-[jost]">Admin Dashboard</h1>
        <p className="font-[heebo] text-base text-center max-w-sm">
          {isLogin
            ? "Access your dashboard with ease and security."
            : "Create an account to start managing your work efficiently."}
        </p>
      </div>

      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <h2 className="font-[poppins] text-2xl sm:text-3xl font-bold text-slate-800 text-center mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="font-[heebo] text-sm text-slate-500 text-center mb-6">
            {isLogin ? "Please sign in to continue" : "Sign up to get started"}
          </p>

          {message.text && (
            <div className={`mb-4 p-3 rounded ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="font-[heebo] block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6222CC]"
                />
              </div>
            )}

            <div>
              <label className="font-[heebo] block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6222CC]"
              />
            </div>

            <div>
              <label className="font-[heebo] block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6222CC]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`font-[heebo] w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#726D7B] hover:bg-[#FBA504]"} text-white font-semibold py-3 rounded-lg transition`}
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="font-[poppins] mt-6 text-center text-sm text-slate-600">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
            <span
              onClick={() => navigate(isLogin ? "/signup" : "/")}
              className="text-[#6222CC] font-medium hover:underline cursor-pointer"
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
