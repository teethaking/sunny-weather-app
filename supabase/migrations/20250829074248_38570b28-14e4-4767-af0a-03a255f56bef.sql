-- Enable realtime for existing tables
ALTER TABLE public.check_ins REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication (this might fail if already added, which is fine)
DO $$
BEGIN
    -- Add check_ins to realtime if not already added
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.check_ins;
    EXCEPTION
        WHEN duplicate_object THEN
            -- Table already in publication
            NULL;
    END;
    
    -- Add profiles to realtime if not already added
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
    EXCEPTION
        WHEN duplicate_object THEN
            -- Table already in publication
            NULL;
    END;
END $$;