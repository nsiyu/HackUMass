import { FC, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

interface Message {
  id: string
  sender: {
    name: string
    avatar?: string
    role: 'user' | 'expert' | 'system'
  }
  content: string
  timestamp: string
  attachedSpecies?: string
}

const Chat: FC = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: {
        name: 'System',
        role: 'system'
      },
      content: 'Welcome to Bird Expert Chat! Feel free to ask questions about any bird species.',
      timestamp: '2024-03-15T09:00:00Z'
    },
    {
      id: '2',
      sender: {
        name: 'Sarah Chen',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen'
      },
      content: "I spotted a hummingbird that seems to hover differently from others I've seen. It has a distinctive red throat and green back. Could it be an Allen's Hummingbird?",
      timestamp: '2024-03-15T09:05:00Z',
      attachedSpecies: "Allen's Hummingbird"
    },
    {
      id: '3',
      sender: {
        name: 'Dr. Smith',
        role: 'expert',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DrSmith'
      },
      content: "Based on your description, it could indeed be an Allen's Hummingbird (Selasphorus sasin). They're known for their distinctive flight patterns and territorial behavior. The male has a bright red-orange throat (gorget) and green back. Could you tell me more about its hovering behavior?",
      timestamp: '2024-03-15T09:07:00Z',
      attachedSpecies: "Allen's Hummingbird"
    },
    {
      id: '4',
      sender: {
        name: 'Dr. Li',
        role: 'expert',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DrLi'
      },
      content: "I'd like to add that Allen's Hummingbirds are quite special in their hovering technique. They can rotate their wings in a figure-8 pattern up to 50 times per second! This gives them exceptional maneuverability.",
      timestamp: '2024-03-15T09:10:00Z',
      attachedSpecies: "Allen's Hummingbird"
    },
    {
      id: '5',
      sender: {
        name: 'Tom Baker',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TomBaker'
      },
      content: "I have a different question about Blue Jays. I've noticed them collecting and hiding acorns. Is this normal behavior?",
      timestamp: '2024-03-15T09:15:00Z',
      attachedSpecies: 'Blue Jay'
    },
    {
      id: '6',
      sender: {
        name: 'Dr. Smith',
        role: 'expert',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DrSmith'
      },
      content: "Absolutely! Blue Jays are known for caching (storing) food, especially acorns and other nuts. This behavior is called 'scatter-hoarding' and it actually helps with forest regeneration as they don't retrieve all their cached items. They can store thousands of acorns in a single season!",
      timestamp: '2024-03-15T09:17:00Z',
      attachedSpecies: 'Blue Jay'
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: {
        name: 'You',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user123'
      },
      content: newMessage,
      timestamp: new Date().toISOString(),
      attachedSpecies: selectedSpecies || undefined
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')

    // Simulate expert response
    setTimeout(() => {
      const expertResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: {
          name: 'Dr. Smith',
          role: 'expert',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert123'
        },
        content: `Thank you for your question about ${selectedSpecies || 'birds'}. Let me help you with that...`,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, expertResponse])
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-coral font-oxygen">
      <div className="max-w-4xl mx-auto p-8">
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Sanctuary
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Chat with Bird Experts</h1>
            <p className="text-gray-600">Get answers about bird species and behavior</p>
          </div>

          <div className="h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(message => (
                <div 
                  key={message.id}
                  className={`flex gap-4 ${message.sender.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {message.sender.avatar ? (
                    <img 
                      src={message.sender.avatar}
                      alt={message.sender.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-light-coral flex items-center justify-center text-white font-bold">
                      {message.sender.name[0]}
                    </div>
                  )}
                  <div className={`max-w-[70%] ${message.sender.role === 'user' ? 'bg-light-coral text-white' : 'bg-gray-100'} rounded-2xl p-4`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{message.sender.name}</span>
                      <span className="text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p>{message.content}</p>
                    {message.attachedSpecies && (
                      <div className="mt-2 text-sm bg-white/10 rounded-lg px-2 py-1">
                        Discussing: {message.attachedSpecies}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-4">
                <select
                  value={selectedSpecies || ''}
                  onChange={(e) => setSelectedSpecies(e.target.value || null)}
                  className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-light-coral"
                >
                  <option value="">All Species</option>
                  <option value="Hummingbird">Hummingbird</option>
                  <option value="Blue Jay">Blue Jay</option>
                  <option value="Cardinal">Cardinal</option>
                </select>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-light-coral"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-light-coral text-white rounded-lg hover:bg-coral-pink transition-colors"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat 