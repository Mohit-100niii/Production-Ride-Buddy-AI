export default function DashboardHome() {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen mt-15 rounded-2xl shadow-md">
      <div className="bg-white rounded-2xl shadow-md p-6 border border-purple-100">
        <h1 className="text-3xl font-bold text-gray-800">Driver Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Manage your rides, stay active, and keep track of your daily driving updates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-5 border border-purple-100">
          <h2 className="text-lg font-semibold text-gray-700">Today’s Rides</h2>
          <p className="text-3xl font-bold text-purple-600 mt-3">12</p>
          <p className="text-sm text-gray-500 mt-1">Completed rides today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 border border-purple-100">
          <h2 className="text-lg font-semibold text-gray-700">Earnings</h2>
          <p className="text-3xl font-bold text-green-600 mt-3">₹2,450</p>
          <p className="text-sm text-gray-500 mt-1">Today’s total earnings</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 border border-purple-100">
          <h2 className="text-lg font-semibold text-gray-700">Driver Status</h2>
          <p className="text-3xl font-bold text-blue-600 mt-3">Active</p>
          <p className="text-sm text-gray-500 mt-1">You are ready to take rides</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-purple-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
              <p className="font-medium text-gray-700">Ride completed successfully</p>
              <p className="text-sm text-gray-500">Pickup: City Center → Drop: Railway Station</p>
            </div>
            <div className="p-4 rounded-xl bg-pink-50 border border-pink-100">
              <p className="font-medium text-gray-700">New ride request received</p>
              <p className="text-sm text-gray-500">Pickup: Main Market → Drop: Airport Road</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <p className="font-medium text-gray-700">Status changed to Active</p>
              <p className="text-sm text-gray-500">You are now visible to nearby riders</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-purple-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Driver Tips</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="bg-gray-50 rounded-lg p-3 border">Keep your status active to receive ride requests faster.</li>
            <li className="bg-gray-50 rounded-lg p-3 border">Check recent rides to track your trip activity.</li>
            <li className="bg-gray-50 rounded-lg p-3 border">Stay online during peak hours to improve ride opportunities.</li>
            <li className="bg-gray-50 rounded-lg p-3 border">Maintain quick response time for better ride acceptance flow.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}