'use client'

import Link from 'next/link'
import { Check, Zap, Rocket, Crown, ArrowRight } from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
      name: 'Gratuit',
      price: '0',
      description: 'Parfait pour découvrir Komor-IA',
      icon: Zap,
      color: 'blue',
      features: [
        '1,000 requêtes / mois',
        'Accès aux modèles de base',
        'Support communautaire',
        'Documentation complète',
      ],
      cta: 'Commencer gratuitement',
      href: '/signup',
      popular: false,
    },
    {
      name: 'Pro',
      price: '29',
      description: 'Pour les développeurs et startups',
      icon: Rocket,
      color: 'purple',
      features: [
        '50,000 requêtes / mois',
        'Tous les modèles IA',
        'Support prioritaire',
        'Webhooks',
        'Analytics avancés',
        'API sans limite de débit',
      ],
      cta: 'Bientôt disponible',
      href: '#',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Sur mesure',
      description: 'Pour les grandes organisations',
      icon: Crown,
      color: 'orange',
      features: [
        'Requêtes illimitées',
        'Modèles personnalisés',
        'Support dédié 24/7',
        'SLA garanti',
        'Déploiement on-premise',
        "Formation de l'équipe",
      ],
      cta: 'Nous contacter',
      href: '/contact',
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Tarifs simples et transparents
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins. Passez à un plan
            supérieur à tout moment.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-4 ring-blue-600 relative' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-center py-2 text-sm font-bold">
                    ⭐ Bientôt disponible
                  </div>
                )}

                <div className="p-8">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                      plan.color === 'blue'
                        ? 'bg-blue-100 text-blue-600'
                        : plan.color === 'purple'
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    {typeof plan.price === 'string' &&
                    plan.price !== 'Sur mesure' ? (
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold text-gray-900">
                          {plan.price}€
                        </span>
                        <span className="text-gray-600 ml-2">/mois</span>
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-gray-900">
                        {plan.price}
                      </div>
                    )}
                  </div>

                  <Link
                    href={plan.href}
                    className={`block w-full py-3 rounded-lg text-center font-medium transition-colors mb-6 ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Des questions ?
          </h2>
          <p className="text-gray-600 mb-8">
            Consultez notre FAQ ou contactez-nous directement
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/docs/faq"
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Voir la FAQ
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
