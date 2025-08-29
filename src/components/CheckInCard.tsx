import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Calendar, Trophy, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRealTime } from "@/hooks/useRealTime";

interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
}

interface CheckInCardProps {
  lastCheckIn: string;
  currentWeather: WeatherData;
}

export const CheckInCard: React.FC<CheckInCardProps> = ({ lastCheckIn, currentWeather }) => {
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [todayCheckIn, setTodayCheckIn] = useState<any>(null);
  const { toast } = useToast();
  const { createCheckIn, checkIns } = useRealTime();

  // Check if user already checked in today
  useEffect(() => {
    const today = new Date().toDateString();
    const todaysCheckIn = checkIns.find(checkIn => 
      new Date(checkIn.created_at).toDateString() === today
    );
    setTodayCheckIn(todaysCheckIn);
  }, [checkIns]);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const { error } = await createCheckIn({
        weather_condition: currentWeather.condition,
        temperature: currentWeather.temperature,
        location: currentWeather.location,
        mood: mood || undefined,
        notes: notes || undefined
      });

      if (error) {
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') { 
          toast({
            title: "Already checked in today!",
            description: "You can only check in once per day.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Check-in successful! 🎉",
          description: `Recorded your ${currentWeather.condition} day in ${currentWeather.location}`,
        });
        setOpen(false);
        setMood("");
        setNotes("");
      }
    } catch (error) {
      console.error('Check-in error:', error);
      toast({
        title: "Check-in failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-background/80 border-white/20">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5" />
          Daily Check-in
        </CardTitle>
        <CardDescription>
          {todayCheckIn ? "You've checked in today!" : "Share how you're feeling today"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {todayCheckIn ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Checked in at {new Date(todayCheckIn.created_at).toLocaleTimeString()}
              </p>
              {todayCheckIn.mood && (
                <p className="text-sm">
                  <strong>Mood:</strong> {todayCheckIn.mood}
                </p>
              )}
              {todayCheckIn.notes && (
                <p className="text-sm italic">"{todayCheckIn.notes}"</p>
              )}
            </div>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">Streak: Day 1</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Last check-in: {lastCheckIn}
            </div>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                  <Zap className="w-4 h-4 mr-2" />
                  Check In Now
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Daily Check-in</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{currentWeather.temperature}°C</p>
                      <p className="text-sm text-muted-foreground">{currentWeather.condition}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{currentWeather.location}</p>
                      <p className="text-xs text-muted-foreground">Current location</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mood">How are you feeling?</Label>
                    <Select value={mood} onValueChange={setMood}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your mood" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="😊 Happy">😊 Happy</SelectItem>
                        <SelectItem value="😌 Calm">😌 Calm</SelectItem>
                        <SelectItem value="😔 Sad">😔 Sad</SelectItem>
                        <SelectItem value="😴 Tired">😴 Tired</SelectItem>
                        <SelectItem value="🤗 Grateful">🤗 Grateful</SelectItem>
                        <SelectItem value="😰 Anxious">😰 Anxious</SelectItem>
                        <SelectItem value="🔥 Energetic">🔥 Energetic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="How was your day? Any thoughts to share..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {notes.length}/200
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleCheckIn}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Checking in..." : "Complete Check-in"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};