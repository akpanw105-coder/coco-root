"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Mode = "sign-in" | "sign-up" | "reset";

interface AuthModalProps {
  onClose?: () => void;
  notice?: string;
  returnUrl?: string;
}

export function AuthModal({ onClose, notice, returnUrl }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      if (mode === "sign-up") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) {
          setMessage({ type: "error", text: error.message });
        } else if (data.session) {
          // Immediately signed in (if email confirmation disabled)
          router.refresh();
          if (returnUrl) {
            router.push(returnUrl);
          }
          onClose?.();
        } else {
          setMessage({
            type: "success",
            text: "Account registered! Please sign in with your credentials to proceed.",
          });
          setMode("sign-in");
        }
      } else if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setMessage({ type: "error", text: error.message });
        } else {
          router.refresh();
          if (returnUrl) {
            router.push(returnUrl);
          }
          onClose?.();
        }
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/account`,
        });
        if (error) {
          setMessage({ type: "error", text: error.message });
        } else {
          setMessage({
            type: "success",
            text: "Password reset link sent! Check your email.",
          });
        }
      }
    });
  };

  return (
    <div className="auth-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="auth-modal-card">
        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="auth-close-btn"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Brand Header */}
        <div className="auth-brand">
          <span className="auth-brand-wordmark">COCO ROOTS</span>
          <span className="auth-brand-sub">Botanical Hair Wellness</span>
        </div>

        {/* Notice for Order Required Authentication */}
        {notice && (
          <div className="mb-4 p-3.5 rounded-2xl bg-[#14241B]/5 border border-[#C4975C]/40 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#C4975C] shrink-0" />
            <p className="text-xs text-[#14241B] font-medium leading-relaxed">
              {notice}
            </p>
          </div>
        )}

        {/* Tab switcher */}
        {mode !== "reset" && (
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${mode === "sign-in" ? "active" : ""}`}
              onClick={() => { setMode("sign-in"); setMessage(null); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === "sign-up" ? "active" : ""}`}
              onClick={() => { setMode("sign-up"); setMessage(null); }}
            >
              Create Account
            </button>
          </div>
        )}

        {mode === "reset" && (
          <div className="auth-reset-header">
            <h2 className="auth-title">Reset Password</h2>
            <p className="auth-subtitle">Enter your email and we&apos;ll send you a reset link.</p>
          </div>
        )}

        {mode === "sign-in" && (
          <div className="auth-greeting">
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">Sign in to your Coco Roots account.</p>
          </div>
        )}
        {mode === "sign-up" && (
          <div className="auth-greeting">
            <h2 className="auth-title">Join the ritual</h2>
            <p className="auth-subtitle">Create your account for early access and exclusive offers.</p>
          </div>
        )}

        {/* Feedback Message */}
        {message && (
          <div className={`auth-message auth-message--${message.type}`}>
            {message.type === "error" ? (
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "sign-up" && (
            <div className="auth-field">
              <label htmlFor="auth-fullname" className="auth-label">Full Name</label>
              <input
                id="auth-fullname"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="auth-input"
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email" className="auth-label">Email Address</label>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>

          {mode !== "reset" && (
            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="auth-password" className="auth-label">Password</label>
                {mode === "sign-in" && (
                  <button
                    type="button"
                    onClick={() => { setMode("reset"); setMessage(null); }}
                    className="auth-forgot-link"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                id="auth-password"
                name="password"
                type="password"
                autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                required
                placeholder={mode === "sign-up" ? "Min. 6 characters" : "Your password"}
                minLength={mode === "sign-up" ? 6 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="auth-submit-btn"
          >
            {isPending ? (
              <span className="auth-spinner" />
            ) : mode === "sign-in" ? (
              "Sign In"
            ) : mode === "sign-up" ? (
              "Create Account"
            ) : (
              "Send Reset Link"
            )}
          </button>

          {mode === "reset" && (
            <button
              type="button"
              onClick={() => { setMode("sign-in"); setMessage(null); }}
              className="auth-back-link"
            >
              ← Back to Sign In
            </button>
          )}
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span className="auth-divider-line" />
          <span className="auth-divider-text">or continue with</span>
          <span className="auth-divider-line" />
        </div>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${window.location.origin}/auth/callback`,
              },
            });
          }}
          className="auth-oauth-btn"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" />
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" />
            <path fill="#FBBC05" d="M4.5 10.48A4.8 4.8 0 014.5 7.52V5.45H1.83a8 8 0 000 7.1L4.5 10.48z" />
            <path fill="#EA4335" d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8 8 0 001.83 5.45L4.5 7.52A4.77 4.77 0 018.98 3.58z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="auth-terms">
          By continuing, you agree to our{" "}
          <span className="auth-link">Terms of Service</span> and{" "}
          <span className="auth-link">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
