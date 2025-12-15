export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
        
        <h1 className="text-3xl font-bold text-amber-900 text-center mb-6">
          Admin Login
        </h1>

        <form className="space-y-4">
          
          <div>
            <label className="block text-amber-900 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="w-full p-3 border bg-amber-100 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-amber-900 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 border bg-amber-100 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
            />
          </div>

          <button
            type="button"
            className="w-full py-3 bg-amber-500 text-amber-900 font-semibold rounded-xl shadow-md hover:shadow-amber-300/50 hover:scale-[1.03] transition"
          >
            Login
          </button>

        </form>

        <p className="text-center text-sm text-amber-700 mt-4">
          * Admin access only.
        </p>

      </div>
    </div>
  );
}
