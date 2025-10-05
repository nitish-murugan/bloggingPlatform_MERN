import React, { useEffect, useRef, useCallback, useState } from 'react';
import axios from 'axios';
import styles from './GoogleSignIn.module.css';

const GoogleSignIn = ({ onNavigate }) => {
  const googleButtonRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialResponse = useCallback(async (response) => {
    setIsLoading(true);
    try {
      const result = await axios.post('https://bloggingplatform-mern.onrender.com/api/auth/google-signin', {
        credential: response.credential
      });

      if (result.data.success) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        
        const user = result.data.user;
        if (user && user.role === 'admin') {
          onNavigate('admin');
        } else {
          onNavigate('blog');
        }
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [onNavigate]);

  const initializeGoogleSignIn = useCallback(() => {
    const clientId = '690974041510-onrejlos8mu9jjp3nu96fkvufn52uk3j.apps.googleusercontent.com';
    
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      console.warn('Google Client ID not configured properly');
      return;
    }

    // Clear any existing buttons first
    if (googleButtonRef.current) {
      googleButtonRef.current.innerHTML = '';
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    if (googleButtonRef.current) {
      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: '100%'
        }
      );
    }
  }, [handleCredentialResponse]);

  useEffect(() => {
    const buttonElement = googleButtonRef.current;
    
    if (window.google && buttonElement) {
      initializeGoogleSignIn();
    } else if (!window.google) {
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (script) {
        script.onload = () => {
          if (googleButtonRef.current) {
            initializeGoogleSignIn();
          }
        };
      }
    }

    // Cleanup function to remove any duplicate buttons
    return () => {
      if (buttonElement) {
        buttonElement.innerHTML = '';
      }
    };
  }, [initializeGoogleSignIn]);

  return (
    <div className={styles.googleSignInContainer}>
      {isLoading ? (
        <div className={styles.loadingState}>
          <span>Signing in with Google...</span>
        </div>
      ) : (
        <div ref={googleButtonRef} className={styles.googleButton}></div>
      )}
    </div>
  );
};

export default GoogleSignIn;
