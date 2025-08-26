'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

interface LandingPageProps {
  restaurantName: string
}

export default function LandingPage({ restaurantName }: LandingPageProps) {
  const [reservationCode, setReservationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCheckReservation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reservationCode.trim()) return
    
    setIsLoading(true)
    // Navigate to reservation detail page
    router.push(`/${restaurantName}/reservation/${reservationCode}`)
  }

  const handleNewReservation = () => {
    router.push(`/${restaurantName}/book`)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header restaurantName={restaurantName} />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center px-12 lg:px-24 py-12 max-w-2xl mx-auto w-full">
            {/* Title */}
            <div className="mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Reserve a table at{' '}
                <span className="capitalize">{restaurantName}</span>
              </h1>
            </div>

            {/* Check Reservation Form */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Check Your Reservation</h3>
              
              <form onSubmit={handleCheckReservation} className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Reservation Code
                  </label>
                  <div className="relative">
                    <input
                      id="code"
                      type="text"
                      value={reservationCode}
                      onChange={(e) => setReservationCode(e.target.value.toUpperCase())}
                      placeholder="Enter your code (e.g., #123)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                      pattern="^#?\d+$"
                      required
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Your reservation code was sent to your email
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={!reservationCode.trim() || isLoading}
                  className="w-full py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
                >
                  {isLoading ? 'Checking...' : 'Check Reservation'}
                </button>
              </form>
            </div>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-600">
                  OR
                </span>
              </div>
            </div>

            {/* New Reservation Button */}
            <button
              onClick={handleNewReservation}
              className="w-full py-4 bg-orange-500 text-white rounded-md font-semibold text-lg hover:bg-orange-600 transition-colors mb-8"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Reservation</span>
              </div>
            </button>

            {/* Help Text */}
            <div className="text-left mb-8">
              <p className="text-sm text-gray-600">
                Need help? Contact us at{' '}
                <a href="tel:+1234567890" className="text-orange-600 hover:underline">
                  (123) 456-7890
                </a>
              </p>
            </div>

            <Footer />
          </div>

          {/* Right Column - Restaurant Image */}
          <div className="relative lg:min-h-screen">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=1200&fit=crop&crop=center"
              alt="Restaurant interior"
              className="w-full h-full min-h-[400px] lg:min-h-screen object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}