import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Bot, 
  User, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Package,
  DollarSign,
  BarChart3,
  ImageIcon,
  ArrowRight
} from "lucide-react";

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

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  conversationTitle?: string;
}

const suggestionPrompts = [
  {
    icon: <TrendingUp className="w-4 h-4" />,
    title: "Market Analizi",
    prompt: "Elektronik piyasasının güncel trendlerini analiz edebilir misiniz?"
  },
  {
    icon: <Package className="w-4 h-4" />,
    title: "Ürün Optimizasyonu",
    prompt: "Ürün listelerimi daha iyi görünürlüğe sahip hale getirebilir misiniz?"
  },
  {
    icon: <DollarSign className="w-4 h-4" />,
    title: "Fiyat Önerisi",
    prompt: "Rekabet eden ürünler için en iyi fiyat stratejisi nedir?"
  },
  {
    icon: <BarChart3 className="w-4 h-4" />,
    title: "Performans Raporu",
    prompt: "En iyi ürünlerim için bir performans raporu oluşturabilir misiniz?"
  }
];

export default function ChatInterface({
  messages,
  onSendMessage,
  isLoading = false,
  conversationTitle = "Yeni Konuşma"
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [rows, setRows] = useState(1);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
      setRows(1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    
    // Auto-resize textarea
    const newRows = Math.min(Math.max(1, value.split('\n').length), 5);
    setRows(newRows);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const MessageBubble = ({ message }: { message: Message }) => (
    <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.role === 'assistant' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
        <Card className={`${
          message.role === 'user' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted/50'
        }`}>
          <CardContent className="p-3">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="mb-0 whitespace-pre-wrap">{message.content}</p>
            </div>

            {/* Image Display */}
            {message.images && message.images.length > 0 && (
              <div className="mt-4 space-y-3">
                {message.images.some(img => img.comparison) ? (
                  // Before/After comparison view
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <ImageIcon className="w-4 h-4" />
                      Görsel Karşılaştırma
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Orijinal</p>
                        <div className="rounded-lg overflow-hidden bg-background">
                          <img
                            src="/origin.jpg"
                            alt="Original chair"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-purple-600 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI Geliştirilmiş
                        </p>
                        <div className="rounded-lg overflow-hidden bg-background relative">
                          <img
                            src="/enhanced (2).png"
                            alt="AI Enhanced chair"
                            className="w-full h-auto object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                              ✨ AI
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                ) : (
                  // Regular image gallery
                  <div className="grid gap-3">
                    {message.images.map((image, index) => (
                      <div key={index} className="space-y-2">
                        <div className="rounded-lg overflow-hidden bg-background">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-auto object-cover max-h-64"
                          />
                        </div>
                        {image.caption && (
                          <p className="text-xs text-muted-foreground text-center">
                            {image.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="mt-3 space-y-1">
                {message.suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => onSendMessage(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <span>{message.timestamp}</span>
          {message.role === 'assistant' && (
            <>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Copy className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ThumbsUp className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ThumbsDown className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <RotateCcw className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      {message.role === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              {conversationTitle}
            </h3>
            <p className="text-sm text-muted-foreground">Kişisel Çoklu Market AI Aracı</p>
          </div>
          <Badge variant="outline" className="text-xs">
            Stox AI Pro
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Stox AI'ye Hoş Geldiniz</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Kişisel Çoklu Market AI Aracı. Market trendleri, ürün optimizasyonu, fiyat stratejileri ve genel iş soruları hakkında herhangi bir şey sorabilirsiniz.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {suggestionPrompts.map((suggestion, index) => (
                  <Card 
                    key={index}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => onSendMessage(suggestion.prompt)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          {suggestion.icon}
                        </div>
                        <div className="text-left">
                          <h4 className="font-medium text-sm">{suggestion.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {suggestion.prompt}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <Card className="bg-muted/50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse animation-delay-200" />
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse animation-delay-400" />
                    </div>
                    <span className="text-sm text-muted-foreground">Stox AI düşünüyor...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Stox AI'ye herhangi bir şey sorabilirsiniz..."
              className="resize-none pr-12 min-h-[44px]"
              rows={rows}
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 h-8 w-8 p-0"
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Stox AI hatalar yapabilir. Lütfen önemli bilgileri doğrulayın.
        </p>
      </div>
    </div>
  );
}