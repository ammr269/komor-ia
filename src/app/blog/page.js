'use client'

import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react'
import Image from 'next/image'

export default function BlogPage() {
  const posts = [
    {
      title: "Lancement de Komor-IA : L'IA au service de l'Afrique",
      excerpt:
        "Découvrez comment Komor-IA révolutionne l'accès à l'intelligence artificielle en Afrique avec des modèles adaptés aux langues et contextes locaux.",
      image: '/blog/launch.jpg',
      category: 'Annonce',
      date: '15 Mars 2026',
      readTime: '5 min',
      href: '/blog/lancement-komor-ia',
    },
    {
      title: 'Press-AI : Générer des articles de presse en shikomori',
      excerpt:
        'Notre modèle Press-AI permet de créer du contenu journalistique de qualité dans les langues locales des Comores.',
      image: '/blog/press-ai.jpg',
      category: 'Produit',
      date: '10 Mars 2026',
      readTime: '7 min',
      href: '/blog/press-ai-shikomori',
    },
    {
      title: 'Guide : Intégrer Komor-IA dans votre application',
      excerpt:
        "Un tutoriel complet pour démarrer avec notre API et intégrer l'IA dans vos projets en moins de 10 minutes.",
      image: '/blog/integration.jpg',
      category: 'Tutorial',
      date: '5 Mars 2026',
      readTime: '10 min',
      href: '/blog/guide-integration',
    },
  ]

  const categories = ['Tous', 'Annonce', 'Produit', 'Tutorial', 'Technique']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">Blog Komor-IA</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Actualités, guides et insights sur l'intelligence artificielle pour
            l'Afrique
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center space-x-2 overflow-x-auto">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                index === 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Link
              key={index}
              href={post.href}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <span className="text-4xl">📰</span>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {post.date}
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-blue-50 border border-blue-200 rounded-xl p-8">
            <p className="text-blue-800 font-medium">
              📝 Plus d'articles à venir prochainement
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
