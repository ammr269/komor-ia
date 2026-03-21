'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordRequirements = [
    { label: 'Au moins 8 caractères', met: formData.password.length >= 8 },
    { label: 'Une majuscule', met: /[A-Z]/.test(formData.password) },
    { label: 'Une minuscule', met: /[a-z]/.test(formData.password) },
    { label: 'Un chiffre', met: /[0-9]/.test(formData.password) },
  ]

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   setError('')

  //   // Validation
  //   if (formData.password !== formData.confirmPassword) {
  //     setError('Les mots de passe ne correspondent pas')
  //     return
  //   }

  //   if (!passwordRequirements.every((req) => req.met)) {
  //     setError('Le mot de passe ne respecte pas tous les critères')
  //     return
  //   }

  //   setLoading(true)

  //   try {
  //     // Créer le compte
  //     const response = await fetch('/api/auth/signup', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         name: formData.name,
  //         email: formData.email,
  //         password: formData.password,
  //       }),
  //     })

  //     const data = await response.json()

  //     if (!response.ok) {
  //       throw new Error(data.message || 'Erreur lors de la création du compte')
  //     }

  //     // Connexion automatique après inscription
  //     const result = await signIn('credentials', {
  //       redirect: false,
  //       email: formData.email,
  //       password: formData.password,
  //     })

  //     if (result?.error) {
  //       setError('Compte créé, mais erreur de connexion')
  //     } else {
  //       router.push('/')
  //     }
  //   } catch (error) {
  //     setError(error.message || 'Une erreur est survenue')
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (!passwordRequirements.every((req) => req.met)) {
      setError('Le mot de passe ne respecte pas tous les critères')
      return
    }

    setLoading(true)

    try {
      // Créer le compte
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création du compte')
      }

      // Connexion automatique après inscription
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        setError('Compte créé, mais erreur de connexion')
      } else {
        // ✅ Rediriger vers /dashboard
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      setError(error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    // ✅ Rediriger vers /dashboard
    await signIn('google', { callbackUrl: '/' })
  }

  // const handleGoogleSignIn = async () => {
  //   await signIn('google', { callbackUrl: '/dashboard' })
  // }

  return (
    <div className="min-h-screen bg-[#F5F3EF] flex flex-col">
      {/* Header simple */}
      <header className="py-6 px-6 sm:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#1A1A1A] rounded-lg flex items-center justify-center">
            <Image
              src="/logo3.svg"
              alt="Komor-IA"
              width={20}
              height={20}
              priority
              className="filter brightness-0 invert"
            />
          </div>
          <span className="text-lg font-medium text-[#1A1A1A]">Komor-IA</span>
        </Link>
      </header>

      {/* Contenu principal */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Titre */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-normal text-[#1A1A1A] mb-3">
              Créer un compte
            </h1>
            <p className="text-[#6B6B6B] font-serif">
              Commencez gratuitement avec Komor-IA
            </p>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#D4CFC7]">
            {/* Erreur */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nom */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#1A1A1A] mb-2"
                >
                  Nom complet
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-[#D4CFC7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#1A1A1A] mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-[#D4CFC7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#1A1A1A] mb-2"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-12 py-3 border border-[#D4CFC7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B6B6B] hover:text-[#1A1A1A]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Requirements */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        {req.met ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-[#D4CFC7] rounded-full" />
                        )}
                        <span
                          className={`text-xs ${
                            req.met ? 'text-green-600' : 'text-[#6B6B6B]'
                          }`}
                        >
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirmer mot de passe */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[#1A1A1A] mb-2"
                >
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-12 py-3 border border-[#D4CFC7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B6B6B] hover:text-[#1A1A1A]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bouton inscription */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2A2A2A] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Création du compte...' : 'Créer un compte'}
              </button>

              {/* Terms */}
              <p className="text-xs text-center text-[#6B6B6B]">
                En créant un compte, vous acceptez nos{' '}
                <Link href="/terms" className="underline hover:text-[#1A1A1A]">
                  Conditions d'utilisation
                </Link>{' '}
                et notre{' '}
                <Link
                  href="/privacy"
                  className="underline hover:text-[#1A1A1A]"
                >
                  Politique de confidentialité
                </Link>
              </p>
            </form>

            {/* Séparateur */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#D4CFC7]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#6B6B6B]">ou</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-3 border-2 border-[#D4CFC7] rounded-lg hover:border-[#1A1A1A] transition-all font-medium text-[#1A1A1A] flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continuer avec Google</span>
            </button>
          </div>

          {/* Lien vers connexion */}
          <p className="mt-6 text-center text-sm text-[#6B6B6B]">
            Vous avez déjà un compte ?{' '}
            <Link
              href="/login"
              className="text-[#1A1A1A] font-medium hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
