'use client'

import { Target, Users, Zap, Globe, Heart, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Mission',
      description:
        "Démocratiser l'accès à l'intelligence artificielle en Afrique avec des modèles adaptés aux langues et contextes locaux.",
    },
    {
      icon: Users,
      title: 'Inclusion',
      description:
        'Créer des technologies qui respectent et valorisent la diversité linguistique et culturelle africaine.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description:
        'Développer des solutions IA de pointe tout en restant accessibles et faciles à utiliser.',
    },
    {
      icon: Globe,
      title: 'Impact',
      description:
        'Contribuer au développement numérique du continent africain et créer des opportunités.',
    },
  ]

  const team = [
    {
      name: 'Équipe Komor-IA',
      role: 'Développeurs & Chercheurs',
      description: "Passionnés par l'IA et le développement en Afrique",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">À propos de Komor-IA</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Nous construisons l'avenir de l'intelligence artificielle pour
            l'Afrique
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          <div className="flex items-center space-x-3 mb-6">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Notre histoire</h2>
          </div>

          <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
            <p>
              Komor-IA est née d'un constat simple : l'intelligence artificielle
              transforme le monde, mais l'Afrique reste largement exclue de
              cette révolution technologique.
            </p>

            <p>
              Les barrières linguistiques, le manque d'infrastructure adaptée et
              l'absence de modèles IA contextualisés freinent l'innovation sur
              le continent.
            </p>

            <p>
              C'est pourquoi nous avons créé Komor-IA : une plateforme
              d'intelligence artificielle pensée pour l'Afrique, avec des
              modèles capables de comprendre et de générer du contenu dans les
              langues locales comme le shikomori, le swahili, et bien d'autres.
            </p>

            <p className="text-lg font-semibold text-gray-900">
              Notre vision : faire de l'Afrique un acteur majeur de la
              révolution IA, pas seulement un spectateur.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Nos valeurs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Notre équipe
        </h2>

        <div className="max-w-2xl mx-auto">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {member.name}
              </h3>
              <p className="text-blue-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600">{member.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Heart className="w-12 h-12 mx-auto mb-6 text-red-400" />
          <h2 className="text-3xl font-bold mb-4">Rejoignez l'aventure</h2>
          <p className="text-gray-300 mb-8">
            Utilisez Komor-IA dans vos projets et participez à la révolution IA
            en Afrique
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Commencer gratuitement
          </Link>
        </div>
      </section>
    </div>
  )
}
