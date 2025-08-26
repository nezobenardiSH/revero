export default function RestaurantPage({ 
  params 
}: { 
  params: { subdomain: string } 
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome to {params.subdomain}
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Table reservation system coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}