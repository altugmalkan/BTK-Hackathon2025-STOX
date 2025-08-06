import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Maximize2, Minimize2, Bot } from "lucide-react";
import ChatSidebar from "./ChatSidebar";
import ChatInterface from "./ChatInterface";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  suggestions?: string[];
  images?: Array<{
    src: string;
    alt: string;
    caption?: string;
    comparison?: boolean;
  }>;
}

interface ChatConversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  category: 'market' | 'product' | 'general';
  messages: Message[];
}

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for conversations
const mockConversations: ChatConversation[] = [
  {
    id: '1',
    title: 'Elektronik Ürünler için Market Analizi',
    lastMessage: 'Güncel trendlere göre, elektronik piyasası güçlü bir şekilde büyümekte...',
    timestamp: '2 saat önce',
    category: 'market',
    messages: [
      {
        id: '1',
        content: 'Elektronik piyasasının güncel trendlerini analiz edebilir misiniz?',
        role: 'user',
        timestamp: '2:30 PM'
      },
      {
        id: '2',
        content: 'Güncel trendlere göre, elektronik piyasasında akıllı ev cihazları ve kullanıcı dostu teknolojiler güçlü bir şekilde büyümekte. Burada ana görüşler:\n\n• Akıllı ev cihazları: %23 Yıllık Büyüme\n• Kullanıcı dostu teknolojiler: %18 Yıllık Büyüme\n• Oyun cihazları: %15 Yıllık Büyüme\n\nBelirli bir kategoriye daha derinlemesine inmek ister misiniz?',
        role: 'assistant',
        timestamp: '2:31 PM',
        suggestions: ['Akıllı ev cihazlarını analiz et', 'Kullanıcı dostu teknolojileri derinlemesine incele', 'Oyun cihazları trendlerini analiz et']
      }
    ]
  },
  {
    id: '2',
    title: 'Ürün Listesi Optimizasyonu',
    lastMessage: 'Burada size yardımcı olabilirim...',
    timestamp: '1 gün önce',
    category: 'product',
    messages: [
      {
        id: '1',
        content: 'Nasıl yapabilirim? Burada size yardımcı olabilirim...',
        role: 'user',
        timestamp: 'Yesterday 3:15 PM'
      },
      {
        id: '2',
        content: 'Burada size yardımcı olabilirim:\n\n**Başlık Optimizasyonu:**\n• Önemli özellikleri içerir: "Premium Bluetooth Kulaklık - Gürültü Yalıtımı, 30H Batarya"\n\n**Eklemek için Anahtar Kelimeler:**\n• bluetooth kulaklık\n• gürültü yalıtımı\n• kablosuz kulaklık\n• uzun batarya ömrü\n\n**Resimler:**\n• Kullanım görüntüleri ekleyin\n• Özellik çağrısı ekleyin\n• Boyut karşılaştırması gösterin\n\nMarketplace gereksinimlerinize yardımcı olmak ister misiniz?',
        role: 'assistant',
        timestamp: 'Yesterday 3:16 PM'
      }
    ]
  }
];

export default function AIPanel({ isOpen, onClose }: AIPanelProps) {
  const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentConversation = conversations.find(c => c.id === activeConversation);

  const handleNewConversation = () => {
    const newId = Date.now().toString();
    const newConversation: ChatConversation = {
      id: newId,
      title: 'Yeni Konuşma',
      lastMessage: '',
      timestamp: 'Şimdi',
      category: 'general',
      messages: []
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newId);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversation === id) {
      setActiveConversation(null);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeConversation) {
      handleNewConversation();
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add user message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversation 
        ? { 
            ...conv, 
            messages: [...conv.messages, userMessage],
            lastMessage: content,
            timestamp: 'Şimdi'
          }
        : conv
    ));

    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `"${content}" konusunda soruyorsunuz. Bu bir mock yanıt Stox AI'den. Gerçek uygulamada, bu AI arka ucunuza bağlanır.

Burada size yardımcı olabilirim:
• Market analizi ve trendler
• Ürün optimizasyon stratejileri  
• Fiyat önerileri
• Performans bilgileri
• Çoklu platform liste yönetimi

Bu konulardan hangisini açıklamak istersiniz?`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Market trendleri', 'Ürün optimizasyonu', 'Fiyat önerileri']
      };

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversation 
          ? { 
              ...conv, 
              messages: [...conv.messages, aiMessage],
              lastMessage: aiMessage.content.substring(0, 50) + '...',
              timestamp: 'Şimdi',
              title: conv.title === 'Yeni Konuşma' 
                ? content.substring(0, 30) + (content.length > 30 ? '...' : '')
                : conv.title
            }
          : conv
      ));

      setIsLoading(false);
    }, 1500);
  };

  if (!isOpen) return null;

  const panelClasses = isMaximized 
    ? "fixed inset-0 z-50" 
    : "fixed top-4 right-4 bottom-4 left-4 md:left-auto md:w-[900px] z-50";

  return (
    <div className={panelClasses}>
      <Card className="w-full h-full shadow-2xl border-border/50 bg-background/95 backdrop-blur-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/90">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Stox AI</h2>
              <p className="text-xs text-muted-foreground">Kişisel Çoklu Market AI Aracı</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMaximized(!isMaximized)}
              className="h-8 w-8 p-0"
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100%-73px)]">
          <ChatSidebar
            conversations={conversations}
            activeConversation={activeConversation}
            onSelectConversation={setActiveConversation}
            onNewConversation={handleNewConversation}
            onDeleteConversation={handleDeleteConversation}
          />
          
          <div className="flex-1 flex flex-col">
            <ChatInterface
              messages={currentConversation?.messages || []}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              conversationTitle={currentConversation?.title || 'Yeni Konuşma'}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}