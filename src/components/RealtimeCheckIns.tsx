import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, MapPin, Thermometer } from 'lucide-react';
import { useRealTime } from '@/hooks/useRealTime';
import { formatDistanceToNow } from 'date-fns';

interface RealtimeCheckInsProps {
  onLocationChange: (location: string) => void;
}

export const RealtimeCheckIns: React.FC<RealtimeCheckInsProps> = ({ onLocationChange }) => {
  const { checkIns, onlineUsers, loading } = useRealTime();

  if (loading) {
    return (
      <Card className="backdrop-blur-sm bg-background/80 border-white/20">
        <CardHeader>
          <CardTitle className="text-lg">Live Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Online Users */}
      {onlineUsers.length > 0 && (
        <Card className="backdrop-blur-sm bg-background/80 border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {onlineUsers.length} user{onlineUsers.length !== 1 ? 's' : ''} online
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {onlineUsers.slice(0, 5).map((user) => (
                <Badge key={user.user_id} variant="secondary" className="text-xs">
                  {user.display_name}
                </Badge>
              ))}
              {onlineUsers.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{onlineUsers.length - 5} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Check-ins */}
      <Card className="backdrop-blur-sm bg-background/80 border-white/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Live Check-ins
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {checkIns.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No check-ins yet today. Be the first to check in!
            </p>
          ) : (
            checkIns.map((checkIn) => (
              <div
                key={checkIn.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors animate-fade-in cursor-pointer"
                onClick={() => onLocationChange(checkIn.location)}
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="text-xs">
                    {(checkIn.display_name || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      {checkIn.display_name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(checkIn.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {checkIn.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3" />
                      {checkIn.temperature}°C
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {checkIn.weather_condition}
                    </Badge>
                    {checkIn.mood && (
                      <Badge variant="secondary" className="text-xs">
                        {checkIn.mood}
                      </Badge>
                    )}
                  </div>
                  
                  {checkIn.notes && (
                    <p className="text-xs text-muted-foreground italic">
                      "{checkIn.notes}"
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};