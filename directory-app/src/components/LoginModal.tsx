"use client";

import { useState, useEffect } from "react";
import { requestOtp, verifyOtp, getCurrentUser, checkEmailHasBusiness } from "@/app/actions";
import { X, Mail, Lock, CheckCircle, Store } from "lucide-react";

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  isRegistration = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  isRegistration?: boolean;
}) {
  const [step, setStep] = useState<"email" | "verify" | "loading" | "register">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(10 * 60); // 10 minutes in seconds
  const [pendingRegistration, setPendingRegistration] = useState(false); // Track if this is a registration flow

  // Check if user is already logged in
  useEffect(() => {
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        // User is already logged in
        if (user.businessId) {
          // Has business, redirect to dashboard
          window.location.href = "/dashboard";
        } else {
          // No business, redirect to register
          window.location.href = "/bedrijf-aanmelden";
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (step === "verify" && countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleRequestCode = async () => {
    setLoading(true);
    setError("");

    // First check if email has a registered business
    const { hasBusiness } = await checkEmailHasBusiness(email);

    // If registration but already has business
    if (isRegistration && hasBusiness) {
      setError("Dit e-mailadres is al gekoppeld aan een bedrijf. Gebruik een ander e-mailadres.");
      setLoading(false);
      return;
    }

    // If no business registered (and not in registration mode), show registration prompt
    if (!hasBusiness && !isRegistration) {
      setStep("register");
      setLoading(false);
      return;
    }

    // Email has business - send OTP for login
    const result = await requestOtp(email, false);
    if (result.success) {
      setStep("verify");
      setCountdown(10 * 60);
    } else {
      setError(result.error || "Er is iets misgegaan");
    }
    setLoading(false);
  };

  // Handle clicking "Bedrijf Aanmelden" button - send OTP for registration
  const handleRegisterWithEmail = async () => {
    setLoading(true);
    setError("");
    setPendingRegistration(true);

    // Send OTP for registration
    const result = await requestOtp(email, true);
    if (result.success) {
      setStep("verify");
      setCountdown(10 * 60);
    } else {
      setError(result.error || "Er is iets misgegaan");
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    const result = await verifyOtp(email, code);
    if (result.success) {
      // If this was a registration flow (from register step), go to registration form
      if (pendingRegistration) {
        const encodedEmail = encodeURIComponent(email);
        window.location.href = `/bedrijf-aanmelden?email=${encodedEmail}`;
        return;
      }

      // Normal login flow - check if user has business
      const user = await getCurrentUser();
      if (onSuccess) {
        onSuccess();
      } else if (user?.businessId) {
        // Has business, go to dashboard
        window.location.href = "/dashboard";
      } else {
        // No business yet, go to registration with email
        const encodedEmail = encodeURIComponent(email);
        window.location.href = `/bedrijf-aanmelden?email=${encodedEmail}`;
      }
    } else {
      setError(result.error || "Ongeldige code");
    }
    setLoading(false);
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError("");
    const result = await requestOtp(email);
    if (result.success) {
      setCountdown(10 * 60); // Reset countdown to 10 minutes
      setError("");
    } else {
      setError(result.error || "Er is iets misgegaan");
    }
    setLoading(false);
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep("email");
      setEmail("");
      setCode("");
      setError("");
      setCountdown(10 * 60);
      setPendingRegistration(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1: Email */}
        {step === "email" && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Inloggen bij uw bedrijf
              </h2>
              <p className="text-gray-600 mt-2">
                Vul uw e-mailadres in om een code te ontvangen
              </p>
            </div>

            <input
              type="email"
              placeholder="E-mailadres"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-lg"
            />

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
              onClick={handleRequestCode}
              disabled={loading || !email}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Bezig..." : "Code versturen"}
            </button>
          </>
        )}

        {/* Step: Register - No business found */}
        {step === "register" && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Nog geen bedrijf geregistreerd
              </h2>
              <p className="text-gray-600 mt-2">
                Er is nog geen bedrijf gekoppeld aan dit e-mailadres.
              </p>
              <p className="text-gray-600 mt-2">
                Wilt u uw bedrijf toevoegen aan NL Directory?
              </p>
            </div>

            <button
              onClick={handleRegisterWithEmail}
              disabled={loading}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Bezig..." : "Verstuur verificatiecode"}
            </button>

            <button
              onClick={() => {
                setStep("email");
                setError("");
              }}
              className="w-full mt-3 text-gray-500 hover:text-indigo-600 text-sm"
            >
              Ander e-mailadres gebruiken
            </button>
          </>
        )}

        {/* Step 2: Verify Code */}
        {step === "verify" && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Voer code in</h2>
              <p className="text-gray-600 mt-2">
                Code verzonden naar <span className="font-semibold">{email}</span>
              </p>
              <p className="text-indigo-600 font-medium mt-2">
                Geldig voor: {formatTime(countdown)}
              </p>
            </div>

            <input
              type="text"
              placeholder="6-cijferige code"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-lg text-center letter-spacing-8 font-mono"
              maxLength={6}
            />

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
              onClick={handleVerify}
              disabled={loading || code.length !== 6}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Bezig..." : "Verifiëren"}
            </button>

            <div className="mt-4 text-center">
              {countdown > 0 ? (
                <p className="text-gray-500 text-sm">
                  Code niet ontvangen?{" "}
                  <button
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
                  >
                    Opnieuw sturen
                  </button>
                </p>
              ) : (
                <button
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
                >
                  Code opnieuw sturen
                </button>
              )}
            </div>

            <button
              onClick={() => setStep("email")}
              className="w-full mt-3 text-gray-500 hover:text-indigo-600 text-sm"
            >
              Ander e-mailadres gebruiken
            </button>
          </>
        )}
      </div>
    </div>
  );
}
