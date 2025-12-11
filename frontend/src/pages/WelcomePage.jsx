import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Mail, Brain, TrendingUp, Zap, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Creation',
      description: 'Describe your needs in natural language, AI structures your RFP automatically',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Mail,
      title: 'Automated Email Workflow',
      description: 'Send RFPs via email, automatically receive and parse vendor responses',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Smart Comparison',
      description: 'AI scores and compares proposals, recommends the best vendor for you',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Vendor Management',
      description: 'Maintain vendor database, track history and ratings',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const steps = [
    { text: 'Describe your procurement needs', icon: FileText },
    { text: 'AI creates structured RFP', icon: Sparkles },
    { text: 'Send to selected vendors via email', icon: Mail },
    { text: 'Vendors reply with proposals', icon: Users },
    { text: 'AI parses and compares automatically', icon: Brain },
    { text: 'Get recommendation and decide', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Procurement</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            RFP Management
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Made Intelligent
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Transform messy procurement workflows into streamlined, AI-assisted processes. 
            Create RFPs in natural language, automate vendor communication, and get intelligent recommendations.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/rfps/new')}
              className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
            >
              Create Your First RFP
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate('/rfps')}
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all border-2 border-white/30"
            >
              View Dashboard
            </button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10x</div>
              <div className="text-blue-200">Faster Processing</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-200">Automated Parsing</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">AI</div>
              <div className="text-blue-200">Smart Recommendations</div>
            </div>
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.1"/>
            <path d="M0 120L60 112.5C120 105 240 90 360 82.5C480 75 600 75 720 78.75C840 82.5 960 90 1080 93.75C1200 97.5 1320 97.5 1380 97.5L1440 97.5V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Modern Procurement
          </h2>
          <p className="text-xl text-gray-600">
            Streamline your RFP workflow with intelligent automation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              From natural language to vendor selection in 6 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                      {idx + 1}
                    </div>
                    <step.icon className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-700 font-medium">{step.text}</p>
                </div>
                
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <Zap className="w-16 h-16 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Procurement?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start creating intelligent RFPs in seconds. No setup required, just describe what you need.
          </p>
          <button
            onClick={() => navigate('/rfps/new')}
            className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-2"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="w-6 h-6" />
            <span className="font-bold text-white text-lg">RFP Manager</span>
          </div>
          <p className="text-sm">
            AI-Powered Procurement Management System
          </p>
          <p className="text-xs mt-4">
            Built with React, Node.js, OpenAI, and MySQL
          </p>
        </div>
      </div>
    </div>
  );
}