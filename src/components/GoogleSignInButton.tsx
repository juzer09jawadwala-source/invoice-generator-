import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';

interface GoogleSignInButtonProps {
  className?: string;
  onSuccessCallback?: () => void;
}

export function GoogleSignInButton({ className, onSuccessCallback }: GoogleSignInButtonProps) {
  const { loginWithCredential } = useAuth();
  const { showToast } = useToast();

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const ok = loginWithCredential(credentialResponse.credential);
      if (ok) {
        showToast('Signed in with Google successfully!', 'success');
        onSuccessCallback?.();
      } else {
        showToast('Could not verify Google credentials', 'error');
      }
    }
  };

  const handleError = () => {
    showToast('Google sign-in failed. Please try again.', 'error');
  };

  return (
    <div className={className}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="filled_black"
        shape="rectangular"
        size="medium"
        text="signin"
      />
    </div>
  );
}
