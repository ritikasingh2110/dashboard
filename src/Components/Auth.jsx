import { useNavigate } from "react-router-dom";

export default function Auth({ type }) {
  const navigate = useNavigate();
  const isLogin = type === "login";

  return (
    <div className="min-h-screen flex">
      {/* Left panel (hidden on small screens) */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-blue-600 text-white p-10">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-lg text-center max-w-sm">
          {isLogin
            ? "Access your dashboard with ease and security."
            : "Create an account to start managing your work efficiently."}
        </p>
        {/* <img
          src="https://illustrations.popsy.co/gray/dashboard.svg"
          alt="Auth Illustration"
          className="w-80 mt-10"
        /> */}
      </div>

      {/* Right panel (form) */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm text-slate-500 text-center mb-6">
            {isLogin ? "Please sign in to continue" : "Sign up to get started"}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/dashboard");
            }}
            className="space-y-5"
          >
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
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
                placeholder="you@example.com"
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
                placeholder="••••••••"
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
