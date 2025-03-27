
-- Table for storing user-configurable thresholds
CREATE TABLE IF NOT EXISTS public.threshold_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  metric_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  t0_threshold TEXT NOT NULL,
  t1_threshold TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, metric_id, category_id)
);

-- Enable RLS
ALTER TABLE public.threshold_configs ENABLE ROW LEVEL SECURITY;

-- Grant access to authenticated users
CREATE POLICY "Users can view their own threshold configs" 
  ON public.threshold_configs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own threshold configs" 
  ON public.threshold_configs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own threshold configs" 
  ON public.threshold_configs FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own threshold configs" 
  ON public.threshold_configs FOR DELETE 
  USING (auth.uid() = user_id);
