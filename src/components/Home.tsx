"use client";

import { useState, useEffect } from 'react';
import { Store, Stethoscope, Plane, ShoppingBasket, Zap, Globe, Shield, BarChart3, Users, CreditCard, Smartphone, Cloud, Lock, ArrowRight, CheckCircle, TrendingUp, Server, Cpu, ShieldCheck, Database } from 'lucide-react';
import { useTheme } from 'next-themes';

const Home = () => {

  const { theme, resolvedTheme } = useTheme();
  const [activeFeature, setActiveFeature] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use resolvedTheme which accounts for 'system' preference
  const darkMode = mounted && (resolvedTheme === 'dark' || theme === 'dark');

  // Business types with your specific focus
  const businessTypes = [
    {
      id: 1,
      name: "Clothing Store",
      category: "Fashion & Retail",
      icon: Store,
      stats: "2500+ Stores",
      features: ["Inventory Tracking", "Size Management", "Fashion Analytics", "Multi-Store Sync"],
      color: "from-blue-500 to-cyan-400"
    },
    {
      id: 2,
      name: "Telemedicine",
      category: "Healthcare",
      icon: Stethoscope,
      stats: "800+ Clinics",
      features: ["Video Consultation", "Digital Prescription", "Patient Management", "Appointment Scheduling"],
      color: "from-green-500 to-emerald-400"
    },
    {
      id: 3,
      name: "Travel Agency",
      category: "Tourism",
      icon: Plane,
      stats: "1200+ Agencies",
      features: ["Real-time Booking", "Multi-vendor System", "Travel Insurance", "Package Management"],
      color: "from-purple-500 to-pink-400"
    },
    {
      id: 4,
      name: "Grocery Store",
      category: "Retail & FMCG",
      icon: ShoppingBasket,
      stats: "3500+ Stores",
      features: ["Stock Alerts", "Express Checkout", "Home Delivery", "Supplier Management"],
      color: "from-orange-500 to-yellow-400"
    }
  ];

  // Core features
  const coreFeatures = [
    {
      icon: Globe,
      title: "Multi-Branch Management",
      description: "Manage unlimited branches from a single dashboard with real-time synchronization"
    },
    {
      icon: Cpu,
      title: "AI-Powered Analytics",
      description: "Predictive analytics and smart recommendations for business growth"
    },
    {
      icon: Server,
      title: "Cloud Infrastructure",
      description: "Scalable cloud infrastructure with 99.9% uptime guarantee"
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance with global security standards"
    },
    {
      icon: Database,
      title: "Unified Database",
      description: "Single source of truth across all business units and locations"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Role-based access control and real-time team collaboration tools"
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Alex Chen",
      role: "CEO, Urban Threads (Clothing Chain)",
      content: "Managing 12 clothing stores became effortless with this POS. Real-time inventory sync saved us 30% in stock management costs.",
      business: "Clothing"
    },
    {
      name: "Dr. Sarah Johnson",
      role: "Medical Director, HealthConnect Telemedicine",
      content: "The telemedicine module transformed our practice. Digital prescriptions and appointment scheduling improved patient satisfaction by 40%.",
      business: "Telemedicine"
    },
    {
      name: "Michael Rodriguez",
      role: "Owner, Global Travel Hub",
      content: "From ticket booking to package management, everything in one place. Our agency grew 200% in the first year.",
      business: "Travel"
    },
    {
      name: "Emma Wilson",
      role: "Operations Manager, FreshMart Grocery",
      content: "Stock management and supplier coordination became seamless. Reduced wastage by 25% with smart inventory alerts.",
      business: "Grocery"
    }
  ];

  // Stats
  const stats = [
    { value: "10,000+", label: "Active Businesses" },
    { value: "50,000+", label: "Daily Transactions" },
    { value: "$2B+", label: "Monthly Volume" },
    { value: "99.9%", label: "System Uptime" }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>

      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${darkMode ? '#ffffff' : '#000000'} 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">

        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-8">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">All-in-One Business Solution</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                <span className={`block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  One Platform,
                </span>
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Multiple Businesses
                </span>
              </h1>

              {/* Subheading */}
              <p className={`text-xl md:text-2xl mb-10 max-w-3xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Complete POS system for clothing stores, telemedicine, travel agencies, grocery stores, and more.
                Manage everything from a single dashboard.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                  <span className="flex items-center justify-center gap-2">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button className={`px-8 py-4 font-semibold rounded-xl border ${darkMode ? 'border-white/20 hover:bg-white/5' : 'border-gray-300 hover:bg-gray-50'} transition-all`}>
                  Schedule Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-3xl md:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Business Types Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Built for Every Business
              </h2>
              <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
                Specialized solutions for different industries, all powered by one robust platform
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {businessTypes.map((business) => {
                const Icon = business.icon;
                return (
                  <div
                    key={business.id}
                    className={`relative group overflow-hidden rounded-2xl p-8 ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} transition-all duration-300 hover:scale-[1.02]`}
                  >
                    {/* Background Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${business.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${business.color}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{business.name}</h3>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {business.category} • {business.stats}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Features List */}
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-3">
                          {business.features.map((feature, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-white'}`}
                            >
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* View Details Button */}
                      <button className={`w-full py-3 rounded-lg font-medium ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'} transition-colors flex items-center justify-center gap-2`}>
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={`py-20 ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Enterprise-Grade Features
              </h2>
              <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
                Everything you need to scale your business, built into one platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} transition-all hover:scale-105 cursor-pointer`}
                    onMouseEnter={() => setActiveFeature(index)}
                  >
                    <div className={`p-3 rounded-xl w-fit mb-4 ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Feature Details Panel */}
            <div className={`mt-12 rounded-2xl p-8 ${darkMode ? 'bg-white/5' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">{coreFeatures[activeFeature].title}</h3>
                  <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {coreFeatures[activeFeature].description}
                  </p>
                  <ul className="space-y-3">
                    {[1, 2, 3, 4].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Feature benefit {item} for {coreFeatures[activeFeature].title.toLowerCase()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`rounded-xl p-8 ${darkMode ? 'bg-white/10' : 'bg-gray-100'} flex items-center justify-center`}>
                  <div className="text-center">
                    <div className={`text-6xl font-bold mb-4 ${darkMode ? 'text-white/20' : 'text-gray-300'}`}>
                      {activeFeature + 1}
                    </div>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Interactive demo available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Trusted by Industry Leaders
              </h2>
              <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
                See how businesses in your industry are transforming with our platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} transition-all`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-white/10' : 'bg-gray-200'} flex items-center justify-center`}>
                      <span className="font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className={`mb-4 italic ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    "{testimonial.content}"
                  </p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                    <TrendingUp className="w-4 h-4" />
                    {testimonial.business} Business
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`rounded-3xl p-8 md:p-12 text-center ${darkMode ? 'bg-gradient-to-br from-white/5 to-white/10' : 'bg-gradient-to-br from-gray-50 to-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="max-w-3xl mx-auto">
                <Lock className={`w-16 h-16 mx-auto mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Transform Your Business?
                </h2>
                <p className={`text-xl mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Join thousands of businesses already using our platform.
                  Start your free trial today - no credit card required.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                    <span className="flex items-center justify-center gap-2">
                      Start 30-Day Free Trial
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <button className={`px-8 py-4 font-semibold rounded-xl border ${darkMode ? 'border-white/20 hover:bg-white/5' : 'border-gray-300 hover:bg-gray-50'} transition-all`}>
                    Book Enterprise Demo
                  </button>
                </div>
                <div className={`mt-8 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  No setup fees • 24/7 Support • 30-day money-back guarantee
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
