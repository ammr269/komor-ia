'use client'

import { useState } from 'react'
import { Search, User, LogIn, Menu, X, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function HorizontalNavbar({ onMenuClick, showMenu = true }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Recherche:', searchQuery)
    }
  }

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo + Menu Mobile Button */}
          <div className="flex items-center space-x-4">
            {showMenu && (
              <button
                onClick={onMenuClick}
                className="md:hidden p-2.5 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
              </button>
            )}

            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl blur-sm opacity-50 group-hover:opacity-70 transition-opacity"></div> */}
                {/* <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/logo3.svg"
                    alt="Komor-IA Logo"
                    width={28}
                    height={28}
                    priority
                    className="filter brightness-0 invert"
                  />
                </div> */}
              </div>
              {/* <div className="hidden sm:block">
                <span className="text-2xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent tracking-tight">
                  Komor-IA
                </span>
                <div className="flex items-center space-x-1 -mt-1">
                  <span className="text-xs font-semibold text-blue-600">
                    AI Platform
                  </span>
                  <Sparkles className="w-3 h-3 text-yellow-500" />
                </div>
              </div> */}
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Rechercher..."
                    className={`
                      w-full pl-12 pr-4 py-3.5 border-2 rounded-2xl font-medium
                      focus:outline-none transition-all duration-300
                      ${
                        isSearchFocused
                          ? 'bg-white border-blue-500 shadow-lg shadow-blue-500/10'
                          : 'bg-gray-50/50 border-gray-200 hover:border-gray-300'
                      }
                    `}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {['Modèles', 'Tarifs', 'Docs'].map((item, i) => (
              <Link
                key={i}
                href={`/${item.toLowerCase()}`}
                className="px-4 py-2.5 text-sm font-bold text-gray-700 hover:text-blue-600 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
              >
                {item}
              </Link>
            ))}

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l-2 border-gray-200">
              <Link
                href="/login"
                className="flex items-center space-x-2 px-4 py-2.5 text-sm font-bold text-gray-700 hover:text-blue-600 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
              >
                <LogIn className="w-4 h-4" />
                <span>Connexion</span>
              </Link>
              <Link href="/signup" className="relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2 px-5 py-2.5 text-sm font-bold text-white">
                  <User className="w-4 h-4" />
                  <span>Inscription</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-200 animate-fadeIn">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 bg-gray-50/50 font-medium transition-all"
                />
              </div>
            </form>

            {/* Mobile Links */}
            <div className="space-y-2">
              {['Modèles', 'Tarifs', 'Documentation'].map((item, i) => (
                <Link
                  key={i}
                  href={`/${item.toLowerCase()}`}
                  className="block px-4 py-3.5 text-sm font-bold text-gray-700 hover:text-blue-600 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/login"
                  className="flex items-center justify-center space-x-2 px-4 py-3.5 text-sm font-bold text-gray-700 hover:text-blue-600 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Connexion</span>
                </Link>
                <Link
                  href="/signup"
                  className="relative group overflow-hidden block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl"></div>
                  <div className="relative flex items-center justify-center space-x-2 px-4 py-3.5 text-sm font-bold text-white">
                    <User className="w-4 h-4" />
                    <span>Inscription gratuite</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
