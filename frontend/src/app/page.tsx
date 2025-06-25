'use client';

import { useState } from 'react';
import Link from "next/link";
import { LuClock, LuUserCheck, LuTrendingUp, LuCalendarDays, LuMenu, LuGithub, LuTwitter, LuLinkedin, LuX, LuRocket, LuDollarSign, LuShield } from "react-icons/lu";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerHeight = 80; // Height of sticky header
      const elementPosition = targetElement.offsetTop;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    closeMobileMenu(); // Close mobile menu if open
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="#top" className="flex items-center space-x-3 group">
              <div className="relative">
                {/* Enhanced 3D Logo */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl transform rotate-3 group-hover:rotate-6">
                  <LuClock className="text-white text-xl drop-shadow-lg" />
                </div>
                {/* 3D depth shadow */}
                <div className="absolute top-1 left-1 w-12 h-12 bg-gradient-to-br from-blue-800 to-purple-800 rounded-2xl opacity-40 -z-10 transform rotate-3"></div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-20"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 drop-shadow-sm">
                  WorkTally
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Smart Time Tracker</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <Link
                  href="#features"
                  onClick={(e) => handleSmoothScroll(e, 'features')}
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  Features
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link
                  href="#how-it-works"
                  onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  How It Works
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium px-4 py-2 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300 backdrop-blur-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-2.5 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <LuX className="text-gray-600 dark:text-gray-300 text-xl" />
              ) : (
                <LuMenu className="text-gray-600 dark:text-gray-300 text-xl" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-4 pt-2 mt-4 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="#features"
                  onClick={(e) => handleSmoothScroll(e, 'features')}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  How It Works
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={closeMobileMenu}
                    className="block mt-2 mx-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-4 py-2.5 rounded-xl transition-all duration-300 text-center"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id='top' className="relative py-16 md:py-24 overflow-hidden">
        {/* Background Design Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Enhanced Wavy Lines Background */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,60 Q150,20 300,40 Q450,60 600,30 Q750,10 900,40 Q1050,80 1200,50" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="3" fill="none" className="animate-pulse" />
            <path d="M0,140 Q100,90 200,120 Q350,160 500,100 Q650,40 800,120 Q950,200 1100,140 Q1150,120 1200,140" stroke="rgba(147, 51, 234, 0.12)" strokeWidth="4" fill="none" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
            <path d="M0,220 Q120,170 240,200 Q360,230 480,190 Q600,150 720,190 Q840,230 960,200 Q1080,170 1200,220" stroke="rgba(236, 72, 153, 0.1)" strokeWidth="3" fill="none" className="animate-pulse" style={{ animationDelay: '3s' }} />
            <path d="M0,300 Q150,250 300,280 Q450,300 600,270 Q750,240 900,280 Q1050,340 1200,300" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="3" fill="none" className="animate-pulse" />
            <path d="M0,380 Q180,330 360,360 Q540,390 720,350 Q900,310 1080,350 Q1140,370 1200,380" stroke="rgba(34, 197, 94, 0.12)" strokeWidth="3" fill="none" className="animate-pulse" style={{ animationDelay: '4.5s' }} />
            <path d="M0,460 Q90,410 180,440 Q270,470 360,430 Q450,390 540,430 Q630,470 720,440 Q810,410 900,440 Q990,470 1080,450 Q1140,440 1200,460" stroke="rgba(249, 115, 22, 0.1)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '6s' }} />
            <path d="M0,560 Q120,490 240,520 Q360,550 480,510 Q600,470 720,510 Q840,550 960,520 Q1080,490 1200,540" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="3" fill="none" className="animate-pulse" />
          </svg>
        </div>

        <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
          {/* Enhanced 3D Hero Icon */}
          <div className="relative mb-8 group">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl transform rotate-3 group-hover:rotate-6">
              <LuClock className="text-white text-5xl drop-shadow-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl blur-xl opacity-60 -z-10 group-hover:opacity-80 transition-opacity duration-500"></div>
            </div>
            {/* 3D depth shadow */}
            <div className="absolute top-2 left-2 w-32 h-32 bg-gradient-to-br from-blue-800 to-purple-900 rounded-3xl opacity-30 -z-20 transform rotate-3"></div>
          </div>

          <h2 className="text-4xl py-1 md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 drop-shadow-sm">
            Simple Time Tracking for Modern Teams
          </h2>
          <p className="text-xl max-w-2xl mb-10 text-gray-600 dark:text-gray-300 leading-relaxed">
            Track employee hours, manage projects, and create accurate reports with our easy-to-use timekeeping system.
          </p>
          <div className="flex justify-center">
            <Link
              href="/signup"
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-2xl px-8 py-4 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300">
              Key Features
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Powerful tools designed to streamline your time tracking and boost productivity
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/20 dark:border-gray-600/30 hover:border-blue-200/50 dark:hover:border-blue-600/50 relative z-30">              {/* Enhanced 3D Icon Container */}
              <div className="relative w-20 h-20 mb-6 group-hover:scale-110 transition-all duration-500">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 group-hover:rotate-6">
                  <LuClock className="text-white text-3xl drop-shadow-lg" />
                </div>
                <div className="absolute top-1 left-1 w-full h-full bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl opacity-40 -z-10 transform rotate-3"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl blur-lg opacity-30 -z-20 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Time Tracking</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Easy clock-in/out with our intuitive interface and real-time tracking.</p>
            </div>
            <div className="group bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/20 dark:border-gray-600/30 hover:border-purple-200/50 dark:hover:border-purple-600/50 relative z-30">
              <div className="relative w-20 h-20 mb-6 group-hover:scale-110 transition-all duration-500">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-3 group-hover:-rotate-6">
                  <LuUserCheck className="text-white text-3xl drop-shadow-lg" />
                </div>
                <div className="absolute top-1 left-1 w-full h-full bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl opacity-40 -z-10 transform -rotate-3"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl blur-lg opacity-30 -z-20 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Attendance Management</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Track employee attendance and manage time-off requests seamlessly.</p>
            </div>
            <div className="group bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/20 dark:border-gray-600/30 hover:border-green-200/50 dark:hover:border-green-600/50 relative z-30">
              <div className="relative w-20 h-20 mb-6 group-hover:scale-110 transition-all duration-500">
                <div className="w-full h-full bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-2 group-hover:rotate-4">
                  <LuTrendingUp className="text-white text-3xl drop-shadow-lg" />
                </div>
                <div className="absolute top-1 left-1 w-full h-full bg-gradient-to-br from-green-700 to-emerald-900 rounded-2xl opacity-40 -z-10 transform rotate-2"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl blur-lg opacity-30 -z-20 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Advanced Reporting</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Generate detailed reports on employee hours and project analytics.</p>
            </div>
            <div className="group bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/20 dark:border-gray-600/30 hover:border-orange-200/50 dark:hover:border-orange-600/50 relative z-30">
              <div className="relative w-20 h-20 mb-6 group-hover:scale-110 transition-all duration-500">
                <div className="w-full h-full bg-gradient-to-br from-orange-500 via-amber-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-2 group-hover:-rotate-4">
                  <LuCalendarDays className="text-white text-3xl drop-shadow-lg" />
                </div>
                <div className="absolute top-1 left-1 w-full h-full bg-gradient-to-br from-orange-700 to-amber-900 rounded-2xl opacity-40 -z-10 transform -rotate-2"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-600 rounded-2xl blur-lg opacity-30 -z-20 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Smart Scheduling</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Create and manage employee schedules with intelligent automation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 bg-white dark:bg-gray-800 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-gray-200 dark:border-gray-600 rounded-full opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300">
              How It Works
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="relative mb-8">
                {/* Enhanced 3D Step Number */}
                <div className="relative w-28 h-28 mx-auto">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl group-hover:scale-110 transition-all duration-500 transform rotate-3 group-hover:rotate-6">
                    1
                  </div>
                  {/* 3D depth shadow */}
                  <div className="absolute top-2 left-2 w-full h-full bg-gradient-to-br from-blue-700 to-blue-900 rounded-full opacity-40 -z-10 transform rotate-3"></div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-xl opacity-30 -z-20 group-hover:opacity-50 transition-opacity duration-500"></div>
                </div>
                {/* Floating decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse animation-delay-1000"></div>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Sign Up</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                Create an account for your organization and invite your team members with just a few clicks.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="relative w-28 h-28 mx-auto">
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl group-hover:scale-110 transition-all duration-500 transform -rotate-3 group-hover:-rotate-6">
                    2
                  </div>
                  <div className="absolute top-2 left-2 w-full h-full bg-gradient-to-br from-purple-700 to-purple-900 rounded-full opacity-40 -z-10 transform -rotate-3"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full blur-xl opacity-30 -z-20 group-hover:opacity-50 transition-opacity duration-500"></div>
                </div>
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-pulse animation-delay-2000"></div>
                <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse animation-delay-3000"></div>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Track Time</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                Employees clock in and out effortlessly with our intuitive interface on any device, anywhere.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="relative w-28 h-28 mx-auto">
                  <div className="w-full h-full bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl group-hover:scale-110 transition-all duration-500 transform rotate-2 group-hover:rotate-4">
                    3
                  </div>
                  <div className="absolute top-2 left-2 w-full h-full bg-gradient-to-br from-green-700 to-emerald-900 rounded-full opacity-40 -z-10 transform rotate-2"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full blur-xl opacity-30 -z-20 group-hover:opacity-50 transition-opacity duration-500"></div>
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-pulse animation-delay-4000"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Generate Reports</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                Get powerful insights with detailed reports on hours, attendance, and project analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative py-20 bg-gray-50 dark:bg-gray-700 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-blue-200 dark:bg-blue-800 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full opacity-10 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300">
              Trusted by Teams Worldwide
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how WorkTally is transforming productivity across industries
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-500 transform rotate-3 group-hover:rotate-6">
                  <span className="text-3xl font-bold text-white">10K+</span>
                </div>
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl opacity-40 -z-10 rotate-3"></div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Active Users</h4>
              <p className="text-gray-600 dark:text-gray-300">Teams using WorkTally daily</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-500 transform -rotate-3 group-hover:-rotate-6">
                  <span className="text-3xl font-bold text-white">95%</span>
                </div>
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-green-700 to-emerald-800 rounded-2xl opacity-40 -z-10 -rotate-3"></div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Accuracy Rate</h4>
              <p className="text-gray-600 dark:text-gray-300">Time tracking precision</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-500 transform rotate-2 group-hover:rotate-4">
                  <span className="text-3xl font-bold text-white">30%</span>
                </div>
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-purple-700 to-purple-800 rounded-2xl opacity-40 -z-10 rotate-2"></div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Time Saved</h4>
              <p className="text-gray-600 dark:text-gray-300">On administrative tasks</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-500 transform -rotate-2 group-hover:-rotate-4">
                  <span className="text-3xl font-bold text-white">24/7</span>
                </div>
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-orange-700 to-amber-800 rounded-2xl opacity-40 -z-10 -rotate-2"></div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Support</h4>
              <p className="text-gray-600 dark:text-gray-300">Always here to help</p>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-600/30 group hover:shadow-2xl transition-all duration-500 relative z-30">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <LuRocket className="text-white text-2xl" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Increase Productivity</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Streamline workflows and eliminate time-wasting activities with intelligent automation and real-time insights.
              </p>
            </div>            <div className="bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-600/30 group hover:shadow-2xl transition-all duration-500 relative z-30">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <LuDollarSign className="text-white text-2xl" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Reduce Costs</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Cut administrative overhead by 30% with automated reporting and streamlined payroll processing.
              </p>
            </div>            <div className="bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-600/30 group hover:shadow-2xl transition-all duration-500 relative z-30">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <LuShield className="text-white text-2xl" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Improve Accuracy</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Eliminate manual errors with automated time capture and GPS-enabled location verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 bg-white dark:bg-gray-800 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-200 dark:bg-purple-800 rounded-full opacity-10 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-gray-200 dark:border-gray-600 rounded-full opacity-5"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300">
              What Our Users Say
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real feedback from teams who transformed their productivity with WorkTally
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Testimonial 1 */}
            <div className="group bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/20 dark:border-gray-600/30 relative z-30">
              <div className="flex items-center mb-6">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                &quot;WorkTally completely transformed how we manage our team&apos;s time. The automated reporting saves us hours every week, and the accuracy is incredible.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-sm">SJ</span>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">HR Director, TechCorp</p>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="group bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/20 dark:border-gray-600/30 relative z-30">
              <div className="flex items-center mb-6">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                &quot;As a project manager, I love how easy it is to track time across multiple projects. The insights help us optimize our workflows and meet deadlines.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-sm">MC</span>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white">Mike Chen</h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Project Manager, Design Studio</p>
                </div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="group bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/20 dark:border-gray-600/30 relative z-30">
              <div className="flex items-center mb-6">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                &quot;The mobile app is fantastic! Our field team can clock in from anywhere, and I get real-time updates. It&apos;s made managing remote work so much easier.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-sm">ER</span>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white">Emily Rodriguez</h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Operations Manager, FieldWork Inc</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Logos */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">Trusted by leading companies</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-6 py-3 font-bold text-gray-600 dark:text-gray-300">TechCorp</div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-6 py-3 font-bold text-gray-600 dark:text-gray-300">Design Studio</div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-6 py-3 font-bold text-gray-600 dark:text-gray-300">FieldWork Inc</div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-6 py-3 font-bold text-gray-600 dark:text-gray-300">BuildCo</div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-6 py-3 font-bold text-gray-600 dark:text-gray-300">StartupX</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-blue-700 dark:via-purple-700 dark:to-blue-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5 z-0">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cta-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <polygon points="10,0 20,10 10,20 0,10" fill="currentColor" opacity="0.1" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#cta-pattern)" />
            </svg>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none z-5">
          <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white/20 dark:border-white/10 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 border-2 border-white/20 dark:border-white/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-white/10 dark:bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-white/10 dark:bg-white/5 rounded-full animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl md:text-6xl font-bold mb-8 text-white dark:text-gray-100 leading-tight">
              Ready to Streamline Your
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300 dark:from-yellow-200 dark:to-orange-200">
                Timekeeping?
              </span>
            </h3>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 dark:text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Join thousands of companies that trust WorkTally for their time tracking needs.
              Transform your productivity today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/signup"
                className="group relative bg-white hover:bg-gray-50 dark:bg-gray-100 dark:hover:bg-gray-200 text-blue-600 dark:text-blue-700 font-bold rounded-2xl px-10 py-5 text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl overflow-hidden"
              >
                <span className="relative z-10">Get Started Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 dark:from-yellow-200 dark:to-orange-200 opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-300"></div>
              </Link>

              <div className="flex items-center text-white/80 dark:text-white/70 text-sm">
                <div className="flex -space-x-2 mr-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 dark:from-yellow-300 dark:to-orange-300 rounded-full border-2 border-white dark:border-gray-200"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-400 dark:from-green-300 dark:to-blue-300 rounded-full border-2 border-white dark:border-gray-200"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-300 dark:to-pink-300 rounded-full border-2 border-white dark:border-gray-200"></div>
                  <div className="w-8 h-8 bg-white/20 dark:bg-white/30 rounded-full border-2 border-white dark:border-gray-200 flex items-center justify-center text-xs font-bold">+</div>
                </div>
                <span>Trusted by 10,000+ teams</span>
              </div>
            </div>

            <div className="mt-12 flex justify-center items-center space-x-8 text-white/60 dark:text-white/50 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Secure & Reliable
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Full Access
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-white dark:text-gray-100 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="footer-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.3" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#footer-pattern)" />
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-10">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-12">
            {/* Company Info */}
            <div className="sm:col-span-2">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-4 mb-6 group">
                <div className="relative">
                  {/* Enhanced 3D Logo */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl transform rotate-3 group-hover:rotate-6">
                    <LuClock className="text-white text-xl drop-shadow-lg" />
                  </div>
                  {/* 3D depth shadow */}
                  <div className="absolute top-1 left-1 w-12 h-12 bg-gradient-to-br from-blue-800 to-purple-800 rounded-2xl opacity-40 -z-10 transform rotate-3"></div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-20"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 drop-shadow-sm">
                    WorkTally
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Smart Time Tracker</p>
                </div>
              </Link>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-md">
                Empowering teams worldwide with intelligent time tracking solutions. Boost productivity and streamline your workflow with our cutting-edge platform.
              </p>
              <div className="flex space-x-3">
                {[LuTwitter, LuLinkedin, LuGithub].map((Icon, idx) => (
                  <Link key={idx} href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    <Icon className="text-lg" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-3 text-sm">
                {[
                  ['#features', 'Features'],
                  ['#how-it-works', 'How It Works'],
                  ['#integrations', 'Integrations'],
                  ['#api', 'API Docs'],
                  ['#security', 'Security'],
                ].map(([href, label], idx) => (
                  <li key={idx}>
                    <Link href={href} className="text-gray-400 hover:text-white flex items-center group transition">
                      <span className="w-1 h-1 bg-blue-500 rounded-full mr-3 group-hover:w-2 transition-all"></span>{label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-3 text-sm">
                {[
                  ['#about', 'About Us'],
                  ['#careers', 'Careers'],
                  ['#blog', 'Blog'],
                  ['#contact', 'Contact'],
                  ['#press', 'Press Kit'],
                ].map(([href, label], idx) => (
                  <li key={idx}>
                    <Link href={href} className="text-gray-400 hover:text-white flex items-center group transition">
                      <span className="w-1 h-1 bg-purple-500 rounded-full mr-3 group-hover:w-2 transition-all"></span>{label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-6 md:p-8 mb-12 border border-white/10">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-xl md:text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Stay Updated
              </h3>
              <p className="text-gray-300 text-sm md:text-base mb-6">
                Get the latest updates on new features, tips, and productivity insights delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl transition-transform duration-300 hover:scale-105 shadow-lg text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-700/50 pt-6 flex flex-col gap-4 sm:flex-row sm:justify-between text-xs md:text-sm text-gray-400">
            <div className="text-center sm:text-left">
              <p>&copy; {new Date().getFullYear()} WorkTally. All rights reserved.</p>
            </div>
            <div className="flex justify-center sm:justify-end gap-4">
              <Link href="#privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="#terms" className="hover:text-white">Terms</Link>
              <Link href="#cookies" className="hover:text-white">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
