"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Leaf,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { authApi, findVerificationId, saveSession } from "@/lib/auth";

type AuthMode = "login" | "signup";
type AuthStep = "details" | "otp";

function normalizeMobile(value: string) {
  return value.replace(/[^\d+]/g, "");
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("login");
  const [step, setStep] = useState<AuthStep>("details");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const title = mode === "login" ? "Sign In" : "Create Account";
  const subtitle =
    step === "details"
      ? mode === "login"
        ? "Enter your mobile number to receive a secure OTP."
        : "Add your name and mobile number to create your Shuddhveda account."
      : "Enter the OTP sent to your mobile number.";

  const buttonLabel = useMemo(() => {
    if (loading) return "Please wait...";
    if (step === "otp") return "Verify OTP";
    return mode === "login" ? "Send Login OTP" : "Create & Send OTP";
  }, [loading, mode, step]);

  function resetAuth(nextMode: AuthMode) {
    setMode(nextMode);
    setStep("details");
    setOtp("");
    setVerificationId("");
    setError("");
    setMessage("");
  }

  async function submitDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const cleanMobile = normalizeMobile(mobile);
    if (!cleanMobile || cleanMobile.length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }

    if (mode === "signup" && name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);
    try {
      const response =
        mode === "login"
          ? await authApi.login({ mobile: cleanMobile })
          : await authApi.createUser({ name: name.trim(), mobile: cleanMobile });
      const id = findVerificationId(response);

      if (!id) throw new Error("OTP verification id was not received from server.");

      setMobile(cleanMobile);
      setVerificationId(id);
      setStep("otp");
      setMessage("OTP sent successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function submitOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!verificationId) {
      setError("Please send OTP again.");
      setStep("details");
      return;
    }

    if (otp.trim().length < 4) {
      setError("Please enter a valid OTP.");
      return;
    }

    setLoading(true);
    try {
      const response =
        mode === "login"
          ? await authApi.verifyLoginOtp({ verificationId, otp: otp.trim() })
          : await authApi.verifySignupOtp({ verificationId, otp: otp.trim() });

      saveSession({
        user: {
          name: name.trim() || "Shuddhveda Customer",
          mobile,
        },
        raw: response,
      });
      const redirectTo = searchParams.get("redirect") || "/";
      router.push(redirectTo.startsWith("/") ? redirectTo : "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF8EF] lg:h-screen lg:overflow-hidden">
      <div className="grid min-h-screen w-full bg-white lg:h-screen lg:grid-cols-2">
        <div className="relative h-[38vh] min-h-[260px] w-full sm:h-[46vh] lg:h-screen lg:min-h-0">
          <Image
            src="/loginpage.png"
            alt="Shuddhveda honey jar with honeycomb and bees"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

        <div className="flex min-h-[62vh] items-center justify-center bg-[#FFFEFC] px-5 py-8 sm:px-8 md:py-12 lg:h-screen lg:min-h-0 lg:overflow-y-auto lg:px-12">
          <div className="w-full max-w-[430px]">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#F2D6A7] bg-white text-[#E69A00]">
                <ShieldCheck size={22} />
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#2D2118] sm:text-4xl">
                {title}
              </h1>
              <p className="mx-auto mt-3 max-w-[320px] text-sm leading-6 text-[#7C8797]">
                {subtitle}
              </p>
            </div>

            <form onSubmit={step === "details" ? submitDetails : submitOtp} className="mt-8 space-y-5">
              {mode === "signup" && step === "details" && (
                <label className="block">
                  <span className="text-xs font-bold text-[#334155]">Full Name</span>
                  <div className="relative mt-2">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA6B2]" size={17} />
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your full name"
                      className="h-12 w-full rounded-lg border border-[#E6EAF0] bg-white pl-12 pr-4 text-sm text-[#2D2118] outline-none transition placeholder:text-[#C0C8D2] focus:border-[#E69A00] focus:ring-2 focus:ring-[#E69A00]/20"
                    />
                  </div>
                </label>
              )}

              {step === "details" ? (
                <label className="block">
                  <span className="text-xs font-bold text-[#334155]">Mobile Number</span>
                  <div className="relative mt-2">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA6B2]" size={17} />
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(event) => setMobile(event.target.value)}
                      placeholder="Enter mobile number"
                      className="h-12 w-full rounded-lg border border-[#E6EAF0] bg-white pl-12 pr-4 text-sm text-[#2D2118] outline-none transition placeholder:text-[#C0C8D2] focus:border-[#E69A00] focus:ring-2 focus:ring-[#E69A00]/20"
                    />
                  </div>
                </label>
              ) : (
                <label className="block">
                  <span className="text-xs font-bold text-[#334155]">OTP</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter OTP"
                    className="mt-2 h-12 w-full rounded-lg border border-[#E6EAF0] bg-white px-4 text-center text-lg font-bold tracking-[0.28em] text-[#2D2118] outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-[#C0C8D2] focus:border-[#E69A00] focus:ring-2 focus:ring-[#E69A00]/20"
                  />
                </label>
              )}

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}
              {message && (
                <p className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                  <CheckCircle2 size={16} />
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-lg bg-[#E69A00] text-sm font-bold text-white shadow-[0_12px_24px_rgba(230,154,0,0.25)] transition hover:bg-[#C98715] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {buttonLabel}
              </button>
            </form>

            {step === "otp" && (
              <button
                type="button"
                onClick={() => {
                  setStep("details");
                  setOtp("");
                  setError("");
                  setMessage("");
                }}
                className="mx-auto mt-6 flex items-center gap-2 text-sm font-bold text-[#2D3A1B] hover:underline"
              >
                <ArrowLeft size={16} />
                Change mobile number
              </button>
            )}

            {step === "details" && mode === "login" && (
              <button
                type="button"
                onClick={() => resetAuth("signup")}
                className="mx-auto mt-7 flex items-center justify-center text-sm font-bold text-[#0B6B3A] hover:underline"
              >
                New here? Create Account
              </button>
            )}

            {step === "details" && mode === "signup" && (
              <button
                type="button"
                onClick={() => resetAuth("login")}
                className="mx-auto mt-7 flex items-center gap-2 text-sm font-bold text-[#0B6B3A] hover:underline"
              >
                <ArrowLeft size={16} />
                Back to Sign In
              </button>
            )}

            <div className="mx-auto mt-8 flex max-w-[260px] items-center gap-4 text-[#D8C0A0]">
              <span className="h-px flex-1 bg-current" />
              <Leaf size={17} className="text-[#D88217]" />
              <span className="h-px flex-1 bg-current" />
            </div>
            <p className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-[#667085]">
              <ShieldCheck size={14} className="text-[#23865D]" />
              Secure &amp; Encrypted
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
