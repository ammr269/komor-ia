'use client'

import {
  MessageSquare,
  Brain,
  BarChart3,
  TrendingUp,
  Zap,
  Bot,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const menuItems = [
  { id: 'K-MIA', label: 'Press-AI', icon: MessageSquare },
  { id: 'chatBot', label: 'Wazir', icon: Bot },
  { id: 'accueil', label: 'Accueil', icon: Bot },
  { id: 'summary', label: 'Summary', icon: Bot },
  // { id: 'SVM', label: 'SVM', icon: Brain },
  // { id: 'Random Forest', label: 'Random Forest', icon: BarChart3 },
  // {
  //   id: 'Régression Logistique',
  //   label: 'Régression Logistique',
  //   icon: TrendingUp,
  // },
  // { id: 'XGBoost', label: 'XGBoost', icon: Zap },
]

export default function Sidebar({ activeSection, setActiveSection, isMobile }) {
  return (
    <div
      id="sidebar"
      className={`
        bg-white border-r border-gray-200 h-screen
        ${isMobile ? 'w-80' : 'w-64'}
        flex flex-col shadow-lg lg:shadow-none
      `}
    >
      {/* Sidebar Header */}
      <Link href="/">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {/* <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div> */}
            <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center">
              <Image
                src="/logo3.svg"
                alt="Logo"
                width={35}
                height={35}
                color="black"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Komor-IA</h2>
              <p className="text-sm text-gray-500">Comoros AI Startup</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="mb-4">
          <div className="space-y-3">
            <h3 className=" text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Models
            </h3>
          </div>
          <div className="space-y-4">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              const isActive = activeSection === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left
                    transition-all duration-200 ease-in-out
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <IconComponent
                    className={`w-5 h-5 ${
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  />
                  <span className="font-medium truncate">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">AI</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              AI Assistant
            </p>
            <p className="text-xs text-gray-500 truncate">Ready to help</p>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full" />
        </div>
      </div>
    </div>
  )
}
