'use client'

import React, { useState } from 'react'

export default function Page() {
  const [formData, setFormData] = useState({
    contenu: '',
    resume: '',
    categorie: '',
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('✅ Article ajouté avec succès !')
      } else {
        setMessage('❌ ' + (data.message || 'Erreur inconnue.'))
      }
    } catch (err) {
      setMessage('❌ Erreur réseau ou serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Ajouter un article</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="contenu"
          placeholder="Contenu"
          className="w-full border p-2 rounded"
          value={formData.contenu}
          onChange={handleChange}
          required
        />
        <input
          name="resume"
          type="text"
          placeholder="Résumé"
          className="w-full border p-2 rounded"
          value={formData.resume}
          onChange={handleChange}
          required
        />
        <input
          name="categorie"
          type="text"
          placeholder="Catégorie"
          className="w-full border p-2 rounded"
          value={formData.categorie}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {loading ? 'Envoi...' : 'Ajouter'}
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  )
}
