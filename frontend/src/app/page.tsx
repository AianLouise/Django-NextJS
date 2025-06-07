'use client';

import { useState } from 'react';
import Link from "next/link";
import { FaClock, FaUserCheck, FaChartLine, FaCalendarAlt, FaBars, FaGithub, FaTwitter, FaLinkedin, FaTimes } from "react-icons/fa";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                {/* Enhanced 3D Logo */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl transform rotate-3 group-hover:rotate-6">
                  <FaClock className="text-white text-xl drop-shadow-lg" />
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
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Smart Time Management</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <Link
                  href="#features"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  Features
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  How It Works
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link
                  href="#pricing"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  Pricing
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </div>              <div className="flex items-center space-x-3">
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
                <FaTimes className="text-gray-600 dark:text-gray-300 text-xl" />
              ) : (
                <FaBars className="text-gray-600 dark:text-gray-300 text-xl" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-4 pt-2 mt-4 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="#features"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  href="#pricing"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Pricing
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
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background Design Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Enhanced 3D Gradient Circles */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 dark:from-blue-600 dark:via-blue-700 dark:to-cyan-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-blob shadow-2xl"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500 dark:from-purple-600 dark:via-purple-700 dark:to-pink-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-blob animation-delay-2000 shadow-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-pink-400 via-rose-500 to-orange-500 dark:from-pink-600 dark:via-rose-700 dark:to-orange-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-blob animation-delay-4000 shadow-2xl"></div>
        </div>

        <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
          {/* Enhanced 3D Hero Icon */}
          <div className="relative mb-8 group">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl transform rotate-3 group-hover:rotate-6">
              <FaClock className="text-white text-5xl drop-shadow-lg" />
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
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-2xl px-8 py-4 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
            >
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              href="/demo"
              className="group relative bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-gray-700/90 dark:hover:bg-gray-600 text-gray-800 dark:text-white border-2 border-gray-200/50 dark:border-gray-600/50 font-medium rounded-2xl px-8 py-4 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <span className="relative z-10">View Demo</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-600 dark:to-gray-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg className="w-full h-full" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="features-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="30" cy="30" r="1.5" fill="currentColor" opacity="0.5" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#features-pattern)" />
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300">
              Key Features
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Powerful tools designed to streamline your time tracking and boost productivity
            </p>
          </div>          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/20 dark:border-gray-600/30 hover:border-blue-200/50 dark:hover:border-blue-600/50">
              {/* Enhanced 3D Icon Container */}
              <div className="relative w-20 h-20 mb-6 group-hover:scale-110 transition-all duration-500">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 group-hover:rotate-6">
                  <FaClock className="text-white text-3xl drop-shadow-lg" />
                </div>
                {/* 3D depth effect */}
                <div className="absolute top-1 left-1 w-full h-full bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl opacity-40 -z-10 transform rotate-3"></div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl blur-lg opacity-30 -z-20 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Time Tracking</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Easy clock-in/out with our intuitive interface and real-time tracking.</p>
            </div>

            <div className="group bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/20 dark:border-gray-600/30 hover:border-purple-200/50 dark:hover:border-purple-600/50">
              <div className="relative w-20 h-20 mb-6 group-hover:scale-110 transition-all duration-500">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-3 group-hover:-rotate-6">
                  <FaUserCheck className="text-white text-3xl drop-shadow-lg" />
                </div>
                <div className="absolute top-1 left-1 w-full h-full bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl opacity-40 -z-10 transform -rotate-3"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl blur-lg opacity-30 -z-20 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Attendance Management</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Track employee attendance and manage time-off requests seamlessly.</p>
            </div>

            <div className="group bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/20 dark:border-gray-600/30 hover:border-green-200/50 dark:hover:border-green-600/50">
              <div className="relative w-20 h-20 mb-6 group-hover:scale-110 transition-all duration-500">
                <div className="w-full h-full bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-2 group-hover:rotate-4">
                  <FaChartLine className="text-white text-3xl drop-shadow-lg" />
                </div>
                <div className="absolute top-1 left-1 w-full h-full bg-gradient-to-br from-green-700 to-emerald-900 rounded-2xl opacity-40 -z-10 transform rotate-2"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl blur-lg opacity-30 -z-20 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Advanced Reporting</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Generate detailed reports on employee hours and project analytics.</p>
            </div>

            <div className="group bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/20 dark:border-gray-600/30 hover:border-orange-200/50 dark:hover:border-orange-600/50">
              <div className="relative w-20 h-20 mb-6 group-hover:scale-110 transition-all duration-500">
                <div className="w-full h-full bg-gradient-to-br from-orange-500 via-amber-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-2 group-hover:-rotate-4">
                  <FaCalendarAlt className="text-white text-3xl drop-shadow-lg" />
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
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-gray-200 dark:border-gray-600 rounded-full opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
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

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300">
              Simple, Transparent Pricing
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the perfect plan for your team size and needs. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700 relative group hover:scale-105">
              <div className="text-center">
                <h4 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Starter</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Perfect for small teams</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">$9</span>
                  <span className="text-gray-600 dark:text-gray-300">/user/month</span>
                </div>
                <div className="space-y-4 mb-8 text-left">
                  <div className="flex items-center">
                    <FaUserCheck className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Up to 10 team members</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Basic time tracking</span>
                  </div>
                  <div className="flex items-center">
                    <FaChartLine className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Standard reports</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Email support</span>
                  </div>
                </div>
                <Link
                  href="/signup"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 inline-block text-center group-hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-blue-500 relative group hover:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h4 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Professional</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-6">For growing businesses</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">$19</span>
                  <span className="text-gray-600 dark:text-gray-300">/user/month</span>
                </div>
                <div className="space-y-4 mb-8 text-left">
                  <div className="flex items-center">
                    <FaUserCheck className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Up to 50 team members</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Advanced time tracking</span>
                  </div>
                  <div className="flex items-center">
                    <FaChartLine className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Advanced analytics</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Project management</span>
                  </div>
                  <div className="flex items-center">
                    <FaUserCheck className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Priority support</span>
                  </div>
                </div>
                <Link
                  href="/signup"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 inline-block text-center group-hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700 relative group hover:scale-105">
              <div className="text-center">
                <h4 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Enterprise</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-6">For large organizations</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">$39</span>
                  <span className="text-gray-600 dark:text-gray-300">/user/month</span>
                </div>
                <div className="space-y-4 mb-8 text-left">
                  <div className="flex items-center">
                    <FaUserCheck className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Unlimited team members</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Enterprise time tracking</span>
                  </div>
                  <div className="flex items-center">
                    <FaChartLine className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Custom reports & API</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Advanced integrations</span>
                  </div>
                  <div className="flex items-center">
                    <FaUserCheck className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">24/7 dedicated support</span>
                  </div>
                </div>
                <Link
                  href="/signup"
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 inline-block text-center group-hover:scale-105"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="text-center mt-16 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">All Plans Include</h4>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="flex items-center">
                  <FaUserCheck className="text-blue-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">14-day free trial</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-blue-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Mobile apps</span>
                </div>
                <div className="flex items-center">
                  <FaChartLine className="text-blue-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Data export</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-blue-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">SSL security</span>
                </div>
                <div className="flex items-center">
                  <FaUserCheck className="text-blue-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Regular backups</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-blue-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">No setup fees</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-blue-700 dark:via-purple-700 dark:to-blue-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
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
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white/20 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 border-2 border-white/20 rounded-full animate-bounce"></div>
          <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-white/10 rounded-full animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">
              Ready to Streamline Your
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">
                Timekeeping?
              </span>
            </h3>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join thousands of companies that trust WorkTally for their time tracking needs.
              Start your journey to better productivity today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/signup"
                className="group relative bg-white hover:bg-gray-50 text-blue-600 font-bold rounded-2xl px-10 py-5 text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl overflow-hidden"
              >
                <span className="relative z-10">Start Your Free Trial</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>

              <div className="flex items-center text-white/80 text-sm">
                <div className="flex -space-x-2 mr-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold">+</div>
                </div>
                <span>Trusted by 10,000+ teams</span>
              </div>
            </div>

            <div className="mt-12 flex justify-center items-center space-x-8 text-white/60 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                14-day free trial
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
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
              <Link href="/" className="flex items-center space-x-4 mb-6 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FaClock className="text-white text-xl" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">WorkTally</h2>
                  <p className="text-sm text-gray-400 -mt-1">Smart Time Management</p>
                </div>
              </Link>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-md">
                Empowering teams worldwide with intelligent time tracking solutions. Boost productivity and streamline your workflow with our cutting-edge platform.
              </p>
              <div className="flex space-x-3">
                {[FaTwitter, FaLinkedin, FaGithub].map((Icon, idx) => (
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
                  ['#pricing', 'Pricing'],
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
            <div className="text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-4">
              <p>&copy; {new Date().getFullYear()} WorkTally. All rights reserved.</p>
              <div className="flex justify-center sm:justify-start gap-4">
                <Link href="#privacy" className="hover:text-white">Privacy Policy</Link>
                <Link href="#terms" className="hover:text-white">Terms</Link>
                <Link href="#cookies" className="hover:text-white">Cookies</Link>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-2 sm:gap-4 text-center">
              <span>Made with ❤️ for productivity</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
