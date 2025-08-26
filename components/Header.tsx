'use client'

interface HeaderProps {
  restaurantName: string
}

export default function Header({ restaurantName }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 capitalize">{restaurantName}</h1>
        </div>
      </div>
    </header>
  )
}