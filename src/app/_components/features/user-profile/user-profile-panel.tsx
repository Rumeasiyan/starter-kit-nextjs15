'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  Edit3,
  History,
  LogOut,
  Shield,
  User,
  Save,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/_components/ui/tabs';
import {
  DialogPanel,
  DialogPanelHeader,
  DialogPanelBody,
  DialogPanelFooter,
} from '@/app/_components/features/user-profile/dialog-panel';
import { ImageUpload } from '@/app/_components/features/user-profile/image-upload';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/_components/ui/tooltip';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/app/_components/ui/alert';
import { PasswordChangeDialog } from '@/app/_components/features/user-profile/password-change-dialog';
import { cn } from '@/lib/utils';
import { deleteUser, signOut } from '@/lib/auth/auth-client';
import { useSession } from '@/lib/auth/auth-client';
import Image from 'next/image';
import { Separator } from '@radix-ui/react-separator';
import { updateUser } from '@/lib/auth/auth-client';
import { canDeleteAccount } from '@/configs/settings/canDeleteAccount';

interface UserProfilePanelProps {
  open: boolean;
  onClose: () => void;
}

type AuditLog = {
  id: string;
  action: string;
  description: string;
  createdAt: Date;
};

export function UserProfilePanel({ open, onClose }: UserProfilePanelProps) {
  const { data } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: data?.user?.name || '',
    email: data?.user?.email || '',
    avatar: data?.user?.image || '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [activities, setActivities] = useState<AuditLog[]>([]);

  useEffect(() => {
    if (data?.user) {
      setFormData({
        name: data?.user?.name || '',
        email: data?.user?.email || '',
        avatar: data?.user?.image || '',
      });
    }
  }, [data]);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      const response = await fetch('/api/audit-logs');
      const data = await response.json();
      setActivities(data);
    };

    fetchAuditLogs();
  }, []);

  useEffect(() => {
    if (isEditing) {
      setSaveSuccess(false);
      setSaveError(null);
    }
  }, [isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAvatarChange = (value: string) => {
    setFormData((prev) => ({ ...prev, avatar: value }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSaveError('Please fix the errors in the form');
      return;
    }
    setSaveSuccess(false);
    setSaveError(null);

    try {
      // Update user information
      const { error: updateError } = await updateUser({
        name: formData.name,
        image: formData.avatar,
      });

      if (updateError) {
        setSaveError(
          updateError.message || 'Failed to save changes. Please try again.'
        );
        return;
      }

      setSaveSuccess(true);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      setSaveError('Failed to save changes. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: data?.user?.name || '',
      email: data?.user?.email || '',
      avatar: data?.user?.image || '',
    });
    setFormErrors({});
    setSaveError(null);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
    router.push('/login');
  };

  const handlePasswordChangeSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteAccount = async () => {
    await deleteUser({
      callbackURL: '/goodbye',
    });
    onClose();
    router.push('/goodbye');
  };

  return (
    <DialogPanel
      open={open}
      onClose={onClose}
      position="center"
      className="flex max-h-[90vh] flex-col md:max-h-[85vh]"
    >
      <DialogPanelHeader
        onClose={onClose}
        className="border-b"
      >
        <h2 className="text-xl font-semibold">My Profile</h2>
      </DialogPanelHeader>

      <DialogPanelBody className="flex-1 overflow-auto p-0">
        <div className="h-32"></div>
        <div className="relative px-6 pb-6">
          <div className="animate-fade-in -mt-16 mb-6 flex flex-col items-center">
            <div className="relative">
              {isEditing ? (
                <ImageUpload
                  value={formData.avatar}
                  onChange={handleAvatarChange}
                  className="h-32 w-32"
                  previewClassName="h-32 w-32"
                  dropzoneText="Upload photo"
                />
              ) : (
                <div className="relative">
                  <div className="h-32 w-32 rounded-full">
                    {data?.user?.image ? (
                      <Image
                        src={data.user.image}
                        className="rounded-full"
                        alt="Profile"
                        width={128}
                        height={128}
                        unoptimized={false}
                        priority={true}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = ''; // Clear the src to trigger fallback
                          target.onerror = null; // Prevent infinite loop
                        }}
                      />
                    ) : (
                      <User className="h-full w-full" />
                    )}
                  </div>
                  {!isEditing && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="absolute right-0 bottom-0 h-8 w-8 rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
                            onClick={() => setIsEditing(true)}
                          >
                            <Edit3 className="h-4 w-4" />
                            <span className="sr-only">
                              Edit profile picture
                            </span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit profile</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              )}
            </div>
            <h3 className="mt-4 text-2xl font-bold">{formData.name}</h3>
            <p className="text-muted-foreground text-sm">{formData.email}</p>

            {saveSuccess && (
              <Alert className="mt-4 w-full max-w-md border-green-200 bg-green-50 text-green-800">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Your profile has been updated successfully.
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-6 w-full">
              <Tabs
                defaultValue="profile"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-4 w-full">
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:bg-primary/10"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="data-[state=active]:bg-primary/10"
                  >
                    <History className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Activity</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="profile"
                  className="animate-fade-in space-y-6"
                >
                  <div className="flex flex-col gap-6">
                    <div className="bg-card/30 hover:bg-card/50 overflow-hidden rounded-xl border shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
                      <div className="p-5">
                        <h3 className="flex items-center font-medium">
                          <User className="text-primary mr-2 h-4 w-4" />
                          Personal Information
                          {!isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-auto h-8 w-8 p-0"
                              onClick={() => setIsEditing(true)}
                            >
                              <Edit3 className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          )}
                        </h3>

                        <form
                          onSubmit={handleSubmit}
                          className="mt-4 space-y-4"
                        >
                          {saveError && (
                            <Alert
                              variant="destructive"
                              className="py-2"
                            >
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Error</AlertTitle>
                              <AlertDescription>{saveError}</AlertDescription>
                            </Alert>
                          )}

                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="name"
                                className={
                                  isEditing && formErrors.firstName
                                    ? 'text-destructive'
                                    : ''
                                }
                              >
                                Name{' '}
                                {isEditing && (
                                  <span className="text-destructive">*</span>
                                )}
                              </Label>
                              <div className="gap-2= grid grid-cols-1">
                                <div>
                                  <Input
                                    id="name"
                                    name="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={cn(
                                      'bg-background/50 border-muted',
                                      isEditing &&
                                        formErrors.name &&
                                        'border-destructive'
                                    )}
                                  />
                                  {isEditing && formErrors.name && (
                                    <p className="text-destructive mt-1 text-xs">
                                      {formErrors.name}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor="email"
                                className={
                                  isEditing && formErrors.email
                                    ? 'text-destructive'
                                    : ''
                                }
                              >
                                Email address{' '}
                                {isEditing && (
                                  <span className="text-destructive">*</span>
                                )}
                              </Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={true}
                                className="bg-background/50 border-muted"
                              />
                              {isEditing && formErrors.email && (
                                <p className="text-destructive mt-1 text-xs">
                                  {formErrors.email}
                                </p>
                              )}
                            </div>
                          </div>

                          {isEditing && (
                            <div className="flex flex-col justify-end space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                className="w-full sm:w-auto"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                className="w-full sm:w-auto"
                              >
                                <Save className="mr-2 h-4 w-4" />
                                Save changes
                              </Button>
                            </div>
                          )}
                        </form>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="bg-card/30 hover:bg-card/50 overflow-hidden rounded-xl border shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
                        <div className="p-5">
                          <h3 className="flex items-center font-medium">
                            <Shield className="text-primary mr-2 h-4 w-4" />
                            Account Security
                          </h3>
                          <div className="mt-4 space-y-4">
                            <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
                              <div>
                                <p className="text-sm font-medium">Password</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPasswordDialogOpen(true)}
                              >
                                Change
                              </Button>
                            </div>
                            {/* <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
                              <div>
                                <p className="text-sm font-medium">
                                  Two-factor authentication
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  Not enabled
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                Enable
                              </Button>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    {canDeleteAccount && (
                      <div className="flex-1">
                        <div className="bg-card/30 hover:bg-card/50 overflow-hidden rounded-xl border shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
                          <div className="p-5">
                            <div className="space-y-4">
                              <h4 className="text-destructive text-sm font-medium">
                                Danger Zone
                              </h4>
                              <div className="space-y-2">
                                <Button
                                  variant="outline"
                                  className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive w-full"
                                  onClick={handleDeleteAccount}
                                >
                                  Delete account
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent
                  value="activity"
                  className="animate-fade-in"
                >
                  <div className="bg-card/30 overflow-hidden rounded-xl border shadow-sm backdrop-blur-sm">
                    <div className="p-5">
                      <h3 className="flex items-center font-medium">
                        <History className="text-primary mr-2 h-4 w-4" />
                        Recent Activity
                      </h3>

                      <div className="mt-4 space-y-4">
                        <div className="space-y-4">
                          {activities.length > 0 ? (
                            activities.map((activity) => (
                              <div
                                key={activity.id}
                                className="bg-background/50 hover:bg-background/80 flex items-start gap-3 rounded-lg border p-3 transition-all"
                              >
                                <div className="flex-1">
                                  <div className="flex flex-col justify-between sm:flex-row">
                                    <p className="text-sm font-medium">
                                      {activity.action}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                      {activity.createdAt.toLocaleString()}
                                    </p>
                                  </div>
                                  <p className="text-muted-foreground mt-1 text-xs">
                                    {activity.description}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground text-sm">
                              No activity yet
                            </p>
                          )}
                        </div>

                        {/* <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          View all activity
                        </Button> */}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <Separator className="my-4" />
          </div>
        </div>
      </DialogPanelBody>

      <DialogPanelFooter className="border-t">
        {activeTab === 'profile' && !isEditing ? (
          <div className="flex w-full flex-col justify-between gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive w-full sm:w-auto"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto"
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Edit profile
            </Button>
          </div>
        ) : (
          <Button
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        )}
      </DialogPanelFooter>
      <PasswordChangeDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        onSuccess={handlePasswordChangeSuccess}
      />
    </DialogPanel>
  );
}
