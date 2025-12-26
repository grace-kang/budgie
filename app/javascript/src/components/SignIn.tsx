import React from 'react';
import GoogleIcon from '/icons/google-logo.svg';
import Logo from './Logo';

export default function SignIn() {
  const csrfToken =
    (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

  return (
    <div className="signin-container">
      <form method="post" action="/auth/google_oauth2" className="signin-card">
        <div className="signin-logo">
          <Logo className="signin-logo-icon" size={64} />
        </div>
        <h1 className="signin-title">Welcome Back</h1>
        <p className="signin-subtitle">Sign in to your account using Google</p>

        <input type="hidden" name="authenticity_token" value={csrfToken} />

        <button type="submit" className="google-btn">
          <img src={GoogleIcon} alt="Google Logo" className="google-icon" />
          <span>Sign in with Google</span>
        </button>

        <p className="signin-footer">
          By continuing, you agree to our <a href="/terms">Terms of Service</a> and{' '}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </form>
    </div>
  );
}
