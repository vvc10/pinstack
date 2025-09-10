"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MindloopLanding() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Exact background with user's specified image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://i.pinimg.com/1200x/34/ec/78/34ec78ae0ab34927ea8e9cf17c713ba5.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat'
        }}
      />
 

      {/* Header with exact spacing and typography */}
      <header className="relative z-10 flex justify-between items-center" style={{ padding: '24px 32px' }}>
        <div className="flex items-center" style={{ gap: '8px' }}>
          <div 
            className="flex items-center justify-center" 
            style={{ 
              width: '32px', 
              height: '32px', 
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <div 
              style={{ 
                width: '16px', 
                height: '16px', 
                background: 'white',
                borderRadius: '50%'
              }}
            />
          </div>
          <span 
            className="text-white" 
            style={{ 
              fontSize: '18px', 
              fontWeight: '500', 
              letterSpacing: '-0.01em'
            }}
          >
            Mindloop
          </span>
        </div>
        
        <nav className="flex items-center" style={{ gap: '32px' }}>
          <a 
            href="#" 
            className="text-white hover:text-white/80 transition-colors" 
            style={{ fontSize: '15px', fontWeight: '400' }}
          >
            Features
          </a>
          <a 
            href="#" 
            className="text-white hover:text-white/80 transition-colors" 
            style={{ fontSize: '15px', fontWeight: '400' }}
          >
            About
          </a>
          <a 
            href="#" 
            className="text-white hover:text-white/80 transition-colors" 
            style={{ fontSize: '15px', fontWeight: '400' }}
          >
            Blog
          </a>
          <div className="flex items-center" style={{ gap: '16px', marginLeft: '24px' }}>
            <button 
              className="text-white hover:text-white/80 transition-colors" 
              style={{ fontSize: '15px', fontWeight: '400' }}
            >
              Log In
            </button>
            <button 
              className="text-white hover:bg-white/25 transition-all"
              style={{
                background: 'rgba(60, 60, 60, 0.8)',
                border: 'none',
                borderRadius: '28px',
                borderTop: '2px solid rgba(255, 255, 255, 0.3)',
                borderBottom: '2px solid rgba(0, 0, 0, 0.3)',
                padding: '8px 24px',
                fontSize: '16px',
                fontWeight: '500',
                margin: '0',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.2)'
              }}
            >
              Sign In
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content with exact spacing */}
      <main className="relative z-10 flex flex-col items-center text-center" style={{ paddingTop: '80px', paddingLeft: '32px', paddingRight: '32px' }}>
        {/* User avatars with exact styling */}
        <div className="flex items-center" style={{ marginBottom: '32px', gap: '12px' }}>
          <div className="flex" style={{ gap: '-8px' }}>
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
              alt="Sarah Chen"
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%',
                border: '2px solid white',
                zIndex: 3,
                objectFit: 'cover'
              }}
            />
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
              alt="Alex Rodriguez"
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%',
                border: '2px solid white',
                marginLeft: '-8px',
                zIndex: 2,
                objectFit: 'cover'
              }}
            />
            <img 
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
              alt="Emma Wilson"
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%',
                border: '2px solid white',
                marginLeft: '-8px',
                zIndex: 1,
                objectFit: 'cover'
              }}
            />
          </div>
          <span 
            className="text-white" 
            style={{ 
              fontSize: '14px', 
              fontWeight: '400', 
              opacity: '0.9',
              letterSpacing: '0.01em'
            }}
          >
            2,847 developers already building
          </span>
        </div>

        {/* Main heading with exact typography */}
        <h1 
          className="text-white" 
          style={{ 
            fontSize: '64px', 
            fontWeight: '600', 
            lineHeight: '1.1', 
            letterSpacing: '-0.02em',
            marginBottom: '24px',
            maxWidth: '800px'
          }}
        >
          Focus in a Distracted World
        </h1>

        {/* Subtitle with exact spacing */}
        <p 
          className="text-white" 
          style={{ 
            fontSize: '18px', 
            fontWeight: '400', 
            lineHeight: '1.6', 
            opacity: '0.85',
            marginBottom: '48px',
            maxWidth: '580px'
          }}
        >
          Tools for deep work and clarity - say goodbye to constant pings<br />
          and endless tabs. Say hello to intentional productivity.
        </p>

        {/* Email signup with exact styling */}
        <div className="relative" style={{ width: '100%', maxWidth: '420px' }}>
          <div className="relative flex items-center" style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '28px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <input
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 text-white placeholder-white/60 focus:outline-none transition-all"
              style={{
                background: 'transparent',
                border: 'none',
                borderRadius: '28px',
                padding: '14px 24px',
                fontSize: '16px',
                fontWeight: '400',
                width: '100%'
              }}
            />
            <div style={{
              width: '1px',
              height: '20px',
              background: 'rgba(255, 255, 255, 0.3)',
              margin: '0 8px'
            }} />
            <button 
              className="text-white hover:opacity-90 transition-all whitespace-nowrap"
              style={{
                background: 'rgba(60, 60, 60, 0.8)',
                border: 'none',
                borderRadius: '28px',
                borderTop: '2px solid rgba(255, 255, 255, 0.3)',
                borderBottom: '2px solid rgba(0, 0, 0, 0.3)',
                padding: '14px 24px',
                fontSize: '16px',
                fontWeight: '500',
                margin: '0',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.2)'
              }}
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}