'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  Brain,
  FileText,
  Key,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
} from 'lucide-react'

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalModels: 0,
    totalArticles: 0,
    totalApiKeys: 0,
    pendingTranslations: 0,
    completedTranslations: 0,
    totalRequests: 0,
    activeUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Utilisateurs',
      value: stats.totalUsers,
      icon: Users,
      color: 'blue',
      change: '+12%',
    },
    {
      title: 'Modèles IA',
      value: stats.totalModels,
      icon: Brain,
      color: 'purple',
      change: '+2',
    },
    {
      title: 'Articles',
      value: stats.totalArticles,
      icon: FileText,
      color: 'green',
      change: '+15',
    },
    {
      title: 'Clés API',
      value: stats.totalApiKeys,
      icon: Key,
      color: 'orange',
      change: '+8',
    },
    {
      title: 'Traductions en attente',
      value: stats.pendingTranslations,
      icon: Clock,
      color: 'yellow',
    },
    {
      title: 'Traductions complétées',
      value: stats.completedTranslations,
      icon: CheckCircle,
      color: 'teal',
    },
    {
      title: 'Requêtes API (7j)',
      value: stats.totalRequests,
      icon: Activity,
      color: 'indigo',
      change: '+156%',
    },
    {
      title: 'Utilisateurs actifs',
      value: stats.activeUsers,
      icon: TrendingUp,
      color: 'pink',
    },
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      teal: 'bg-teal-100 text-teal-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      pink: 'bg-pink-100 text-pink-600',
    }
    return colors[color] || colors.blue
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord administrateur
        </h1>
        <p className="text-gray-600 mt-2">
          Vue d'ensemble de la plateforme Komor-IA
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(card.color)}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                {card.change && (
                  <span className="text-sm font-medium text-green-600">
                    {card.change}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Actions rapides */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            + Ajouter un modèle
          </button>
          <button className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            + Créer un article
          </button>
          <button className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            + Inviter un utilisateur
          </button>
        </div>
      </div>
    </div>
  )
}
