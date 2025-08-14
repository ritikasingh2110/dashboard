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

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (!isLogin) {
      await saveAdmin(formData);
      alert("Admin registered! Please Signin Using Your Credentials");
      navigate("/");
    } else {
      const admins = await getAllAdmins();
      const match = admins.find(
        (admin) =>
          admin.email === formData.email &&
          admin.password === formData.password
      );

      if (match) {
        // ✅ Save adminId to localStorage
        localStorage.setItem("adminId", match.email);

        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    }
  } catch (error) {
    console.error(error);
    alert("Error during authentication");
  }
};

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-blue-600 text-white p-10">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-lg text-center max-w-sm">
          {isLogin
            ? "Access your dashboard with ease and security."
            : "Create an account to start managing your work efficiently."}
        </p>
      </div>

      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm text-slate-500 text-center mb-6">
            {isLogin ? "Please sign in to continue" : "Sign up to get started"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
            <span
              onClick={() => navigate(isLogin ? "/signup" : "/")}
              className="text-blue-600 font-medium hover:underline cursor-pointer"
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
