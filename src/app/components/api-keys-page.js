'use client'

import { useState, useEffect } from 'react'
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewKeyModal, setShowNewKeyModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [selectedModel, setSelectedModel] = useState('all')
  const [newKeyGenerated, setNewKeyGenerated] = useState(null)
  const [visibleKeys, setVisibleKeys] = useState({})
  const [copiedKey, setCopiedKey] = useState(null)

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/api-keys')
      const data = await response.json()
      if (data.success) {
        setApiKeys(data.keys)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clés API:', error)
    } finally {
      setLoading(false)
    }
  }

  const createApiKey = async (e) => {
    e.preventDefault()
    if (!newKeyName.trim()) return

    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newKeyName,
          modeleId: selectedModel === 'all' ? null : parseInt(selectedModel),
        }),
      })

      const data = await response.json()
      if (data.success) {
        setNewKeyGenerated(data.key)
        setNewKeyName('')
        fetchApiKeys()
      }
    } catch (error) {
      console.error('Erreur lors de la création de la clé:', error)
    }
  }

  const deleteApiKey = async (keyId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette clé API ?')) return

    try {
      const response = await fetch(`/api/user/api-keys/${keyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchApiKeys()
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }))
  }

  const copyToClipboard = async (text, keyId) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(keyId)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (error) {
      console.error('Erreur lors de la copie:', error)
    }
  }

  const maskKey = (key) => {
    if (!key) return ''
    return `${key.substring(0, 8)}${'•'.repeat(24)}${key.substring(key.length - 4)}`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Key className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Clés API</h1>
          </div>
          <p className="text-gray-600">
            Gérez vos clés API pour accéder à nos modèles d'IA
          </p>
        </div>

        {/* Alert Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Important !</p>
            <p>
              Gardez vos clés API secrètes. Ne les partagez jamais publiquement
              et ne les commitez pas dans votre code source.
            </p>
          </div>
        </div>

        {/* Create New Key Button */}
        <button
          onClick={() => setShowNewKeyModal(true)}
          className="mb-6 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>Créer une nouvelle clé</span>
        </button>

        {/* API Keys List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
            <p className="text-gray-600">Chargement de vos clés API...</p>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Key className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune clé API
            </h3>
            <p className="text-gray-600 mb-6">
              Créez votre première clé API pour commencer à utiliser nos modèles
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modèle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière utilisation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiKeys.map((apiKey) => (
                  <tr
                    key={apiKey.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {apiKey.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Créée le{' '}
                            {new Date(apiKey.createdAt).toLocaleDateString(
                              'fr-FR',
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <code className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          {visibleKeys[apiKey.id]
                            ? apiKey.key
                            : maskKey(apiKey.key)}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title={
                            visibleKeys[apiKey.id] ? 'Masquer' : 'Afficher'
                          }
                        >
                          {visibleKeys[apiKey.id] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copier"
                        >
                          {copiedKey === apiKey.id ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {apiKey.modele?.name || 'Tous les modèles'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {apiKey.lastUsed
                          ? new Date(apiKey.lastUsed).toLocaleDateString(
                              'fr-FR',
                            )
                          : 'Jamais'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => deleteApiKey(apiKey.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* New Key Modal */}
        {showNewKeyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Créer une nouvelle clé API
              </h3>

              {newKeyGenerated ? (
                <div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800 mb-2">
                          Clé créée avec succès !
                        </p>
                        <p className="text-xs text-green-700 mb-3">
                          Copiez cette clé maintenant, vous ne pourrez plus la
                          voir.
                        </p>
                        <div className="bg-white border border-green-300 rounded p-3">
                          <code className="text-sm font-mono text-gray-900 break-all">
                            {newKeyGenerated}
                          </code>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(newKeyGenerated, 'new')
                          }
                          className="mt-3 flex items-center space-x-2 text-green-700 hover:text-green-800 text-sm font-medium"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copier la clé</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowNewKeyModal(false)
                      setNewKeyGenerated(null)
                    }}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                <form onSubmit={createApiKey}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la clé
                    </label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="ex: Production API Key"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modèle (optionnel)
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">Tous les modèles</option>
                      <option value="1">Press-AI</option>
                      <option value="2">Wazir</option>
                    </select>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewKeyModal(false)
                        setNewKeyName('')
                        setSelectedModel('all')
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Créer
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
