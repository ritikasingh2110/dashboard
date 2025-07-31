export default function Layout({ children }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 px-4">
      {children}
    </div>
  );
}
