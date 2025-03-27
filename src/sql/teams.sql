
-- Teams Table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('owner', 'member')) NOT NULL DEFAULT 'member',
  status TEXT CHECK (status IN ('pending', 'active')) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE (team_id, user_id)
);

-- Team Invitations Table
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined')) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE (team_id, email, status)
);

-- Evaluations Sharing Table
CREATE TABLE IF NOT EXISTS public.shared_evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE (evaluation_id, team_id)
);

-- Add Row Level Security
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_evaluations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Teams
CREATE POLICY "Users can view teams they belong to" 
  ON public.teams FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_members.team_id = teams.id 
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create teams" 
  ON public.teams FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Team owners can update their teams" 
  ON public.teams FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_members.team_id = teams.id 
      AND team_members.user_id = auth.uid() 
      AND team_members.role = 'owner'
    )
  );

CREATE POLICY "Team owners can delete their teams" 
  ON public.teams FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_members.team_id = teams.id 
      AND team_members.user_id = auth.uid() 
      AND team_members.role = 'owner'
    )
  );

-- RLS Policies for Team Members
CREATE POLICY "Users can view members of teams they belong to" 
  ON public.team_members FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members AS tm 
      WHERE tm.team_id = team_members.team_id 
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners can manage team members" 
  ON public.team_members FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members AS tm 
      WHERE tm.team_id = team_members.team_id 
      AND tm.user_id = auth.uid() 
      AND tm.role = 'owner'
    ) OR 
    (team_members.user_id = auth.uid() AND team_members.role = 'member')
  );

CREATE POLICY "Team owners can update team members" 
  ON public.team_members FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members AS tm 
      WHERE tm.team_id = team_members.team_id 
      AND tm.user_id = auth.uid() 
      AND tm.role = 'owner'
    ) OR 
    (team_members.user_id = auth.uid())
  );

CREATE POLICY "Team owners can delete team members" 
  ON public.team_members FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members AS tm 
      WHERE tm.team_id = team_members.team_id 
      AND tm.user_id = auth.uid() 
      AND tm.role = 'owner'
    ) OR 
    (team_members.user_id = auth.uid())
  );

-- RLS Policies for Team Invitations
CREATE POLICY "Users can view invitations for their teams" 
  ON public.team_invitations FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_members.team_id = team_invitations.team_id 
      AND team_members.user_id = auth.uid() 
      AND team_members.role = 'owner'
    ) OR 
    (team_invitations.email = auth.email())
  );

CREATE POLICY "Team owners can create invitations" 
  ON public.team_invitations FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_members.team_id = team_invitations.team_id 
      AND team_members.user_id = auth.uid() 
      AND team_members.role = 'owner'
    )
  );

CREATE POLICY "Users can update their own invitations" 
  ON public.team_invitations FOR UPDATE 
  USING (
    (team_invitations.email = auth.email()) OR
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_members.team_id = team_invitations.team_id 
      AND team_members.user_id = auth.uid() 
      AND team_members.role = 'owner'
    )
  );

CREATE POLICY "Team owners can delete invitations" 
  ON public.team_invitations FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_members.team_id = team_invitations.team_id 
      AND team_members.user_id = auth.uid() 
      AND team_members.role = 'owner'
    )
  );

-- RLS Policies for Shared Evaluations
CREATE POLICY "Users can view shared evaluations for their teams" 
  ON public.shared_evaluations FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_members.team_id = shared_evaluations.team_id 
      AND team_members.user_id = auth.uid()
    ) OR 
    EXISTS (
      SELECT 1 FROM public.evaluations 
      WHERE evaluations.id = shared_evaluations.evaluation_id 
      AND evaluations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can share their evaluations" 
  ON public.shared_evaluations FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.evaluations 
      WHERE evaluations.id = shared_evaluations.evaluation_id 
      AND evaluations.user_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_members.team_id = shared_evaluations.team_id 
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their shared evaluations" 
  ON public.shared_evaluations FOR DELETE 
  USING (
    shared_evaluations.shared_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_members.team_id = shared_evaluations.team_id 
      AND team_members.user_id = auth.uid() 
      AND team_members.role = 'owner'
    )
  );
