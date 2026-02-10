'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Sidebar from './sidebar-new'
import HorizontalNavbar from './horizontal-navbar'
import HomePage from './home-page'
import ApiKeysPage from './api-keys-page'
import SummaryChatBot from './summury-bot'
import ChatBotInterface from './chat-bot-interface'

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleSectionChange = (section) => {
    setActiveSection(section)
    setIsMobileMenuOpen(false) // Fermer le menu mobile après sélection
  }

  // Fonction pour rendre le contenu basé sur la section active
  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <HomePage />

      case 'api-keys':
        return <ApiKeysPage />

      case 'model-press-ai':
        return <SummaryChatBot />

      case 'model-wazir':
        return <ChatBotInterface />

      case 'usage':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Utilisation des API</h2>
            <p className="text-gray-600">Page d'analytics à venir...</p>
          </div>
        )

      case 'docs':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Documentation</h2>
            <p className="text-gray-600">Documentation des API à venir...</p>
          </div>
        )

      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Paramètres</h2>
            <p className="text-gray-600">Page de paramètres à venir...</p>
          </div>
        )

      default:
        return <HomePage />
    }
  }

  return (
    <div className="flex w-full h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
        />
      </div>

      {/* Sidebar Mobile avec overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleMobileMenu}
          />
          {/* Sidebar */}
          <div className="md:hidden fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ease-in-out">
            <Sidebar
              activeSection={activeSection}
              setActiveSection={handleSectionChange}
              isMobile={true}
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar Horizontale - seulement si pas sur la page d'accueil */}
        {activeSection !== 'home' && (
          <HorizontalNavbar onMenuClick={toggleMobileMenu} />
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto">{renderContent()}</div>
      </div>
    </div>
  )
}
