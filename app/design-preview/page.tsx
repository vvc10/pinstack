import React from 'react';
import { Star, Car } from 'lucide-react';

 
const RideBookingCard = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';

  return (
    <div
      className="w-[400px] h-[200px] rounded-[24px] p-6 relative"
      style={{
        background: isDark 
          ? '#3D3F42' 
          : '#E8E8EA',
      }}
    >
      <div className="flex h-full">
        {/* Left Section - Profile */}
        <div className="flex items-start pt-1">
          <img
            src="https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?auto=format&fit=crop&w=128&h=128&q=80"
            alt="David S."
            className="w-[64px] h-[64px] rounded-full object-cover"
          />
          <div className="ml-4">
            <h2 
              className="font-semibold leading-none mb-1"
              style={{ 
                fontSize: '28px',
                color: isDark ? '#FFFFFF' : '#1C1C1E',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              David S.
            </h2>
            <div className="flex items-center gap-2">
              <span 
                className="font-medium"
                style={{ 
                  fontSize: '14px',
                  color: isDark ? '#A8A8A8' : '#6D6D70'
                }}
              >
                4.0 Stars
              </span>
              <div className="flex gap-0.5">
                <Star size={12} className="text-[#FFD60A] fill-[#FFD60A]" />
                <Star size={12} className="text-[#FFD60A] fill-[#FFD60A]" />
                <Star size={12} className="text-[#FFD60A] fill-[#FFD60A]" />
                <Star size={12} className="text-[#FFD60A] fill-[#FFD60A]" />
                <Star size={12} className={isDark ? "text-[#5A5A5C]" : "text-[#C7C7CC]"} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Car Info */}
        <div className="flex-1 flex flex-col items-end pt-1 pr-2">
          <div className="flex items-center gap-2 mb-1">
            <Car 
              size={16} 
              className={isDark ? "text-[#A8A8A8]" : "text-[#6D6D70]"} 
            />
            <span 
              className="font-medium"
              style={{ 
                fontSize: '16px',
                color: isDark ? '#FFFFFF' : '#1C1C1E',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Toyota Camry
            </span>
          </div>
          <span 
            style={{ 
              fontSize: '14px',
              color: isDark ? '#A8A8A8' : '#6D6D70',
              marginRight: '18px'
            }}
          >
            Silver
          </span>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="absolute bottom-6 left-6 right-6 flex gap-3">
        <button 
          className="flex-1 text-center font-semibold rounded-2xl transition-transform active:scale-[0.98]"
          style={{
            height: '44px',
            fontSize: '16px',
            background: isDark ? '#5A5A5C' : '#BABAC0',
            color: isDark ? '#E5E5E7' : '#1C1C1E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
          }}
        >
          Schedule
        </button>
        <button 
          className="flex-1 text-center font-semibold rounded-2xl text-white transition-transform active:scale-[0.98]"
          style={{
            height: '44px',
            fontSize: '16px',
            background: 'linear-gradient(180deg, #4C8EF7 0%, #2563EB 100%)',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
          }}
        >
          Book Ride
        </button>
      </div>
    </div>
  );
};
 
 
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F7] p-8 gap-12">
      <RideBookingCard theme="dark" />
      <RideBookingCard theme="light" />
    </div>
  );
}