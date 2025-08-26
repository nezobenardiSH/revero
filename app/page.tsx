export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Table Reservation Platform
        </h1>
        <p className="text-gray-600 mb-8">
          Access your restaurant at subdomain.localhost:3000
        </p>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">
            Example: storea.localhost:3000
          </p>
        </div>
      </div>
    </div>
  )
}