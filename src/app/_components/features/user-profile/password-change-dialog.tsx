'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, AlertCircle, Check } from 'lucide-react';

import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/_components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/app/_components/ui/alert';
import { PasswordStrength } from '@/app/_components/features/user-profile/password-strength';
import { changePassword } from '@/lib/auth/auth-client';
import { useSession } from '@/lib/auth/auth-client';
import type { UserType } from '@/configs/types/user';

interface Account {
  providerId: string;
  password?: string | null;
}

interface SessionUser extends UserType {
  accounts?: Account[];
}

interface PasswordChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PasswordChangeDialog({
  open,
  onOpenChange,
}: PasswordChangeDialogProps) {
  const { data: session } = useSession();
  const user = session?.user as SessionUser | undefined;
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);

  useEffect(() => {
    const checkCredentials = async () => {
      try {
        const response = await fetch(
          `/api/auth/check-credentials?userId=${user?.id}`
        );
        const data = await response.json();

        if (response.ok) {
          setHasPassword(data.hasCredentials);
        } else {
          console.error('Failed to check credentials:', data.error);
        }
      } catch (error) {
        console.error('Error checking credentials:', error);
      }
    };

    checkCredentials();
  }, [user?.id]);

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

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!hasPassword && !formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      errors.newPassword =
        'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (hasPassword) {
        const { error } = await changePassword({
          newPassword: formData.newPassword,
          currentPassword: formData.currentPassword,
          revokeOtherSessions: false, // revoke all other sessions the user is signed into
        });

        if (error) {
          console.log('error', error);
          setSubmitError(
            error.message || 'Failed to change password. Please try again.'
          );
          setIsSubmitting(false);
          return;
        }

        setSubmitSuccess(true);
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error('Error changing password:', error);
      setSubmitError('Failed to change password. Please try again.');
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setFormErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {hasPassword ? 'Change Password' : 'Set Password'}
          </DialogTitle>
          <DialogDescription>
            {hasPassword
              ? 'Update your password to keep your account secure.'
              : 'To set up a password for your account, please use the "Forgot Password" option on the login screen.'}
          </DialogDescription>
        </DialogHeader>

        {submitSuccess ? (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Your password has been changed successfully.
            </AlertDescription>
          </Alert>
        ) : !hasPassword ? (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Password Set</AlertTitle>
              <AlertDescription>
                Since you signed up using a social account, you don&apos;t have
                a password set yet. To set up a password:
                <ol className="mt-2 list-decimal space-y-1 pl-4">
                  <li>Go to the login screen</li>
                  <li>Click on &ldquo;Forgot Password&rdquo;</li>
                  <li>Enter your email address</li>
                  <li>
                    Follow the instructions in the email to set your password
                  </li>
                </ol>
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="currentPassword"
                className={formErrors.currentPassword ? 'text-destructive' : ''}
              >
                Current Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`pl-10 ${formErrors.currentPassword ? 'border-destructive' : ''}`}
                  disabled={isSubmitting}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-10 w-10 hover:bg-transparent focus-visible:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={isSubmitting}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                  <span className="sr-only">
                    {showCurrentPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
              {formErrors.currentPassword && (
                <p className="text-destructive text-xs">
                  {formErrors.currentPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className={formErrors.newPassword ? 'text-destructive' : ''}
              >
                New Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`pl-10 ${formErrors.newPassword ? 'border-destructive' : ''}`}
                  disabled={isSubmitting}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-10 w-10 hover:bg-transparent focus-visible:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isSubmitting}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                  <span className="sr-only">
                    {showNewPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
              {formErrors.newPassword ? (
                <p className="text-destructive text-xs">
                  {formErrors.newPassword}
                </p>
              ) : (
                <p className="text-muted-foreground text-xs">
                  Password must be at least 8 characters and include uppercase,
                  lowercase, and numbers.
                </p>
              )}

              {formData.newPassword && !formErrors.newPassword && (
                <PasswordStrength password={formData.newPassword} />
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className={formErrors.confirmPassword ? 'text-destructive' : ''}
              >
                Confirm New Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pl-10 ${formErrors.confirmPassword ? 'border-destructive' : ''}`}
                  disabled={isSubmitting}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-10 w-10 hover:bg-transparent focus-visible:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
              {formErrors.confirmPassword && (
                <p className="text-destructive text-xs">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Changing Password...' : 'Change Password'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
