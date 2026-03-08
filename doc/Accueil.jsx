'use client'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
export const Accueil = () => {
  const [data, setData] = useState()
  useEffect(async () => {
    try {
      const response = await fetch('/api/kmia')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations')
      }
      const resultat = response.json()
      setData(resultat)
    } catch (error) {
      console.error('Erreur lors de la récupération des données : ', error)
    }
  }, [])
  console.log('Notre startup', data)
  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}></ReactMarkdown>
    </div>
  )
}
