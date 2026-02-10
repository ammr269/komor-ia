'use client'

import {
  ArrowRight,
  Brain,
  Zap,
  BarChart3,
  Code,
  Star,
  Users,
  Globe,
  Shield,
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-violet-600" />
              <span className="text-2xl font-bold text-gray-900">Komor-IA</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#about"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                About
              </a>
              <a
                href="#solutions"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Solutions
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
              </a>
              <button className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent tracking-tight">
              Komor-IA
            </h1>

            <p className="text-2xl lg:text-3xl mb-6 text-blue-100 font-medium max-w-3xl mx-auto">
              Empowering the Future with Artificial Intelligence
            </p>

            <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto italic">
              Nous concevons des solutions d’intelligence artificielle
              innovantes pour propulser votre entreprise vers l’avenir.
            </p>

            <p className="text-base text-gray-400 max-w-xl mx-auto mb-12">
              We build cutting-edge AI solutions that transform businesses and
              drive innovation across industries.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-md">
                Request a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-md">
                Contact Us
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              About Komor-IA
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are a forward-thinking AI startup dedicated to developing
              innovative artificial intelligence solutions that solve real-world
              problems and create meaningful impact for businesses and society.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Innovation First
              </h3>
              <p className="text-gray-600">
                We push the boundaries of what's possible with AI, constantly
                exploring new frontiers in machine learning and automation.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Human-Centered
              </h3>
              <p className="text-gray-600">
                Our AI solutions are designed to augment human capabilities,
                making technology more accessible and beneficial for everyone.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ethical AI
              </h3>
              <p className="text-gray-600">
                We prioritize responsible AI development, ensuring our solutions
                are transparent, fair, and aligned with human values.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our comprehensive suite of AI-powered solutions designed
              to transform your business operations.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-8 rounded-xl border border-violet-100 hover:shadow-lg transition-all">
              <div className="bg-violet-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Generative AI
              </h3>
              <p className="text-gray-600 mb-4">
                Create content, generate insights, and automate creative
                processes with our advanced generative AI models.
              </p>
              <a
                href="#"
                className="text-violet-600 font-semibold hover:text-violet-700 flex items-center"
              >
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl border border-blue-100 hover:shadow-lg transition-all">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Automation
              </h3>
              <p className="text-gray-600 mb-4">
                Streamline workflows and eliminate repetitive tasks with
                intelligent automation solutions.
              </p>
              <a
                href="#"
                className="text-blue-600 font-semibold hover:text-blue-700 flex items-center"
              >
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border border-green-100 hover:shadow-lg transition-all">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Data Analytics
              </h3>
              <p className="text-gray-600 mb-4">
                Transform raw data into actionable insights with our powerful
                AI-driven analytics platform.
              </p>
              <a
                href="#"
                className="text-green-600 font-semibold hover:text-green-700 flex items-center"
              >
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-xl border border-orange-100 hover:shadow-lg transition-all">
              <div className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Custom AI Development
              </h3>
              <p className="text-gray-600 mb-4">
                Tailored AI solutions built specifically for your unique
                business requirements and challenges.
              </p>
              <a
                href="#"
                className="text-orange-600 font-semibold hover:text-orange-700 flex items-center"
              >
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Trusted by Industry Leaders
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              <div className="flex items-center justify-center">
                <Globe className="h-12 w-12 text-gray-400" />
                <span className="ml-2 text-xl font-bold text-gray-400">
                  TechCorp
                </span>
              </div>
              <div className="flex items-center justify-center">
                <Brain className="h-12 w-12 text-gray-400" />
                <span className="ml-2 text-xl font-bold text-gray-400">
                  InnovateLab
                </span>
              </div>
              <div className="flex items-center justify-center">
                <Zap className="h-12 w-12 text-gray-400" />
                <span className="ml-2 text-xl font-bold text-gray-400">
                  FutureAI
                </span>
              </div>
              <div className="flex items-center justify-center">
                <BarChart3 className="h-12 w-12 text-gray-400" />
                <span className="ml-2 text-xl font-bold text-gray-400">
                  DataFlow
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-6 w-6 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <blockquote className="text-xl text-gray-700 text-center mb-6">
              "Komor-IA's AI solutions have transformed our business operations,
              increasing efficiency by 40% and enabling us to make data-driven
              decisions faster than ever before."
            </blockquote>
            <div className="text-center">
              <p className="font-semibold text-gray-900">Sarah Johnson</p>
              <p className="text-gray-600">CTO, TechCorp Industries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Brain className="h-8 w-8 text-violet-400" />
                <span className="text-2xl font-bold tracking-tight">
                  Komor-IA
                </span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md leading-relaxed">
                Propulsé par l’innovation, Komor-IA conçoit des solutions
                d’intelligence artificielle au service de la transformation
                digitale des entreprises.
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Empowering the future with artificial intelligence.
              </p>
              <div className="flex space-x-4 mt-4">
                {[Globe, Users, Brain].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-violet-600 transition-colors duration-300 cursor-pointer"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                Solutions
              </h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Génération de contenu (IA)
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Automatisation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Analyse de données
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Développements sur-mesure
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  Email :
                  <a
                    href="mailto:hello@komor-ia.com"
                    className="hover:text-white ml-1"
                  >
                    hello@komor-ia.com
                  </a>
                </li>
                <li>Téléphone : +1 (555) 123-4567</li>
                <li>Adresse : San Francisco, CA</li>
                <li>
                  <button className="mt-4 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition duration-300 shadow-sm">
                    Nous contacter
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-500 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Komor-IA. Tous droits réservés.
              Créons ensemble l’IA de demain.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
