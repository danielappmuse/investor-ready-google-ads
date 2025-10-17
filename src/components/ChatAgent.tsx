import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import InlineLeadForm from './InlineLeadForm'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const ChatAgent = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm StartWise AI. I can help you understand our services and guide you through validating your startup idea. What would you like to know about our Startup Validation Exam or Prototype Development services?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [hasSubmittedForm, setHasSubmittedForm] = useState(false)
  const [userMessageCount, setUserMessageCount] = useState(0)
  const [conversationId] = useState(() => crypto.randomUUID())
  const [leadId, setLeadId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  const saveMessageToDatabase = async (message: string, sender: 'user' | 'bot') => {
    if (!leadId) return

    try {
      const { error } = await supabase.from('agent_chat').insert({
        conversation_id: conversationId,
        lead_id: leadId,
        message,
        sender,
        timestamp: new Date().toISOString()
      })

      if (error) {
        console.error('Error saving message:', error)
      }
    } catch (error) {
      console.error('Error saving message to database:', error)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    // Check if this is the first user message and form hasn't been submitted
    if (userMessageCount === 0 && !hasSubmittedForm) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputValue,
        sender: 'user',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, userMessage])
      setInputValue('')
      setUserMessageCount(prev => prev + 1)
      setShowLeadForm(true)
      return
    }

    // Don't allow further messages if form hasn't been submitted
    if (!hasSubmittedForm) {
      toast({
        title: "Please complete the form",
        description: "Fill out your contact information to continue chatting.",
        variant: "destructive",
      })
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const userInput = inputValue
    setInputValue('')
    setIsTyping(true)
    setUserMessageCount(prev => prev + 1)

    // Save user message to database if form submitted
    if (hasSubmittedForm && leadId) {
      await saveMessageToDatabase(userInput, 'user')
    }

    try {
      // Get conversation history (last 10 messages)
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))

      const { data, error } = await supabase.functions.invoke('chat-agent', {
        body: { 
          message: userInput,
          conversationHistory 
        }
      });

      if (error) {
        throw error;
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])
      
      // Save bot response to database if form submitted
      if (hasSubmittedForm && leadId) {
        await saveMessageToDatabase(data.response, 'bot')
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI agent. Please try again.",
        variant: "destructive",
      });
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or call us directly at +1 (616) 896-2290.",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleFormSuccess = (submittedLeadId?: string) => {
    setHasSubmittedForm(true)
    setShowLeadForm(false)
    
    // Store the lead ID for saving messages
    if (submittedLeadId) {
      setLeadId(submittedLeadId)
    }
    
    // Add a bot response acknowledging the form submission
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: "Thank you for providing your information! Now I can better assist you with your startup questions. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, botResponse])
  }

  return (
    <div className="card-glass h-full w-full max-w-full flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-white/10">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">AI Startup Consultant</h3>
          <p className="text-xs text-gray-400">Online • Responds instantly</p>
        </div>
        <div className="ml-auto">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-2 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 sm:gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'bot' && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-white ml-auto'
                    : 'bg-white/10 text-white'
                }`}
              >
                <p className="text-xs sm:text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {message.sender === 'user' && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Show inline form if needed */}
          {showLeadForm && (
            <InlineLeadForm onSuccess={handleFormSuccess} />
          )}

          {isTyping && (
            <div className="flex gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="bg-white/10 rounded-lg p-2 sm:p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-2 sm:p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={hasSubmittedForm ? "Ask about feasibility, MVP development, costs..." : "Type your message to get started..."}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm"
            disabled={isTyping || (!hasSubmittedForm && userMessageCount > 0)}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isTyping || (userMessageCount === 0 && !hasSubmittedForm) || (!hasSubmittedForm && userMessageCount > 0)}
            className="btn-hero px-2 sm:px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2 hidden sm:block">
          {hasSubmittedForm ? "Press Enter to send • Get instant startup insights" : "Send your first message to get started"}
        </p>
      </div>

    </div>
  )
}

export default ChatAgent