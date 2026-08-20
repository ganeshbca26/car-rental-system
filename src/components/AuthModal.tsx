import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  KeyRound, 
  AlertCircle, 
  Car, 
  Sparkles,
  RefreshCw,
  Fingerprint,
  Check
} from 'lucide-react';

export type AuthMode = 'login' | 'signup' | 'forgot-password';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
  onLoginSuccess?: (user: { name: string; email: string; role?: string }) => void;
  onSignupSuccess?: (user: { name: string; email: string; role?: string }) => void;
  onAuthSuccess?: (name: string, email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onLoginSuccess,
  onSignupSuccess,
  onAuthSuccess
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Sync mode when initialMode changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessMsg(null);
      setForgotStep('request');
    }
  }, [isOpen, initialMode]);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('ganesh@ridemate.io');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // Signup Form States
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [hasDriversLicense, setHasDriversLicense] = useState(true);

  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'verify' | 'completed'>('request');
  const [resetCode, setResetCode] = useState(['4', '8', '2', '9', '1', '7']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const notifySuccess = (user: { name: string; email: string; role?: string }, isSignup = false) => {
    if (isSignup && onSignupSuccess) {
      onSignupSuccess(user);
    } else if (onLoginSuccess) {
      onLoginSuccess(user);
    }
    if (onAuthSuccess) {
      onAuthSuccess(user.name, user.email);
    }
  };

  // Password strength calculation for signup
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const passwordStrength = calculatePasswordStrength(
    mode === 'signup' ? signupPassword : newPassword
  );

  // Quick Demo Logins
  const handleQuickLogin = (name: string, email: string, role: string) => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      notifySuccess({ name, email, role });
      onClose();
    }, 400);
  };

  // Handle Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Derive display name from email or default
      const displayName = loginEmail.includes('@')
        ? loginEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : 'Ganesh J.';

      notifySuccess({
        name: displayName,
        email: loginEmail,
        role: loginEmail.toLowerCase().includes('admin') ? 'Administrator' : 'Verified Member'
      });
      onClose();
    }, 600);
  };

  // Handle Signup Submission
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signupName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      notifySuccess({
        name: signupName.trim(),
        email: signupEmail.trim(),
        role: 'Verified Driver'
      }, true);
      onClose();
    }, 700);
  };

  // Handle Forgot Password - Step 1: Send Request
  const handleForgotRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setError('Please provide a valid account email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotStep('verify');
      setSuccessMsg(`A 6-digit security reset code has been dispatched to ${forgotEmail}`);
    }, 700);
  };

  // Handle Forgot Password - Step 2: Code Verification & Reset
  const handleForgotVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (resetCode.some((digit) => !digit.trim())) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotStep('completed');
      setSuccessMsg('Your password has been successfully updated!');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Header Accent */}
        <div className="h-2 w-full bg-linear-to-r from-[#0051d5] via-[#2563eb] to-[#0c9488]" />

        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors z-20 cursor-pointer"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Brand Header */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#0051d5] flex items-center justify-center text-white shadow-xs">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-tight">
                RIDEMATE
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Member Portal
              </span>
            </div>
          </div>

          {/* Navigation Tab Header (Login vs Signup) */}
          {mode !== 'forgot-password' && (
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 border border-slate-200/80">
              <button
                id="auth-tab-login-btn"
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                id="auth-tab-signup-btn"
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium">{error}</div>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-800 text-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="font-medium">{successMsg}</div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODE 1: LOGIN FORM */}
          {/* ========================================================================= */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email-input"
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0051d5] focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    id="login-forgot-password-link"
                    type="button"
                    onClick={() => {
                      setMode('forgot-password');
                      setForgotStep('request');
                      setForgotEmail(loginEmail);
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs font-semibold text-[#0051d5] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0051d5] focus:outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-md border-slate-300 text-[#0051d5] focus:ring-[#0051d5]"
                  />
                  <span className="text-xs font-medium text-slate-600">Keep me logged in</span>
                </label>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-[#0051d5] hover:bg-[#003ea8] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* 1-Click Fast Test Logins */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
                  Quick Demo One-Click Sign In
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('Ganesh J.', 'ganesh@ridemate.io', 'Administrator')}
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>Admin Demo</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0051d5]" />
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">ganesh@ridemate.io</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('Sarah Jenkins', 'sarah@ridemate.io', 'Verified Member')}
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>Customer Demo</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">sarah@ridemate.io</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* MODE 2: SIGNUP FORM */}
          {/* ========================================================================= */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-name-input"
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0051d5] focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-email-input"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="alex@domain.com"
                      required
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0051d5] focus:outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-phone-input"
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+1 (555) 019-2831"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0051d5] focus:outline-hidden transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min. 6 chars"
                      required
                      className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0051d5] focus:outline-hidden transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-confirm-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0051d5] focus:outline-hidden transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Password strength meter */}
              {signupPassword && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>Password strength:</span>
                    <span className={
                      passwordStrength >= 75 ? 'text-emerald-600' :
                      passwordStrength >= 50 ? 'text-amber-600' : 'text-rose-600'
                    }>
                      {passwordStrength >= 75 ? 'Strong' : passwordStrength >= 50 ? 'Medium' : 'Weak'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        passwordStrength >= 75 ? 'bg-emerald-500' :
                        passwordStrength >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.max(passwordStrength, 15)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={hasDriversLicense}
                    onChange={(e) => setHasDriversLicense(e.target.checked)}
                    className="w-4 h-4 rounded-md border-slate-300 text-[#0051d5] focus:ring-[#0051d5]"
                  />
                  <span>I hold a valid driver's license (Instant digital verification)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                    className="w-4 h-4 rounded-md border-slate-300 text-[#0051d5] focus:ring-[#0051d5]"
                  />
                  <span>
                    I agree to the <a href="#terms" className="text-[#0051d5] underline">Terms of Service</a> & <a href="#privacy" className="text-[#0051d5] underline">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button
                id="signup-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-[#0051d5] hover:bg-[#003ea8] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* MODE 3: FORGOT PASSWORD FORM */}
          {/* ========================================================================= */}
          {mode === 'forgot-password' && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0051d5] mx-auto flex items-center justify-center mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {forgotStep === 'request' && 'Reset Your Password'}
                  {forgotStep === 'verify' && 'Verify & Set New Password'}
                  {forgotStep === 'completed' && 'Password Reset Complete!'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {forgotStep === 'request' && 'Enter your registered email address to receive password recovery instructions and a 6-digit security code.'}
                  {forgotStep === 'verify' && 'Enter the 6-digit code sent to your email along with your desired new password.'}
                  {forgotStep === 'completed' && 'Your account security credentials have been updated. You can now sign in with your new password.'}
                </p>
              </div>

              {/* Step 1: Request Code */}
              {forgotStep === 'request' && (
                <form onSubmit={handleForgotRequestSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Registered Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="forgot-email-input"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@domain.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0051d5] focus:outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <button
                    id="forgot-send-code-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#0051d5] hover:bg-[#003ea8] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send 6-Digit Reset Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: Verification Code & New Password */}
              {forgotStep === 'verify' && (
                <form onSubmit={handleForgotVerifySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                      Enter 6-Digit Verification Code
                    </label>
                    <div className="flex justify-center gap-2">
                      {resetCode.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`reset-code-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const val = e.target.value.slice(-1);
                            const updated = [...resetCode];
                            updated[idx] = val;
                            setResetCode(updated);
                            // Auto focus next
                            if (val && idx < 5) {
                              const next = document.getElementById(`reset-code-${idx + 1}`);
                              next?.focus();
                            }
                          }}
                          className="w-10 h-12 text-center text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0051d5] focus:outline-hidden transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        New Password
                      </label>
                      <input
                        id="forgot-new-password-input"
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        required
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0051d5] focus:outline-hidden transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        id="forgot-confirm-password-input"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Re-enter password"
                        required
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0051d5] focus:outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <button
                    id="forgot-save-new-password-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#0051d5] hover:bg-[#003ea8] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Password & Sign In</span>
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Step 3: Success Confirmation */}
              {forgotStep === 'completed' && (
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    Your password has been successfully updated!
                  </p>
                  <button
                    onClick={() => {
                      setMode('login');
                      setForgotStep('request');
                      setError(null);
                      setSuccessMsg('Please sign in using your newly configured password.');
                    }}
                    className="w-full py-3 bg-[#0051d5] hover:bg-[#003ea8] text-white rounded-xl font-bold text-sm transition-all cursor-pointer"
                  >
                    Return to Sign In
                  </button>
                </div>
              )}

              {/* Back to Login Link */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          )}

          {/* Bottom toggle between Login and Signup */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <span>
                Don't have a RIDEMATE account?{' '}
                <button
                  id="auth-switch-to-signup"
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="font-bold text-[#0051d5] hover:underline cursor-pointer ml-1"
                >
                  Sign Up Free
                </button>
              </span>
            ) : mode === 'signup' ? (
              <span>
                Already have an account?{' '}
                <button
                  id="auth-switch-to-login"
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="font-bold text-[#0051d5] hover:underline cursor-pointer ml-1"
                >
                  Sign In
                </button>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
