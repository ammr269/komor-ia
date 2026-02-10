'use client'

const modelData = {
  'Random Forest': {
    description:
      "Random Forest est un algorithme d'apprentissage automatique qui crée un ensemble d'arbres de décision et combine leurs prédictions. Cette méthode est robuste contre le surapprentissage et peut gérer un grand nombre de variables.",
    accuracy: 0.87,
    f1Score: 0.85,
    trainingTime: '45 secondes',
    advantages: [
      'Résistant au surapprentissage',
      'Gère bien les données manquantes',
      "Fournit l'importance des variables",
    ],
    useCases: [
      'Classification de textes',
      'Analyse de sentiment',
      'Détection de fraude',
    ],
  },
  SVM: {
    description:
      'Support Vector Machine (SVM) est un algorithme qui trouve un hyperplan optimal pour séparer différentes classes de données. Il est particulièrement efficace dans les espaces de grande dimension et utilise des fonctions noyaux pour traiter des problèmes non linéaires.',
    accuracy: 0.904,
    f1Score: 0.8,
    trainingTime: '1 minute 20 secondes',
    advantages: [
      'Efficace en haute dimension',
      'Utilise peu de mémoire',
      'Polyvalent avec les noyaux',
    ],
    useCases: [
      "Classification d'images",
      'Reconnaissance de formes',
      'Bioinformatique',
    ],
  },
  'Régression Logistique': {
    description:
      'La régression logistique est un modèle statistique qui utilise une fonction logistique pour modéliser une variable binaire. Simple mais puissant, ce modèle est souvent utilisé comme référence et offre une bonne interprétabilité des résultats.',
    accuracy: 0.79,
    f1Score: 0.77,
    trainingTime: '30 secondes',
    advantages: [
      'Simple à interpréter',
      'Rapide à entraîner',
      'Pas de paramètres à ajuster',
    ],
    useCases: ['Marketing digital', 'Médecine prédictive', 'Analyse de risque'],
  },
  XGBoost: {
    description:
      "XGBoost (Extreme Gradient Boosting) est un algorithme d'ensemble basé sur les arbres de décision qui utilise le principe du boosting. Il est connu pour sa performance et sa vitesse, et domine souvent les compétitions de machine learning.",
    accuracy: 0.91,
    f1Score: 0.9,
    trainingTime: '1 minute 10 secondes',
    advantages: [
      'Très haute performance',
      'Gestion automatique des valeurs manquantes',
      'Parallélisation efficace',
    ],
    useCases: ['Compétitions Kaggle', 'Recommandations', 'Prédiction de prix'],
  },
}

export default function ModelInfo({ modelName }) {
  const data = modelData[modelName]

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center text-gray-500">
          Information non disponible
        </div>
      </div>
    )
  }

  const getModelIcon = () => {
    switch (modelName) {
      case 'Random Forest':
        return '🌲'
      case 'SVM':
        return '📈'
      case 'Régression Logistique':
        return '📊'
      case 'XGBoost':
        return '🚀'
      default:
        return '📋'
    }
  }

  const getPerformanceColor = (value) => {
    if (value >= 0.9) return 'text-green-600'
    if (value >= 0.8) return 'text-blue-600'
    return 'text-orange-600'
  }

  const getPerformanceBg = (value) => {
    if (value >= 0.9) return 'bg-green-50 border-green-100'
    if (value >= 0.8) return 'bg-blue-50 border-blue-100'
    return 'bg-orange-50 border-orange-100'
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-2xl font-bold mb-6 text-gray-800">
        {getModelIcon()} {modelName}
      </div>

      {/* Description Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 hover:shadow-lg transition-shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">📖</span>
            Description
          </h3>
          <p className="text-gray-600 leading-relaxed">{data.description}</p>
        </div>
      </div>

      {/* Performance Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 hover:shadow-lg transition-shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <span className="mr-2">📊</span>
            Performances
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Métriques d'évaluation du modèle
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-4 rounded-lg border ${getPerformanceBg(
                data.accuracy
              )} hover:scale-105 transition-transform`}
            >
              <div
                className={`text-sm font-medium mb-1 ${getPerformanceColor(
                  data.accuracy
                )}`}
              >
                Accuracy
              </div>
              <div
                className={`text-2xl font-bold ${getPerformanceColor(
                  data.accuracy
                )}`}
              >
                {(data.accuracy * 100).toFixed(1)}%
              </div>
            </div>
            <div
              className={`p-4 rounded-lg border ${getPerformanceBg(
                data.f1Score
              )} hover:scale-105 transition-transform`}
            >
              <div
                className={`text-sm font-medium mb-1 ${getPerformanceColor(
                  data.f1Score
                )}`}
              >
                F1-Score
              </div>
              <div
                className={`text-2xl font-bold ${getPerformanceColor(
                  data.f1Score
                )}`}
              >
                {(data.f1Score * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 hover:scale-105 transition-transform">
              <div className="text-sm text-purple-600 font-medium mb-1">
                Temps d'entraînement
              </div>
              <div className="text-2xl font-bold text-purple-800">
                {data.trainingTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advantages and Use Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Advantages */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">✅</span>
              Avantages
            </h3>
            <ul className="space-y-2">
              {data.advantages.map((advantage, index) => (
                <li key={index} className=" flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  <span className="text-gray-600">{advantage}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              Cas d'usage
            </h3>
            <ul className="space-y-2">
              {data.useCases.map((useCase, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span className="text-gray-600">{useCase}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
