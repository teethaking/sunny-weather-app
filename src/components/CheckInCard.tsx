import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CheckInCardProps {
  lastCheckIn?: string;
}

export const CheckInCard = ({ lastCheckIn }: CheckInCardProps) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const { toast } = useToast();

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    toast({
      title: "Daily Check-in Complete! ✨",
      description: "Hope you have a wonderful day ahead!",
    });
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="gradient-card shadow-card border-0 p-6 transition-smooth">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-card-foreground">Daily Check-in</h3>
        </div>
        
        <p className="text-muted-foreground">{today}</p>
        
        {!isCheckedIn ? (
          <Button 
            onClick={handleCheckIn}
            className="w-full shadow-weather transition-smooth hover:shadow-lg"
            size="lg"
          >
            Check in for today
          </Button>
        ) : (
          <div className="flex items-center justify-center space-x-2 py-3 bg-secondary/50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">Checked in for today!</span>
          </div>
        )}
        
        {lastCheckIn && (
          <p className="text-sm text-muted-foreground text-center">
            Last check-in: {lastCheckIn}
          </p>
        )}
      </div>
    </Card>
  );
};