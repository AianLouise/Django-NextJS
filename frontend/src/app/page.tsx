import Image from "next/image";
import Link from "next/link";
import { FaClock, FaUserCheck, FaChartLine, FaCalendarAlt } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header / Navigation */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaClock className="text-blue-600 dark:text-blue-400 text-2xl" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">TimeTrack</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#features" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">How It Works</a></li>
              <li><Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">Login</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Simple Time Tracking for Modern Teams
          </h2>
          <p className="text-xl max-w-2xl mb-10 text-gray-600 dark:text-gray-300">
            Track employee hours, manage projects, and create accurate reports with our easy-to-use timekeeping system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/signup" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-3 transition-colors"
            >
              Get Started Free
            </Link>
            <Link 
              href="/demo" 
              className="bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 font-medium rounded-lg px-6 py-3 transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Key Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
              <FaClock className="text-blue-600 dark:text-blue-400 text-3xl mb-4" />
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Time Tracking</h4>
              <p className="text-gray-600 dark:text-gray-300">Easy clock-in/out with our intuitive interface.</p>
            </div>
            <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
              <FaUserCheck className="text-blue-600 dark:text-blue-400 text-3xl mb-4" />
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Attendance Management</h4>
              <p className="text-gray-600 dark:text-gray-300">Track employee attendance and manage time-off requests.</p>
            </div>
            <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
              <FaChartLine className="text-blue-600 dark:text-blue-400 text-3xl mb-4" />
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Reporting</h4>
              <p className="text-gray-600 dark:text-gray-300">Generate detailed reports on employee hours and project time.</p>
            </div>
            <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
              <FaCalendarAlt className="text-blue-600 dark:text-blue-400 text-3xl mb-4" />
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Scheduling</h4>
              <p className="text-gray-600 dark:text-gray-300">Create and manage employee schedules with ease.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">1</div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Sign Up</h4>
              <p className="text-gray-600 dark:text-gray-300">Create an account for your organization and add your team members.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">2</div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Track Time</h4>
              <p className="text-gray-600 dark:text-gray-300">Employees clock in and out with our simple interface on any device.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">3</div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Generate Reports</h4>
              <p className="text-gray-600 dark:text-gray-300">Get insights with detailed reports on hours, attendance, and projects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6 text-white">Ready to Streamline Your Timekeeping?</h3>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of companies that trust TimeTrack for their time tracking needs.
          </p>
          <Link 
            href="/signup" 
            className="bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-lg px-6 py-3 transition-colors"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <FaClock className="text-blue-400 text-xl" />
              <h2 className="text-lg font-bold">TimeTrack</h2>
            </div>
            <div className="flex space-x-8">
              <div>
                <h4 className="font-semibold mb-3">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TimeTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
