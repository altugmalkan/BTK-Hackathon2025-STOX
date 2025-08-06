import React, { useState } from "react";
import ChatSidebar from "@/components/ai/ChatSidebar";
import ChatInterface from "@/components/ai/ChatInterface";

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

// Mock data for conversations
const mockConversations: ChatConversation[] = [
  {
    id: '1',
    title: 'Elektronik Market Analizi',
    lastMessage: 'Mevcut trendlere göre, elektronik piyasasında...',
    timestamp: '2 hours ago',
    category: 'market',
    messages: [
      {
        id: '1',
        content: 'Elektronik piyasasının mevcut trendlerini analiz edebilir misiniz?',
        role: 'user',
        timestamp: '2:30 PM'
      },
      {
        id: '2',
        content: 'Mevcut trendlere göre, elektronik piyasasında akıllı ev aletleri ve kullanıcı dostu teknolojilerde güçlü büyüme görülmektedir. Burada ana görüşler:\n\n• Akıllı ev aletleri: Yıllık 23% büyüme\n• Kullanıcı dostu teknolojiler: Yıllık 18% büyüme\n• Oyun aksesuarları: Yıllık 15% büyüme\n\nHerhangi bir kategoriye daha derinlemesine inmek ister misiniz?',
        role: 'assistant',
        timestamp: '2:31 PM',
        suggestions: ['Analyze smart home devices', 'Wearables market deep dive', 'Gaming trends analysis']
      }
    ]
  },
  {
    id: '2',
    title: 'Ürün Listeleme Optimizasyonu',
    lastMessage: 'Optimizasyon önerileri...',
    timestamp: '1 day ago',
    category: 'product',
    messages: [
      {
        id: '1',
        content: 'Kablosuz kulaklık listelemesini nasıl optimize edebilirim?',
        role: 'user',
        timestamp: 'Yesterday 3:15 PM'
      },
      {
        id: '2',
        content: 'Kablosuz kulaklık listelemesi için optimize edilmiş öneriler:\n\n**Başlık Optimizasyonu:**\n• Önemli özellikleri içerir: "Premium Bluetooth Kulaklık - Gürültü Yalıtımı, 30H Batarya"\n\n**Eklemek için Anahtar Kelimeler:**\n• bluetooth kulaklık\n• gürültü yalıtımı\n• kablosuz kulaklık\n• uzun batarya ömrü\n\n**Resimler:**\n• Kullanım görüntüleri ekleyin\n• Özellik çağrısı ekleyin\n• Boyut karşılaştırması gösterin\n\nMarketplace gereksinimlerinize yardımcı olmak ister misiniz?',
        role: 'assistant',
        timestamp: 'Yesterday 3:16 PM'
      }
    ]
  },
  {
    id: '3',
    title: 'Sandalye Ürün Geliştirme - AI Görseli',
    lastMessage: 'AI ile görseli geliştirilen sandalye ürününün optimizasyon önerileri...',
    timestamp: '30 minutes ago',
    category: 'product',
    messages: [
      {
        id: '1',
        content: 'Elimde bir sandalye fotoğrafı var ve AI ile görseli geliştirdim. Bu ürün için optimal bir listing oluşturabilir misiniz?',
        role: 'user',
        timestamp: '10:15 AM',
        images: [{
          src: "/origin.jpg",
          alt: "Uploaded chair photo",
          caption: "Yüklenen orijinal sandalye fotoğrafı"
        }]
      },
      {
        id: '2',
        content: 'Harika! AI görseli geliştirmek satışlarınızı artırabilir. Sandalyenizin orijinal ve geliştirilen halini inceledim.\n\n✨ **Optimize Edilmiş Ürün Bilgileri:**\n\n**Başlık:** Siyah Metal Tel Sırtlı Sandalye, Endüstriyel Tasarım\n\n**Kategori:** Ev & Bahçe > Mobilya > Sandalye\n\n**Ana Özellikler:**\n• Modern endüstriyel tasarım\n• Sağlam metal iskelet yapı\n• Siyah suni deri oturma yüzeyi\n• Tel sırt detayı ile şık görünüm\n• Kafe, restoran, ev için uygun\n\n**Fiyat Aralığı:** ₺550 - ₺2,500 (pazara göre)\n\nDetaylı açıklama ve pazarlama stratejisi ister misiniz?',
        role: 'assistant',
        timestamp: '10:16 AM',
        suggestions: ['Detaylı açıklama ver', 'Pazarlama stratejisi', 'Rakip analizi'],
        images: [{
          src: "/origin.jpg",
          alt: "Original chair image",
          comparison: true
        }]
      },
      {
        id: '3',
        content: 'Evet, detaylı açıklama ver lütfen',
        role: 'user',
        timestamp: '10:17 AM'
      },
      {
        id: '4',
        content: '📝 **Detaylı Ürün Açıklaması:**\n\nModern ve endüstriyel tasarımı bir araya getiren bu siyah metal sandalye, estetik ve dayanıklılığı mekanlarınıza taşıyor. Tamamen metalden üretilmiş sağlam iskeleti ve dikey çubuklardan oluşan ikonik tel sırt yapısı, sandalyeye hem minimalist bir hava katmakta hem de uzun ömürlü bir kullanım sunmaktadır.\n\n🪑 **Teknik Özellikler:**\n• Oturma kısmında kullanılan siyah suni deri döşeme\n• Kolay temizlenebilir yüzey\n• İnce ve zarif metal ayaklar\n• Zemini koruyucu pabuçlar\n• Dayanıklı metal tel sırt konstrüksiyonu\n\n🏢 **Kullanım Alanları:**\n• Mutfak ve yemek odası (ev kullanımı)\n• Kafe ve restoran masaları\n• Ofis bekleme alanları\n• Modern çalışma ortamları\n• Endüstriyel dekorasyon projeleri\n\n💡 **Avantajlar:**\n• Yoğun kullanıma dayanıklı yapı\n• Minimalist ve çağdaş tasarım\n• Farklı dekorasyon stillerine uyum\n• Tekli veya set halinde satın alma seçeneği\n• Kolay montaj ve bakım\n\n🔍 **SEO Anahtar Kelimeleri:**\ntel sandalye, metal sandalye, endüstriyel sandalye, kafe sandalyesi, siyah sandalye, modern sandalye, restoran sandalyesi',
        role: 'assistant',
        timestamp: '10:18 AM',
        suggestions: ['Fiyat stratejisi öner', 'Görselleri geliştir', 'Rakip karşılaştırması'],
        images: [{
          src: "/enhanced (2).png",
          alt: "AI Enhanced chair final result",
          caption: "✨ AI ile geliştirilen final görsel - pazaryerlerinde kulıma hazır"
        }]
      }
    ]
  }
];

export default function AI() {
  const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
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
        content: `"${content}" hakkında soruyorsunuz. Bu bir mock yanıtıdır. Gerçek uygulamada, bu AI arka ucunuzla bağlanır.

Burada size yardımcı olabilirim:
• Market analizi ve trendler
• Ürün optimizasyon stratejileri  
• Fiyat önerileri
• Performans bilgileri
• Çoklu platform listeleme yönetimi

Bu konulardan herhangi birini açıklayabilirim?`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Market trendleri', 'Ürün optimizasyonu', 'Fiyat stratejisi']
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

  return (
    <div className="h-[calc(100vh-120px)] flex bg-background rounded-lg border border-border/50 overflow-hidden">
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
  );
}