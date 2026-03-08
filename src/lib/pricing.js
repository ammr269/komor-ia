/**
 * Configuration centralisée des prix
 */
export const PRICING_CONFIG = {
  models: {
    'press-ai': {
      pricePerToken: 0.00003,
      pricePerRequest: 0.001,
      rateLimit: 1000,
    },
    wazir: {
      pricePerToken: 0.00002,
      pricePerRequest: 0.0008,
      rateLimit: 1500,
    },
    'translate-ai': {
      pricePerToken: 0.00001,
      pricePerRequest: 0.0005,
      rateLimit: 2000,
    },
  },

  // Prix par défaut
  default: {
    pricePerToken: 0.00002,
    pricePerRequest: 0.001,
    rateLimit: 1000,
  },
}

export function getModelPricing(modelSlug) {
  return PRICING_CONFIG.models[modelSlug] || PRICING_CONFIG.default
}
;```

---

// ## 🎯 **Résumé du flux en production**
// ```
// 1. Client envoie requête avec clé API
//    ↓
// 2. authenticateApiRequest() valide la clé
//    ↓
// 3. Traitement de la requête (appel modèle IA)
//    ↓
// 4. Calcul des tokens utilisés
//    ↓
// 5. logApiUsage() enregistre dans UsageLog
//    ↓
// 6. Mise à jour lastUsed de l'ApiKey
//    ↓
// 7. Retour de la réponse au client
