'use client'

import { useState } from 'react'
import Sidebar from './sidebar'
import ChatInterface from './chat-interface'
import SummaryChatBot from './summury-bot'
import Home from './accueil'
import ModelInfo from './model-info'
import ChatBotInterface from './chat-bot-interface' // ← important : importer le composant

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('K-MIA')

  return (
    <div className="flex w-full h-screen">
      <div className="hidden md:block">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </div>
      <div className="flex-1 overflow-auto">
        {activeSection === 'K-MIA' ? (
          <SummaryChatBot />
        ) : // <ChatInterface />
        // <SummaryChatBot />
        // <Home />
        activeSection === 'chatBot' ? (
          <ChatBotInterface />
        ) : (
          <ModelInfo modelName={activeSection} />
        )}
      </div>
    </div>
  )
}

// 'use client'

// import { useState } from 'react'
// import Sidebar from './sidebar'
// import ChatBotInterface from './chat-bot-interface' // <-- Import ajouté ici
// import ModelInfo from './model-info'

// export default function Dashboard() {
//   const [activeSection, setActiveSection] = useState('K-MIA')

//   return (
//     <div className="flex w-full h-screen">
//       <Sidebar
//         activeSection={activeSection}
//         setActiveSection={setActiveSection}
//       />
//       <div className="flex-1 p-6 overflow-auto">
//         {activeSection === 'K-MIA' ? (
//           <ChatBotInterface />
//         ) : (
//           <ModelInfo modelName={activeSection} />
//         )}
//       </div>
//     </div>
//   )
// }
