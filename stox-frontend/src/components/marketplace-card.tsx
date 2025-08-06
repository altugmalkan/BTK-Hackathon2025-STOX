import React from "react";
import { ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge, { StatusType } from "./status-badge";
import { cn } from "@/lib/utils";

interface MarketplaceCardProps {
  name: string;
  logo: string;
  status: StatusType;
  url?: string;
  error?: string;
  lastSync?: string;
  className?: string;
}

export default function MarketplaceCard({
  name,
  logo,
  status,
  url,
  error,
  lastSync,
  className
}: MarketplaceCardProps) {
  return (
    <Card className={cn("marketplace-card group", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-background-muted rounded-lg flex items-center justify-center p-1">
              <img 
                src={logo} 
                alt={`${name} logo`} 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-medium">{name}</span>
          </div>
          <StatusBadge status={status} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-start space-x-2 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <div className="text-sm text-destructive">
              <p className="font-medium">Yayın Hata</p>
              <p className="text-destructive/80">{error}</p>
            </div>
          </div>
        )}
        
        {lastSync && (
          <p className="text-sm text-muted-foreground">
            Son senkronizasyon: {lastSync}
          </p>
        )}
        
        <div className="flex items-center justify-between pt-2">
          {url ? (
            <Button variant="outline" size="sm" asChild>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Listelemeyi Görüntüle
              </a>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" disabled>
              Yayınlanmamış
            </Button>
          )}
          
          {status === "error" && (
            <Button variant="outline" size="sm">
              Tekrar Dene
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}