-- Create check_ins table for daily check-ins
CREATE TABLE public.check_ins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weather_condition TEXT NOT NULL,
  temperature INTEGER NOT NULL,
  location TEXT NOT NULL,
  mood TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  check_in_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Create unique constraint to prevent multiple check-ins per day
CREATE UNIQUE INDEX idx_check_ins_user_date ON public.check_ins (user_id, check_in_date);

-- Enable Row Level Security
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

-- Create policies for check_ins
CREATE POLICY "Check-ins are viewable by everyone" 
ON public.check_ins 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own check-ins" 
ON public.check_ins 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own check-ins" 
ON public.check_ins 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own check-ins" 
ON public.check_ins 
FOR DELETE 
USING (auth.uid() = user_id);

-- Enable realtime for the tables
ALTER TABLE public.check_ins REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.check_ins;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;