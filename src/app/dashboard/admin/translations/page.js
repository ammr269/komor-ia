'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle,
  XCircle,
  Eye,
  User,
  Calendar,
  Clock,
  FileText,
  Star,
  MessageSquare,
} from 'lucide-react'

export default function TranslationsValidation() {
  const [translations, setTranslations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('pending')
  const [selectedTranslation, setSelectedTranslation] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchTranslations()
  }, [filterStatus])

  const fetchTranslations = async () => {
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)

      const response = await fetch(`/api/admin/translations?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTranslations(data.translations || [])
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleValidate = async (translationId, quality, notes = '') => {
    try {
      const response = await fetch(
        `/api/admin/translations/${translationId}/validate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quality, notes }),
        },
      )

      if (response.ok) {
        alert('Traduction validée avec succès')
        setShowModal(false)
        setSelectedTranslation(null)
        fetchTranslations()
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la validation')
    }
  }

  const handleReject = async (translationId, reason) => {
    if (!reason || !reason.trim()) {
      alert('Veuillez indiquer une raison de rejet')
      return
    }

    try {
      const response = await fetch(
        `/api/admin/translations/${translationId}/reject`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason }),
        },
      )

      if (response.ok) {
        alert('Traduction rejetée')
        setShowModal(false)
        setSelectedTranslation(null)
        fetchTranslations()
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors du rejet')
    }
  }

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${h}h ${m}m`
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Validation des traductions
        </h1>
        <p className="text-gray-600 mt-2">
          {translations.length} traduction(s) à vérifier
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Statut :</label>
          <div className="flex space-x-2">
            {[
              { value: 'pending', label: 'En attente' },
              { value: 'completed', label: 'Complétées' },
              { value: 'verified', label: 'Vérifiées' },
              { value: 'all', label: 'Toutes' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterStatus(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : translations.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune traduction à valider
          </h3>
          <p className="text-gray-600">Toutes les traductions sont à jour !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {translations.map((translation) => (
            <div
              key={translation.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                      {translation.article.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>
                        {translation.user.name || translation.user.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(translation.updatedAt).toLocaleDateString(
                          'fr-FR',
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(translation.timeSpent)}</span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Progression</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {translation.progress}%
                    </p>
                  </div>
                  {translation.quality && (
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-bold">{translation.quality}/5</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Texte traduit (extrait) */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Traduction :
                </p>
                <p className="text-sm text-gray-900 line-clamp-3 font-serif">
                  {translation.translatedText}
                </p>
              </div>

              {/* Notes */}
              {translation.notes && (
                <div className="mb-4">
                  <div className="flex items-start space-x-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Notes :</p>
                      <p className="text-gray-600">{translation.notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setSelectedTranslation(translation)
                    setShowModal(true)
                  }}
                  className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Examiner</span>
                </button>

                {translation.status === 'completed' && (
                  <>
                    <button
                      onClick={() => handleValidate(translation.id, 5)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Valider</span>
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Raison du rejet :')
                        if (reason) handleReject(translation.id, reason)
                      }}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center space-x-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Rejeter</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de révision détaillée */}
      {showModal && selectedTranslation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-6xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Révision de la traduction
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedTranslation(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Informations */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Article</h3>
                  <p className="text-gray-700">
                    {selectedTranslation.article.title}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Traducteur</h3>
                  <p className="text-gray-700">
                    {selectedTranslation.user.name ||
                      selectedTranslation.user.email}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Progression</h3>
                  <p className="text-gray-700">
                    {selectedTranslation.progress}%
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Temps passé</h3>
                  <p className="text-gray-700">
                    {formatTime(selectedTranslation.timeSpent)}
                  </p>
                </div>
              </div>

              {/* Comparaison côte à côte */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">
                    Texte original (Français)
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap font-serif">
                      {selectedTranslation.article.originalText}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">
                    Traduction (Comorien)
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap font-serif">
                      {selectedTranslation.translatedText}
                    </p>
                  </div>
                </div>
              </div>

              {/* Validation avec note */}
              {selectedTranslation.status === 'completed' && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Valider cette traduction
                  </h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <label className="text-sm font-medium text-gray-700">
                      Qualité :
                    </label>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() =>
                          handleValidate(selectedTranslation.id, rating)
                        }
                        className="flex items-center space-x-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-yellow-50 hover:border-yellow-500 transition-colors"
                      >
                        <Star className="w-4 h-4 fill-current text-yellow-500" />
                        <span className="font-medium">{rating}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleValidate(selectedTranslation.id, 5)}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Valider (5★)
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Raison du rejet :')
                        if (reason) handleReject(selectedTranslation.id, reason)
                      }}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Rejeter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
