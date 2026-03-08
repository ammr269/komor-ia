import { logApiUsage } from './api-logger'

/**
 * Higher-order function pour wrapper les routes API avec logging automatique
 */
export function withApiLogging(handler) {
  return async (req, context) => {
    const startTime = Date.now()
    let statusCode = 200
    let tokens = 0
    let auth = null

    try {
      // Exécuter le handler
      const response = await handler(req, context)

      statusCode = response.status || 200

      // Extraire les infos de l'auth si disponibles
      if (context?.auth) {
        auth = context.auth
        tokens = context.tokens || 0

        // Logger automatiquement
        await logApiUsage({
          userId: auth.user.id,
          apiKeyId: auth.apiKey.id,
          modeleId: auth.modele?.id || auth.apiKey.modeleId,
          endpoint: req.url,
          method: req.method,
          statusCode,
          responseTime: Date.now() - startTime,
          tokens,
          metadata: context.metadata || {},
        })
      }

      return response
    } catch (error) {
      statusCode = error.status || 500

      // Logger les erreurs aussi
      if (auth) {
        await logApiUsage({
          userId: auth.user.id,
          apiKeyId: auth.apiKey.id,
          modeleId: auth.modele?.id || auth.apiKey.modeleId,
          endpoint: req.url,
          method: req.method,
          statusCode,
          responseTime: Date.now() - startTime,
          tokens,
          metadata: { error: error.message },
        })
      }

      throw error
    }
  }
}
