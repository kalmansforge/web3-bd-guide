
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, UserPlus, UserX, Mail, Check, X, MoreHorizontal, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types
interface TeamMember {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: 'pending' | 'active';
  role: 'owner' | 'member';
  avatarUrl?: string;
}

interface Team {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  members: TeamMember[];
  invitations?: { email: string; status: 'pending' }[];
}

const TeamsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [invitations, setInvitations] = useState<{id: string, teamId: string, teamName: string}[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isInviteUserOpen, setIsInviteUserOpen] = useState(false);
  const [currentTeamId, setCurrentTeamId] = useState<string>('');
  
  // Fetch teams and invitations
  useEffect(() => {
    if (user) {
      fetchUserTeams();
      fetchUserInvitations();
    }
  }, [user]);

  const fetchUserTeams = async () => {
    try {
      setLoading(true);
      
      // Fetch teams where user is a member
      const { data: memberships, error: membershipError } = await supabase
        .from('team_members')
        .select('*, teams(*)')
        .eq('user_id', user?.id);
        
      if (membershipError) throw membershipError;
      
      if (memberships && memberships.length > 0) {
        // For each team, get all members
        const teamsWithMembers = await Promise.all(
          memberships.map(async (membership) => {
            const { data: teamMembers, error: teamMembersError } = await supabase
              .from('team_members')
              .select('*, profiles(id, first_name, last_name, avatar_url)')
              .eq('team_id', membership.team_id);
              
            if (teamMembersError) throw teamMembersError;
            
            // Format members
            const formattedMembers = teamMembers?.map(member => ({
              id: member.user_id,
              email: member.email,
              firstName: member.profiles?.first_name,
              lastName: member.profiles?.last_name,
              status: member.status,
              role: member.role,
              avatarUrl: member.profiles?.avatar_url
            })) || [];
            
            // Format team
            return {
              id: membership.teams.id,
              name: membership.teams.name,
              description: membership.teams.description,
              createdAt: membership.teams.created_at,
              members: formattedMembers
            };
          })
        );
        
        setTeams(teamsWithMembers);
      } else {
        setTeams([]);
      }
    } catch (error: any) {
      toast.error("Failed to load teams", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInvitations = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('team_invitations')
        .select('*, teams(name)')
        .eq('email', user.email)
        .eq('status', 'pending');
        
      if (error) throw error;
      
      setInvitations(data?.map(invite => ({
        id: invite.id,
        teamId: invite.team_id,
        teamName: invite.teams.name
      })) || []);
    } catch (error: any) {
      toast.error("Failed to load invitations", {
        description: error.message
      });
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error("Team name is required");
      return;
    }
    
    try {
      setLoading(true);
      
      // Create team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: newTeamName.trim(),
          description: newTeamDescription.trim() || null,
          created_by: user?.id
        })
        .select()
        .single();
        
      if (teamError) throw teamError;
      
      if (teamData) {
        // Add current user as owner
        const { error: memberError } = await supabase
          .from('team_members')
          .insert({
            team_id: teamData.id,
            user_id: user?.id,
            email: user?.email,
            role: 'owner',
            status: 'active'
          });
          
        if (memberError) throw memberError;
        
        toast.success("Team created successfully");
        fetchUserTeams();
        setNewTeamName('');
        setNewTeamDescription('');
        setIsCreateTeamOpen(false);
      }
    } catch (error: any) {
      toast.error("Failed to create team", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim() || !currentTeamId) {
      toast.error("Email and team selection are required");
      return;
    }
    
    try {
      setLoading(true);
      
      // Check if user is already a member
      const { data: existingMember, error: checkError } = await supabase
        .from('team_members')
        .select()
        .eq('team_id', currentTeamId)
        .eq('email', inviteEmail.trim());
        
      if (checkError) throw checkError;
      
      if (existingMember && existingMember.length > 0) {
        toast.error("User is already a member of this team");
        return;
      }
      
      // Check if invitation already exists
      const { data: existingInvite, error: inviteCheckError } = await supabase
        .from('team_invitations')
        .select()
        .eq('team_id', currentTeamId)
        .eq('email', inviteEmail.trim())
        .eq('status', 'pending');
        
      if (inviteCheckError) throw inviteCheckError;
      
      if (existingInvite && existingInvite.length > 0) {
        toast.error("An invitation has already been sent to this email");
        return;
      }
      
      // Create invitation
      const { error: inviteError } = await supabase
        .from('team_invitations')
        .insert({
          team_id: currentTeamId,
          email: inviteEmail.trim(),
          invited_by: user?.id,
          status: 'pending'
        });
        
      if (inviteError) throw inviteError;
      
      toast.success("Invitation sent", {
        description: `An invitation has been sent to ${inviteEmail}`
      });
      setInviteEmail('');
      setIsInviteUserOpen(false);
      fetchUserTeams();
    } catch (error: any) {
      toast.error("Failed to send invitation", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId: string, teamId: string) => {
    try {
      setLoading(true);
      
      // Accept invitation
      const { error: updateError } = await supabase
        .from('team_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitationId);
        
      if (updateError) throw updateError;
      
      // Add user as member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: user?.id,
          email: user?.email,
          role: 'member',
          status: 'active'
        });
        
      if (memberError) throw memberError;
      
      toast.success("Invitation accepted");
      fetchUserInvitations();
      fetchUserTeams();
    } catch (error: any) {
      toast.error("Failed to accept invitation", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      setLoading(true);
      
      // Decline invitation
      const { error } = await supabase
        .from('team_invitations')
        .update({ status: 'declined' })
        .eq('id', invitationId);
        
      if (error) throw error;
      
      toast.success("Invitation declined");
      fetchUserInvitations();
    } catch (error: any) {
      toast.error("Failed to decline invitation", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (teamId: string, userId: string) => {
    try {
      setLoading(true);
      
      // Remove member
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      toast.success("Member removed");
      fetchUserTeams();
    } catch (error: any) {
      toast.error("Failed to remove member", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTeam = async (teamId: string) => {
    try {
      setLoading(true);
      
      // Check if user is the owner
      const { data: teamData, error: teamError } = await supabase
        .from('team_members')
        .select('role')
        .eq('team_id', teamId)
        .eq('user_id', user?.id)
        .single();
        
      if (teamError) throw teamError;
      
      if (teamData.role === 'owner') {
        // Count other members
        const { data: membersData, error: countError } = await supabase
          .from('team_members')
          .select('count')
          .eq('team_id', teamId);
          
        if (countError) throw countError;
        
        const count = membersData[0]?.count;
        
        if (count > 1) {
          toast.error("You cannot leave a team you own with active members. Transfer ownership or remove members first.");
          return;
        }
        
        // Delete the team completely
        const { error: deleteTeamError } = await supabase
          .from('teams')
          .delete()
          .eq('id', teamId);
          
        if (deleteTeamError) throw deleteTeamError;
        
        toast.success("Team deleted");
      } else {
        // Leave team
        const { error: leaveError } = await supabase
          .from('team_members')
          .delete()
          .eq('team_id', teamId)
          .eq('user_id', user?.id);
          
        if (leaveError) throw leaveError;
        
        toast.success("You've left the team");
      }
      
      fetchUserTeams();
    } catch (error: any) {
      toast.error("Failed to leave team", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get initials from name
  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return `${firstName[0]}`.toUpperCase();
    } else if (email) {
      return email[0].toUpperCase();
    }
    return "?";
  };

  return (
    <AppLayout>
      <PageHeader
        title="Teams"
        description="Manage your teams and collaborate on project evaluations"
        actions={
          <Button onClick={() => setIsCreateTeamOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Team
          </Button>
        }
      />
      
      <Tabs defaultValue="teams" className="mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="teams">My Teams</TabsTrigger>
          <TabsTrigger value="invitations" className="relative">
            Invitations
            {invitations.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-white">
                {invitations.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="teams" className="mt-6">
          {loading && (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          {!loading && teams.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No Teams Yet</CardTitle>
                <CardDescription>Create a team to start collaborating with others</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Teams allow you to share project evaluations and collaborate with colleagues.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setIsCreateTeamOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Team
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {!loading && teams.length > 0 && (
            <div className="space-y-6">
              {teams.map((team) => (
                <Card key={team.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{team.name}</CardTitle>
                        <CardDescription>{team.description || "No description"}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Team Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          {team.members.find(m => m.id === user?.id)?.role === 'owner' && (
                            <DropdownMenuItem 
                              onClick={() => {
                                setCurrentTeamId(team.id);
                                setIsInviteUserOpen(true);
                              }}
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              Invite User
                            </DropdownMenuItem>
                          )}
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <UserX className="mr-2 h-4 w-4" />
                                Leave Team
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Leave Team?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to leave this team? 
                                  {team.members.find(m => m.id === user?.id)?.role === 'owner' 
                                    ? " As the owner, leaving will delete the team if there are no other members." 
                                    : " You will no longer have access to shared evaluations."}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleLeaveTeam(team.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Leave Team
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <h3 className="text-sm font-medium mb-3">Team Members</h3>
                    <div className="space-y-3">
                      {team.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={member.avatarUrl || undefined} alt={member.firstName || member.email} />
                              <AvatarFallback>
                                {getInitials(member.firstName, member.lastName, member.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {member.firstName && member.lastName 
                                  ? `${member.firstName} ${member.lastName}` 
                                  : member.email}
                              </p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {member.role === 'owner' && (
                              <Badge variant="outline" className="text-xs">Owner</Badge>
                            )}
                            
                            {member.id !== user?.id && team.members.find(m => m.id === user?.id)?.role === 'owner' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <UserX className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove this member from the team?
                                      They will no longer have access to shared evaluations.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleRemoveMember(team.id, member.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="invitations" className="mt-6">
          {loading && (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          {!loading && invitations.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No Invitations</CardTitle>
                <CardDescription>You don't have any pending team invitations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  When someone invites you to join their team, you'll see their invitation here.
                </p>
              </CardContent>
            </Card>
          )}
          
          {!loading && invitations.length > 0 && (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <Card key={invitation.id}>
                  <CardHeader>
                    <CardTitle>Invitation to Join</CardTitle>
                    <CardDescription>You've been invited to join a team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{invitation.teamName}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleDeclineInvitation(invitation.id)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                    <Button 
                      onClick={() => handleAcceptInvitation(invitation.id, invitation.teamId)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Create Team Dialog */}
      <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Create a team to collaborate with colleagues on project evaluations
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input 
                id="team-name" 
                value={newTeamName} 
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="team-description">Description (Optional)</Label>
              <Input 
                id="team-description" 
                value={newTeamDescription} 
                onChange={(e) => setNewTeamDescription(e.target.value)}
                placeholder="Enter team description"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateTeamOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTeam} disabled={loading}>
              {loading ? "Creating..." : "Create Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Invite User Dialog */}
      <Dialog open={isInviteUserOpen} onOpenChange={setIsInviteUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your team
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input 
                    id="invite-email" 
                    type="email"
                    value={inviteEmail} 
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteUserOpen(false)}>Cancel</Button>
            <Button onClick={handleInviteUser} disabled={loading}>
              {loading ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default TeamsPage;
