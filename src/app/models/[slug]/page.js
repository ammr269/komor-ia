'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Brain,
  CheckCircle,
  Code,
  Zap,
  Shield,
  TrendingUp,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import HorizontalNavbar from '@/app/components/horizontal-navbar'
import Footer from '@/app/components/footer'

export default function ModelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [model, setModel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchModel()
    }
  }, [params.slug])

  const fetchModel = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/models/${params.slug}`)
      const data = await response.json()

      if (data.success) {
        setModel(data.model)
      } else {
        router.push('/models')
      }
    } catch (error) {
      console.error('Erreur:', error)
      router.push('/models')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getModelEmoji = (icon) => {
    const emojis = {
      Brain: '🧠',
      Bot: '🤖',
      MessageSquare: '💬',
      FileText: '📰',
      Languages: '🌐',
      Zap: '⚡',
    }
    return emojis[icon] || '🤖'
  }

  const getStatusBadge = (status) => {
    const badges = {
      production: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        label: 'Production',
      },
      beta: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Beta' },
      development: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        label: 'Développement',
      },
    }
    return badges[status] || badges.development
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Chargement du modèle...</p>
        </div>
      </div>
    )
  }

  if (!model) {
    return null
  }

  const statusBadge = getStatusBadge(model.status)

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <HorizontalNavbar />

      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-white to-[#FAFAF9]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          {/* Breadcrumb */}
          <Link
            href="/models"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour aux modèles</span>
          </Link>

          {/* Header */}
          <div className="flex items-start space-x-6 mb-8">
            <div className="text-6xl">{getModelEmoji(model.icon)}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-5xl font-light text-gray-900">
                  {model.name}
                </h1>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${statusBadge.bg} ${statusBadge.text}`}
                >
                  {statusBadge.label}
                </span>
              </div>
              <p className="text-xl text-gray-600 mb-4">{model.domaine}</p>
              <p className="text-lg text-gray-700 leading-relaxed font-light max-w-3xl">
                {model.description}
              </p>
            </div>
          </div>

          {/* Métadonnées */}
          <div className="flex items-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Version {model.version}</span>
            </div>
            {model.endpoint && (
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Endpoint disponible</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-12">
              {/* Fonctionnalités */}
              {model.features && Object.keys(model.features).length > 0 && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">
                    Fonctionnalités
                  </h2>
                  <div className="bg-white border border-gray-200 rounded-xl p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      {Object.entries(model.features).map(([key, value], i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <CheckCircle
                            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              value ? 'text-green-600' : 'text-gray-300'
                            }`}
                          />
                          <div>
                            <p className="font-medium text-gray-900 capitalize">
                              {key.replace(/_/g, ' ')}
                            </p>
                            <p className="text-sm text-gray-600">
                              {value ? 'Disponible' : 'Prochainement'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Exemple d'utilisation */}
              {model.endpoint && (
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">
                    Utilisation
                  </h2>
                  <div className="bg-gray-900 rounded-xl p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Code className="w-4 h-4" />
                        <span className="text-sm font-mono">API Request</span>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `curl -X POST https://api.komor-ia.com${model.endpoint} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Votre requête ici"}'`,
                          )
                        }
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>{`curl -X POST https://api.komor-ia.com${model.endpoint} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Votre requête ici"}'`}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* À propos */}
              <div>
                <h2 className="text-3xl font-light text-gray-900 mb-6">
                  À propos
                </h2>
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {model.name} est un modèle d'intelligence artificielle
                      spécialisé dans le domaine {model.domaine.toLowerCase()}.
                      Développé par Komor-IA, il a été conçu pour répondre aux
                      besoins spécifiques du contexte africain.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* CTA */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 text-white">
                <h3 className="text-xl font-medium mb-4">
                  Commencer à utiliser {model.name}
                </h3>
                <p className="text-gray-300 mb-6 text-sm">
                  Créez votre compte gratuit et obtenez votre clé API pour
                  commencer.
                </p>
                <Link
                  href="/signup"
                  className="block w-full px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-center font-medium"
                >
                  Créer un compte
                </Link>
                <Link
                  href="/dashboard"
                  className="block w-full px-6 py-3 bg-transparent border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors text-center font-medium mt-3"
                >
                  Accéder au dashboard
                </Link>
              </div>

              {/* Pricing */}
              {model.pricing && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Tarification
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(model.pricing).map(([plan, details], i) => (
                      <div
                        key={i}
                        className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        <p className="font-medium text-gray-900 capitalize mb-1">
                          {plan}
                        </p>
                        <p className="text-2xl font-light text-gray-900 mb-1">
                          {details.price === 0
                            ? 'Gratuit'
                            : `${details.price}€`}
                          <span className="text-sm text-gray-500">/mois</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          {details.requests.toLocaleString()} requêtes/mois
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specs techniques */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Spécifications
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version</span>
                    <span className="font-medium text-gray-900">
                      {model.version}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut</span>
                    <span className="font-medium text-gray-900">
                      {statusBadge.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domaine</span>
                    <span className="font-medium text-gray-900">
                      {model.domaine}
                    </span>
                  </div>
                  {model.endpoint && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">API</span>
                      <span className="font-medium text-gray-900">
                        Disponible
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Documentation */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Documentation
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Consultez la documentation complète pour intégrer {model.name}
                  .
                </p>
                <Link
                  href="/docs"
                  className="inline-flex items-center space-x-2 text-blue-700 hover:text-blue-800 font-medium text-sm"
                >
                  <span>Voir la documentation</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Autres modèles */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <h2 className="text-3xl font-light text-gray-900 mb-8">
            Découvrez nos autres modèles
          </h2>
          <Link
            href="/models"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <span>Voir tous les modèles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
