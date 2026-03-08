// import prisma from '@/lib/prisma'

// /**
//  * Prix par token selon le modèle
//  */
// const PRICING = {
//   'press-ai': 0.00003, // 0.03€ pour 1000 tokens
//   wazir: 0.00002, // 0.02€ pour 1000 tokens
//   'translate-ai': 0.00001, // 0.01€ pour 1000 tokens
// }

// /**
//  * Calcule le coût basé sur les tokens et le modèle
//  */
// function calculateCost(modelSlug, tokens) {
//   const pricePerToken = PRICING[modelSlug] || 0.00002 // Prix par défaut
//   return tokens * pricePerToken
// }

// /**
//  * Enregistre l'utilisation d'une API
//  * @param {Object} params - Paramètres du log
//  * @param {number} params.userId - ID de l'utilisateur
//  * @param {number} params.apiKeyId - ID de la clé API utilisée
//  * @param {number} params.modeleId - ID du modèle
//  * @param {string} params.endpoint - Endpoint appelé
//  * @param {string} params.method - Méthode HTTP (GET, POST, etc.)
//  * @param {number} params.statusCode - Code de statut HTTP
//  * @param {number} params.responseTime - Temps de réponse en ms
//  * @param {number} params.tokens - Nombre de tokens utilisés
//  * @param {Object} params.metadata - Métadonnées additionnelles (optionnel)
//  */
// export async function logApiUsage({
//   userId,
//   apiKeyId,
//   modeleId,
//   endpoint,
//   method = 'POST',
//   statusCode,
//   responseTime,
//   tokens = 0,
//   metadata = {},
// }) {
//   try {
//     // Récupérer le slug du modèle pour calculer le coût
//     const modele = await prisma.modele.findUnique({
//       where: { id: modeleId },
//       select: { slug: true },
//     })

//     const cost = calculateCost(modele?.slug, tokens)

//     // Créer le log
//     await prisma.usageLog.create({
//       data: {
//         userId,
//         apiKeyId,
//         modeleId,
//         endpoint,
//         method,
//         statusCode,
//         responseTime,
//         tokens,
//         cost,
//         metadata,
//       },
//     })

//     // Mettre à jour la date de dernière utilisation de la clé API
//     await prisma.apiKey.update({
//       where: { id: apiKeyId },
//       data: { lastUsed: new Date() },
//     })

//     return { success: true }
//   } catch (error) {
//     console.error('Erreur lors du logging:', error)
//     // Ne pas faire échouer la requête si le logging échoue
//     return { success: false, error: error.message }
//   }
// }

// /**
//  * Compte les tokens approximativement (4 caractères = 1 token environ)
//  * Pour une estimation plus précise, utilisez tiktoken ou l'API du modèle
//  */
// export function estimateTokens(text) {
//   if (!text) return 0
//   // Approximation simple: 1 token ≈ 4 caractères
//   return Math.ceil(text.length / 4)
// }

import prisma from '@/lib/prisma'

/**
 * Prix par token selon le modèle
 */
const PRICING = {
  'press-ai': 0.00003,
  wazir: 0.00002,
  'translate-ai': 0.00001,
}

/**
 * Calcule le coût basé sur les tokens et le modèle
 */
function calculateCost(modelSlug, tokens) {
  const pricePerToken = PRICING[modelSlug] || 0.00002
  return tokens * pricePerToken
}

/**
 * Enregistre l'utilisation d'une API
 */
export async function logApiUsage({
  userId,
  apiKeyId,
  modeleId,
  endpoint,
  method = 'POST',
  statusCode,
  responseTime,
  tokens = 0,
  metadata = {},
}) {
  try {
    // ✅ Si pas de modeleId, récupérer le premier modèle
    let finalModeleId = modeleId
    let modelSlug = 'default'

    if (!finalModeleId) {
      const firstModel = await prisma.modele.findFirst()

      if (!firstModel) {
        console.error('❌ Aucun modèle dans la BD')
        return { success: false, error: 'Aucun modèle disponible' }
      }

      finalModeleId = firstModel.id
      modelSlug = firstModel.slug
    } else {
      // Récupérer le slug du modèle
      const modele = await prisma.modele.findUnique({
        where: { id: finalModeleId },
        select: { slug: true },
      })

      if (modele) {
        modelSlug = modele.slug
      }
    }

    const cost = calculateCost(modelSlug, tokens)

    // Créer le log
    const log = await prisma.usageLog.create({
      data: {
        userId,
        apiKeyId,
        modeleId: finalModeleId,
        endpoint,
        method,
        statusCode,
        responseTime,
        tokens,
        cost,
        metadata,
      },
    })

    // Mettre à jour la clé API
    await prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { lastUsed: new Date() },
    })

    return { success: true, logId: log.id }
  } catch (error) {
    console.error('❌ Erreur logging:', error.message)
    return { success: false, error: error.message }
  }
}

/**
 * Compte les tokens approximativement
 */
export function estimateTokens(text) {
  if (!text) return 0
  return Math.ceil(text.length / 4)
}
