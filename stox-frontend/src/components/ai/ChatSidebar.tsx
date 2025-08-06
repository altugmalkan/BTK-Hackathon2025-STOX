import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Plus, 
  Search,
  Trash2,
  Bot,
  TrendingUp,
  ShoppingCart,
  BarChart3,
  Settings
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatConversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  category: 'market' | 'product' | 'general';
}

interface ChatSidebarProps {
  conversations: ChatConversation[];
  activeConversation: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'market':
      return <TrendingUp className="w-4 h-4" />;
    case 'product':
      return <ShoppingCart className="w-4 h-4" />;
    default:
      return <MessageSquare className="w-4 h-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'market':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'product':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    default:
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
  }
};

export default function ChatSidebar({
  conversations,
  activeConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation
}: ChatSidebarProps) {
  return (
    <div className="w-80 h-full bg-background/95 backdrop-blur-sm border-r border-border/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Stox AI</h2>
            <p className="text-xs text-muted-foreground">Kişisel Çoklu Market AI Aracı</p>
          </div>
        </div>
        
        <Button 
          onClick={onNewConversation}
          className="w-full justify-start text-sm font-medium"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Konuşma
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Konuşmaları ara..." 
            className="pl-10 text-sm"
          />
        </div>
      </div>

      {/* Conversations */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2 p-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Henüz konuşma yok</p>
              <p className="text-xs">Stox AI ile konuşmaya başlayın</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <Card 
                key={conversation.id}
                className={`cursor-pointer transition-all hover:bg-accent/50 ${
                  activeConversation === conversation.id 
                    ? 'bg-accent border-accent-foreground/20' 
                    : 'border-transparent'
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getCategoryColor(conversation.category)}`}>
                        {getCategoryIcon(conversation.category)}
                        <span className="ml-1 capitalize">{conversation.category}</span>
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <h3 className="font-medium text-sm mb-1 truncate">
                    {conversation.title}
                  </h3>
                  
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {conversation.lastMessage}
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    {conversation.timestamp}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
          <Settings className="w-4 h-4 mr-2" />
          AI Ayarları
        </Button>
      </div>
    </div>
  );
}