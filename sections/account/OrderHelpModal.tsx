"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
    X,
    HelpCircle,
    Video,
    Camera,
    Upload,
    Trash2,
    Building2,
    CreditCard,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    Loader2,
    FileVideo,
    Image as ImageIcon,
    Phone,
    Mail,
    ArrowRight,
    RefreshCw,
    Package,
    Clock,
    Check,
} from "lucide-react";

export interface OrderHelpModalProps {
    order: {
        id: string;
        orderId: string;
        orderGroupId?: string;
        rawId?: string;
        orderedOn: string;
        paymentMethod: string;
        paymentStatus: string;
        transactionId?: string;
        items: Array<{
            title: string;
            sub: string;
            qty: number;
            price: string;
            image: string;
        }>;
        totalAmount: string;
        status: string;
        shippingAddress?: {
            name: string;
            phone: string;
            address: string;
        };
    } | null;
    onClose: () => void;
    userProfile?: {
        fullName?: string;
        email?: string;
        mobile?: string;
        phone?: string;
    };
    onHelpSubmitted?: (orderId: string, ticketId: string) => void;
}

const ISSUE_TYPES = [
    { id: "damaged_jar", label: "Damaged / Broken Honey Jar or Leaked Package", requiresMedia: true },
    { id: "wrong_item", label: "Wrong Product or Quantity Received", requiresMedia: true },
    { id: "missing_item", label: "Missing Item(s) from Box", requiresMedia: true },
    { id: "quality_issue", label: "Quality, Taste or Seal Tampering Issue", requiresMedia: true },
    { id: "delayed_delivery", label: "Delivery Delayed / Tracking Not Updating", requiresMedia: false },
    { id: "payment_refund", label: "Payment Deducted / Refund Query", requiresMedia: false },
    { id: "other", label: "Other Support / Query", requiresMedia: false },
];

const RESOLUTION_OPTIONS = [
    { id: "replacement", title: "Free Replacement", desc: "Ship a fresh, sealed jar to my address" },
    { id: "refund", title: "Full Refund", desc: "Refund the entire order amount" },
    { id: "callback", title: "Support Assistance", desc: "Call / WhatsApp me to discuss the issue" },
];

const PHOTO_SLOTS = [
    { id: 0, label: "Outer Box & Shipping Label", hint: "Show courier label with Order ID" },
    { id: 1, label: "Damaged / Defective Jar", hint: "Show damage, leak or wrong product" },
    { id: 2, label: "Jar Seal & Batch Code", hint: "Show the cap seal & batch number" },
];

export default function OrderHelpModal({
    order,
    onClose,
    userProfile,
    onHelpSubmitted,
}: OrderHelpModalProps) {
    if (!order) return null;

    const isCod = Boolean(
        order.paymentMethod?.toLowerCase().includes("cod") ||
        order.paymentMethod?.toLowerCase().includes("cash") ||
        order.paymentStatus?.toLowerCase().includes("pending")
    );

    // Form state
    const [issueType, setIssueType] = useState<string>("damaged_jar");
    const [resolution, setResolution] = useState<string>("replacement");
    const [description, setDescription] = useState<string>("");

    // Contact details
    const [contactMobile, setContactMobile] = useState<string>(
        userProfile?.mobile || userProfile?.phone || order.shippingAddress?.phone || ""
    );
    const [contactEmail, setContactEmail] = useState<string>(userProfile?.email || "");

    // Media Uploads: 1 Video + 3 Photos
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
    const [videoError, setVideoError] = useState<string | null>(null);

    const [photos, setPhotos] = useState<(File | null)[]>([null, null, null]);
    const [photoPreviewUrls, setPhotoPreviewUrls] = useState<(string | null)[]>([null, null, null]);

    // COD Bank / UPI details
    const [refundMode, setRefundMode] = useState<"bank" | "upi">("bank");
    const [bankHolderName, setBankHolderName] = useState<string>(
        userProfile?.fullName || order.shippingAddress?.name || ""
    );
    const [bankName, setBankName] = useState<string>("");
    const [accountNumber, setAccountNumber] = useState<string>("");
    const [confirmAccountNumber, setConfirmAccountNumber] = useState<string>("");
    const [ifscCode, setIfscCode] = useState<string>("");
    const [upiId, setUpiId] = useState<string>("");

    // Submission states
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [submittedTicket, setSubmittedTicket] = useState<{
        ticketId: string;
        date: string;
        resolution: string;
        isCod: boolean;
    } | null>(null);

    // Hidden input refs
    const videoInputRef = useRef<HTMLInputElement>(null);
    const photoInputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];
    const multiPhotoInputRef = useRef<HTMLInputElement>(null);

    // Cleanup object URLs on unmount or file change
    useEffect(() => {
        return () => {
            if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
            photoPreviewUrls.forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, []);

    // Prevent background scrolling while modal is open
    useEffect(() => {
        const origOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = origOverflow;
        };
    }, []);

    // Handle video upload
    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setVideoError(null);
        if (!file) return;

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setVideoError("Video file size exceeds 10MB limit. Please upload a shorter clip under 10MB.");
            return;
        }

        if (videoPreviewUrl) {
            URL.revokeObjectURL(videoPreviewUrl);
        }

        const url = URL.createObjectURL(file);
        setVideoFile(file);
        setVideoPreviewUrl(url);
    };

    const handleRemoveVideo = () => {
        if (videoPreviewUrl) {
            URL.revokeObjectURL(videoPreviewUrl);
        }
        setVideoFile(null);
        setVideoPreviewUrl(null);
        setVideoError(null);
        if (videoInputRef.current) {
            videoInputRef.current.value = "";
        }
    };

    // Handle individual photo slot change
    const handlePhotoSlotChange = (slotIndex: number, file: File | null) => {
        if (!file) return;

        // Validate max 5MB
        if (file.size > 5 * 1024 * 1024) {
            setValidationError(`Photo ${slotIndex + 1} exceeds 5MB limit.`);
            return;
        }

        const currentUrl = photoPreviewUrls[slotIndex];
        if (currentUrl) {
            URL.revokeObjectURL(currentUrl);
        }

        const newUrl = URL.createObjectURL(file);
        setPhotos((prev) => {
            const next = [...prev];
            next[slotIndex] = file;
            return next;
        });
        setPhotoPreviewUrls((prev) => {
            const next = [...prev];
            next[slotIndex] = newUrl;
            return next;
        });
    };

    const handleRemovePhoto = (slotIndex: number) => {
        const currentUrl = photoPreviewUrls[slotIndex];
        if (currentUrl) {
            URL.revokeObjectURL(currentUrl);
        }
        setPhotos((prev) => {
            const next = [...prev];
            next[slotIndex] = null;
            return next;
        });
        setPhotoPreviewUrls((prev) => {
            const next = [...prev];
            next[slotIndex] = null;
            return next;
        });
        const ref = photoInputRefs[slotIndex];
        if (ref?.current) {
            ref.current.value = "";
        }
    };

    // Handle bulk photo selection
    const handleMultiPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files: File[] = Array.from(e.target.files).slice(0, 3);
        if (files.length === 0) return;

        files.forEach((file, idx) => {
            handlePhotoSlotChange(idx, file);
        });
    };

    // Validate and submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        // Basic validations
        if (!issueType) {
            setValidationError("Please select the reason for your help request.");
            return;
        }

        if (!contactMobile.trim() || contactMobile.trim().replace(/\D/g, "").length < 10) {
            setValidationError("Please provide a valid 10-digit mobile number so our support team can reach you.");
            return;
        }

        // Check COD refund details if COD order or refund selected
        const needsBankDetails = isCod && resolution === "refund";
        if (needsBankDetails) {
            if (refundMode === "bank") {
                if (!bankHolderName.trim()) {
                    setValidationError("Please enter the Account Holder Name for your refund.");
                    return;
                }
                if (!bankName.trim()) {
                    setValidationError("Please enter your Bank Name.");
                    return;
                }
                if (!accountNumber.trim() || accountNumber.length < 8) {
                    setValidationError("Please enter a valid Bank Account Number.");
                    return;
                }
                if (accountNumber.trim() !== confirmAccountNumber.trim()) {
                    setValidationError("Account numbers do not match. Please re-check.");
                    return;
                }
                if (!ifscCode.trim() || ifscCode.trim().length !== 11) {
                    setValidationError("Please enter a valid 11-character Bank IFSC Code (e.g. SBIN0001234).");
                    return;
                }
            } else {
                if (!upiId.trim() || !upiId.includes("@")) {
                    setValidationError("Please enter a valid UPI ID (e.g. yourname@okhdfcbank).");
                    return;
                }
            }
        }

        setIsSubmitting(true);

        try {
            // Simulated / API submission
            // We generate a deterministic ticket ID
            const cleanOrderId = order.orderId.replace(/\s+/g, "");
            const randomCode = Math.floor(1000 + Math.random() * 9000);
            const ticketId = `SHV-HELP-${cleanOrderId.slice(-6)}-${randomCode}`;

            // Save ticket details in localStorage so it persists for the user
            const ticketPayload = {
                ticketId,
                orderId: order.orderId,
                orderRawId: order.rawId || order.id,
                date: new Date().toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }),
                issueType,
                resolution,
                description,
                contactMobile,
                contactEmail,
                isCod,
                refundMode: needsBankDetails ? refundMode : undefined,
                bankDetails: needsBankDetails
                    ? refundMode === "bank"
                        ? {
                            holder: bankHolderName,
                            bank: bankName,
                            accountMasked: `•••• •••• ${accountNumber.slice(-4)}`,
                            ifsc: ifscCode.toUpperCase(),
                        }
                        : { upiId }
                    : undefined,
                photosCount: photos.filter(Boolean).length,
                hasVideo: Boolean(videoFile),
                status: "Under Review",
            };

            if (typeof window !== "undefined") {
                try {
                    const existingRaw = localStorage.getItem("sudhveda_support_tickets");
                    const existingList = existingRaw ? JSON.parse(existingRaw) : [];
                    existingList.unshift(ticketPayload);
                    localStorage.setItem("sudhveda_support_tickets", JSON.stringify(existingList.slice(0, 20)));
                } catch {
                    // ignore localStorage errors
                }
            }

            // Simulate slight network roundtrip for professional feel
            await new Promise((resolve) => setTimeout(resolve, 800));

            setSubmittedTicket({
                ticketId,
                date: ticketPayload.date,
                resolution:
                    resolution === "replacement"
                        ? "Free Replacement Jar"
                        : resolution === "refund"
                            ? `Full Refund (${order.totalAmount})`
                            : "Support Team Assistance",
                isCod,
            });

            if (onHelpSubmitted) {
                onHelpSubmitted(order.orderId, ticketId);
            }
        } catch (err) {
            console.error("Error submitting support request:", err);
            setValidationError("Unable to submit support request. Please try again or contact us via WhatsApp.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#FFFDF9] border-2 border-[#EADCC9] shadow-[0_25px_60px_-15px_rgba(89,49,2,0.3)] overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Modal Header */}
                <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#EADCC9]/80 bg-[#FFFDF9]/95 backdrop-blur-md px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FAF0DC] text-[#D49313] border border-[#D49313]/30 shadow-2xs">
                            <HelpCircle size={20} />
                        </div>
                        <div>
                            <h2 className="font-serif text-lg sm:text-xl font-extrabold text-[#593102] tracking-tight">
                                Order Help & Support
                            </h2>
                            <p className="text-xs font-semibold text-[#8D7F73]">
                                Order #{order.orderId} • {order.orderedOn}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-[#8D7F73] hover:bg-[#FAF0DC] hover:text-[#593102] transition-colors cursor-pointer active:scale-95"
                        aria-label="Close modal"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Modal Body / Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 space-y-6 overscroll-contain">
                    {submittedTicket ? (
                        /* SUCCESS CONFIRMATION VIEW */
                        <div className="py-6 sm:py-8 text-center space-y-6 animate-in fade-in duration-300">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 shadow-sm">
                                <CheckCircle2 size={44} />
                            </div>

                            <div className="space-y-2 max-w-md mx-auto">
                                <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1">
                                    Request Registered
                                </span>
                                <h3 className="font-serif text-2xl font-extrabold text-[#593102]">
                                    Help Ticket Created!
                                </h3>
                                <p className="text-xs sm:text-sm text-[#6E5D4F] font-medium leading-relaxed">
                                    We have received your issue report along with your uploaded video and photos. Our team is already verifying the details.
                                </p>
                            </div>

                            {/* Ticket Details Summary Card */}
                            <div className="rounded-2xl border border-[#EADCC9] bg-[#FAF5EC] p-4 text-left max-w-md mx-auto space-y-2.5 text-xs">
                                <div className="flex justify-between items-center pb-2 border-b border-[#EADCC9]/60">
                                    <span className="text-[#8D7F73] font-bold">Ticket ID:</span>
                                    <span className="font-mono font-extrabold text-[#593102] bg-white px-2 py-0.5 rounded-lg border border-[#EADCC9]">
                                        {submittedTicket.ticketId}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#8D7F73] font-bold">Order ID:</span>
                                    <span className="font-extrabold text-[#593102]">{order.orderId}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#8D7F73] font-bold">Preferred Resolution:</span>
                                    <span className="font-extrabold text-[#D49313]">{submittedTicket.resolution}</span>
                                </div>
                                {submittedTicket.isCod && resolution === "refund" && (
                                    <div className="flex justify-between items-center pt-1 text-emerald-800 font-bold">
                                        <span>Refund Destination:</span>
                                        <span>
                                            {refundMode === "bank"
                                                ? `${bankName || "Bank Account"} (${accountNumber.slice(-4)})`
                                                : `UPI (${upiId})`}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-1 text-[#8D7F73]">
                                    <span>Updates sent to:</span>
                                    <span className="font-bold text-[#593102]">+91 {contactMobile}</span>
                                </div>
                            </div>

                            {/* What happens next box */}
                            <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-4 max-w-md mx-auto text-left text-xs space-y-2">
                                <div className="flex items-center gap-2 font-bold text-amber-900">
                                    <Clock size={16} className="text-amber-700 shrink-0" />
                                    <span>What happens next?</span>
                                </div>
                                <ol className="list-decimal list-inside space-y-1 text-amber-800 text-[11.5px] leading-relaxed">
                                    <li>Our quality care team examines your <strong>unboxing video &amp; 3 photos</strong>.</li>
                                    <li>You will receive an instant approval message on WhatsApp / SMS within <strong>24 business hours</strong>.</li>
                                    <li>{submittedTicket.isCod && resolution === "refund" ? "Direct bank transfer will be credited via IMPS within 24-48 hours." : "Your fresh replacement jar will be dispatched with priority express tracking."}</li>
                                </ol>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
                                <a
                                    href={`https://wa.me/918175022207?text=${encodeURIComponent(
                                        `Hello ShuddhVeda Support! I have raised a Help Ticket #${submittedTicket.ticketId} for Order #${order.orderId}. Please assist me.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-sm active:scale-95"
                                >
                                    Chat on WhatsApp
                                </a>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 inline-flex items-center justify-center h-11 px-4 rounded-xl border border-[#593102] text-[#593102] hover:bg-[#FAF0DC] font-extrabold text-xs transition cursor-pointer active:scale-95"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* MAIN HELP FORM */
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* 1. Order Summary Pill Card */}
                            <div className="rounded-2xl border border-[#EADCC9] bg-[#FAF5EC]/70 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    {order.items[0]?.image ? (
                                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white border border-[#EADCC9]/80 shadow-2xs">
                                            <Image
                                                src={order.items[0].image}
                                                alt={order.items[0].title}
                                                fill
                                                unoptimized
                                                sizes="56px"
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white border border-[#EADCC9]/80 text-[#D49313]">
                                            <Package size={22} />
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="font-serif text-sm font-bold text-[#593102] truncate">
                                            {order.items[0]?.title || "ShuddhVeda Pure Honey"}
                                            {order.items.length > 1 && ` (+${order.items.length - 1} more)`}
                                        </p>
                                        <p className="text-xs text-[#6E5D4F]">
                                            Qty: {order.items[0]?.qty || 1} • Total: <strong className="text-[#593102]">{order.totalAmount}</strong>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border ${isCod
                                            ? "bg-amber-100/80 text-amber-900 border-amber-300"
                                            : "bg-emerald-100/80 text-emerald-900 border-emerald-300"
                                            }`}
                                    >
                                        <CreditCard size={12} />
                                        {order.paymentMethod || (isCod ? "Cash on Delivery" : "Online / Prepaid")}
                                    </span>
                                </div>
                            </div>

                            {/* 2. Select Issue Type */}
                            <div className="space-y-2.5">
                                <label className="text-xs font-extrabold uppercase tracking-wider text-[#593102] flex items-center justify-between">
                                    <span>What can we help you with? <span className="text-red-500">*</span></span>
                                    <span className="text-[11px] font-medium text-[#8D7F73] lowercase">select issue</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {ISSUE_TYPES.map((issue) => {
                                        const isSelected = issueType === issue.id;
                                        return (
                                            <label
                                                key={issue.id}
                                                className={`flex items-start gap-2.5 p-3 rounded-2xl border text-xs cursor-pointer transition-all ${isSelected
                                                    ? "border-[#593102] bg-[#FAF0DC] text-[#593102] font-extrabold shadow-2xs"
                                                    : "border-[#EADCC9] bg-white text-[#6E5D4F] hover:bg-[#FAF5EC]/70"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="issueType"
                                                    value={issue.id}
                                                    checked={isSelected}
                                                    onChange={() => setIssueType(issue.id)}
                                                    className="mt-0.5 accent-[#593102]"
                                                />
                                                <span className="leading-snug">{issue.label}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 3. Preferred Resolution */}
                            <div className="space-y-2.5">
                                <label className="text-xs font-extrabold uppercase tracking-wider text-[#593102] block">
                                    Preferred Resolution <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    {RESOLUTION_OPTIONS.map((opt) => {
                                        const isSelected = resolution === opt.id;
                                        return (
                                            <label
                                                key={opt.id}
                                                className={`flex flex-col p-3 rounded-2xl border text-xs cursor-pointer transition-all ${isSelected
                                                    ? "border-[#D49313] bg-[#FAF0DC] text-[#593102] font-bold shadow-2xs ring-1 ring-[#D49313]"
                                                    : "border-[#EADCC9] bg-white text-[#6E5D4F] hover:bg-[#FAF5EC]"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-extrabold text-[#593102]">{opt.title}</span>
                                                    <input
                                                        type="radio"
                                                        name="resolution"
                                                        value={opt.id}
                                                        checked={isSelected}
                                                        onChange={() => setResolution(opt.id)}
                                                        className="accent-[#593102]"
                                                    />
                                                </div>
                                                <span className="text-[11px] text-[#8D7F73] leading-snug">{opt.desc}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 4. MEDIA UPLOAD SECTION: 1 VIDEO + 3 PHOTOS */}
                            <div className="space-y-4 pt-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#593102] flex items-center gap-1.5">
                                            <Camera size={14} className="text-[#D49313]" />
                                            Proof &amp; Verification Evidence
                                        </h3>
                                        <p className="text-[11px] text-[#8D7F73]">
                                            Upload <strong>1 Video</strong> and <strong>3 Photos</strong> for instant approval &amp; replacement/refund.
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-extrabold bg-[#FAF0DC] text-[#593102] px-2.5 py-1 rounded-full border border-[#D49313]/30">
                                        1 Video + 3 Photos
                                    </span>
                                </div>

                                {/* VIDEO UPLOAD BOX */}
                                <div className="rounded-2xl border-2 border-dashed border-[#D49313]/50 bg-[#FAF5EC]/40 p-3.5 sm:p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF0DC] text-[#D49313]">
                                                <Video size={16} />
                                            </div>
                                            <span className="text-xs font-extrabold text-[#593102]">
                                                Unboxing or Defect Video <span className="text-red-500">*</span>
                                            </span>
                                        </div>
                                        {videoFile && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveVideo}
                                                className="inline-flex items-center gap-1 text-[11px] font-extrabold text-red-600 hover:text-red-700 cursor-pointer"
                                            >
                                                <Trash2 size={13} />
                                                Remove Video
                                            </button>
                                        )}
                                    </div>

                                    <input
                                        ref={videoInputRef}
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoChange}
                                        className="hidden"
                                    />

                                    {videoPreviewUrl && videoFile ? (
                                        <div className="space-y-2">
                                            <div className="relative rounded-xl overflow-hidden bg-black/90 aspect-video max-h-48 flex items-center justify-center">
                                                <video
                                                    src={videoPreviewUrl}
                                                    controls
                                                    className="w-full h-full max-h-48 object-contain"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between text-[11px] text-[#6E5D4F] px-1 font-medium">
                                                <span className="truncate max-w-[240px] font-bold text-[#593102]">
                                                    🎬 {videoFile.name}
                                                </span>
                                                <span>{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => videoInputRef.current?.click()}
                                            className="group flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-[#EADCC9] bg-white hover:bg-[#FAF0DC]/40 hover:border-[#D49313] transition-all cursor-pointer text-center"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF5EC] group-hover:bg-[#FAF0DC] text-[#D49313] mb-2 transition-transform group-hover:scale-110">
                                                <Upload size={18} />
                                            </div>
                                            <p className="text-xs font-extrabold text-[#593102]">
                                                Click to Upload Video
                                            </p>
                                        </div>
                                    )}

                                    {videoError && (
                                        <p className="text-xs text-red-600 font-semibold flex items-center gap-1.5">
                                            <AlertCircle size={14} className="shrink-0" />
                                            {videoError}
                                        </p>
                                    )}
                                </div>

                                {/* 3 PHOTOS SLOTS */}
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-extrabold uppercase tracking-wider text-[#593102] flex items-center gap-1.5">
                                            <ImageIcon size={14} className="text-[#D49313]" />
                                            Photographs Proof <span className="text-red-500">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => multiPhotoInputRef.current?.click()}
                                            className="text-[11px] font-bold text-[#D49313] hover:underline cursor-pointer"
                                        >
                                            Upload All 3 at Once
                                        </button>
                                        <input
                                            ref={multiPhotoInputRef}
                                            type="file"
                                            multiple
                                            accept="image/png,image/jpeg,image/webp,image/*"
                                            onChange={handleMultiPhotoSelect}
                                            className="hidden"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                        {PHOTO_SLOTS.map((slot, idx) => {
                                            const file = photos[idx];
                                            const preview = photoPreviewUrls[idx];
                                            return (
                                                <div
                                                    key={slot.id}
                                                    className="relative flex flex-col rounded-2xl border border-[#EADCC9] bg-white p-2.5 text-center transition-all hover:border-[#D49313]/60 shadow-2xs"
                                                >
                                                    <input
                                                        ref={photoInputRefs[idx]}
                                                        type="file"
                                                        accept="image/png,image/jpeg,image/webp,image/*"
                                                        onChange={(e) =>
                                                            handlePhotoSlotChange(idx, e.target.files?.[0] || null)
                                                        }
                                                        className="hidden"
                                                    />

                                                    {preview && file ? (
                                                        <div className="space-y-1.5">
                                                            <div className="relative h-28 w-full rounded-xl overflow-hidden bg-[#FAF5EC] border border-[#EADCC9]/60">
                                                                <Image
                                                                    src={preview}
                                                                    alt={`Photo ${idx + 1}`}
                                                                    fill
                                                                    unoptimized
                                                                    className="object-cover"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRemovePhoto(idx);
                                                                    }}
                                                                    className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 cursor-pointer"
                                                                    title="Remove photo"
                                                                >
                                                                    <X size={13} strokeWidth={3} />
                                                                </button>
                                                            </div>
                                                            <p className="text-[10.5px] font-extrabold text-[#593102] truncate">
                                                                ✓ Photo {idx + 1}: {slot.label}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            onClick={() => photoInputRefs[idx].current?.click()}
                                                            className="flex flex-col items-center justify-center h-28 rounded-xl border border-dashed border-[#EADCC9] bg-[#FAF5EC]/30 hover:bg-[#FAF0DC]/40 hover:border-[#D49313] transition-all cursor-pointer p-2"
                                                        >
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF0DC] text-[#D49313] mb-1.5">
                                                                <Camera size={15} />
                                                            </div>
                                                            <span className="text-[11px] font-extrabold text-[#593102] leading-tight">
                                                                Photo {idx + 1}
                                                            </span>
                                                            <span className="text-[10px] text-[#8D7F73] mt-0.5 leading-snug">
                                                                {slot.label}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* 5. COD BANK ACCOUNT DETAILS SECTION ("agar order cod hai tho account detail rahega yaar") */}
                            {isCod ? (
                                <div className="rounded-2xl border-2 border-[#D49313]/60 bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EC] to-[#FAF0DC]/30 p-4 sm:p-5 space-y-4 shadow-xs">
                                    <div className="flex items-start justify-between gap-3 border-b border-[#EADCC9]/80 pb-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#593102] text-[#D49313] shadow-xs">
                                                <Building2 size={18} />
                                            </div>
                                            <div>
                                                <h4 className="font-serif text-sm font-extrabold text-[#593102]">
                                                    COD Refund Bank Details
                                                </h4>
                                                <p className="text-[11px] text-[#8D7F73]">
                                                    Cash on Delivery order: provide account for direct transfer
                                                </p>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10.5px] font-extrabold text-emerald-800">
                                            <ShieldCheck size={12} />
                                            100% Safe
                                        </span>
                                    </div>

                                    {/* Refund Mode Selection: Bank Account vs UPI */}
                                    <div className="flex items-center gap-3">
                                        <label
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition ${refundMode === "bank"
                                                ? "bg-[#593102] text-white border-[#593102] shadow-2xs"
                                                : "bg-white text-[#593102] border-[#EADCC9] hover:bg-[#FAF5EC]"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="refundMode"
                                                value="bank"
                                                checked={refundMode === "bank"}
                                                onChange={() => setRefundMode("bank")}
                                                className="hidden"
                                            />
                                            <Building2 size={14} />
                                            Bank Account (NEFT/IMPS)
                                        </label>

                                        <label
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition ${refundMode === "upi"
                                                ? "bg-[#593102] text-white border-[#593102] shadow-2xs"
                                                : "bg-white text-[#593102] border-[#EADCC9] hover:bg-[#FAF5EC]"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="refundMode"
                                                value="upi"
                                                checked={refundMode === "upi"}
                                                onChange={() => setRefundMode("upi")}
                                                className="hidden"
                                            />
                                            <CreditCard size={14} />
                                            UPI ID (Instant Transfer)
                                        </label>
                                    </div>

                                    {refundMode === "bank" ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            <div className="space-y-1">
                                                <label className="font-bold text-[#593102] block">
                                                    Account Holder Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Name as in Bank Passbook"
                                                    value={bankHolderName}
                                                    onChange={(e) => setBankHolderName(e.target.value)}
                                                    className="w-full h-10 rounded-xl border border-[#EADCC9] bg-white px-3 text-xs font-semibold text-[#593102] focus:outline-none focus:border-[#D49313]"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="font-bold text-[#593102] block">
                                                    Bank Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. State Bank of India, HDFC"
                                                    value={bankName}
                                                    onChange={(e) => setBankName(e.target.value)}
                                                    className="w-full h-10 rounded-xl border border-[#EADCC9] bg-white px-3 text-xs font-semibold text-[#593102] focus:outline-none focus:border-[#D49313]"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="font-bold text-[#593102] block">
                                                    Account Number <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    placeholder="Enter Bank Account Number"
                                                    value={accountNumber}
                                                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                                                    className="w-full h-10 rounded-xl border border-[#EADCC9] bg-white px-3 text-xs font-semibold text-[#593102] tracking-wider focus:outline-none focus:border-[#D49313]"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="font-bold text-[#593102] block">
                                                    Confirm Account Number <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Re-enter Bank Account Number"
                                                    value={confirmAccountNumber}
                                                    onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ""))}
                                                    className="w-full h-10 rounded-xl border border-[#EADCC9] bg-white px-3 text-xs font-semibold text-[#593102] tracking-wider focus:outline-none focus:border-[#D49313]"
                                                />
                                            </div>

                                            <div className="space-y-1 sm:col-span-2">
                                                <label className="font-bold text-[#593102] block">
                                                    Bank IFSC Code <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. SBIN0001234 (11 characters)"
                                                    value={ifscCode}
                                                    maxLength={11}
                                                    onChange={(e) => setIfscCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                                                    className="w-full h-10 rounded-xl border border-[#EADCC9] bg-white px-3 text-xs font-mono font-bold text-[#593102] focus:outline-none focus:border-[#D49313]"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 text-xs">
                                            <div className="space-y-1">
                                                <label className="font-bold text-[#593102] block">
                                                    UPI ID (VPA) <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. yourname@okhdfcbank or 8796632478@paytm"
                                                    value={upiId}
                                                    onChange={(e) => setUpiId(e.target.value.trim())}
                                                    className="w-full h-10 rounded-xl border border-[#EADCC9] bg-white px-3 text-xs font-semibold text-[#593102] focus:outline-none focus:border-[#D49313]"
                                                />
                                            </div>
                                            <p className="text-[11px] text-[#8D7F73]">
                                                Refund will be transferred instantly via IMPS / UPI upon issue approval.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* PREPAID ORDER INFO */
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 flex items-start gap-2.5 text-xs text-emerald-900 font-medium">
                                    <CheckCircle2 size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                                    <p className="leading-relaxed">
                                        <strong>Prepaid Order Notice:</strong> Refunds for online prepaid payments will be automatically credited back to your original source (Card, UPI, Netbanking) within 5–7 working days upon claim approval.
                                    </p>
                                </div>
                            )}

                            {/* 6. Description / Notes */}
                            <div className="space-y-2">
                                <label className="text-xs font-extrabold uppercase tracking-wider text-[#593102] block">
                                    Describe the Issue in Detail
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Please provide any additional details (e.g. jar condition upon opening, delivery box condition, flavor issue)..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full rounded-2xl border border-[#EADCC9] bg-white p-3 text-xs text-[#593102] focus:outline-none focus:border-[#D49313] font-medium"
                                />
                            </div>

                            {/* 7. Contact Info for Updates */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="space-y-1">
                                    <label className="font-extrabold text-[#593102] flex items-center gap-1.5">
                                        <Phone size={13} className="text-[#D49313]" />
                                        Contact Phone / WhatsApp <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="10-digit mobile number"
                                        value={contactMobile}
                                        maxLength={10}
                                        onChange={(e) => setContactMobile(e.target.value.replace(/\D/g, ""))}
                                        className="w-full h-10 rounded-xl border border-[#EADCC9] bg-white px-3 text-xs font-semibold text-[#593102] focus:outline-none focus:border-[#D49313]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-extrabold text-[#593102] flex items-center gap-1.5">
                                        <Mail size={13} className="text-[#D49313]" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Email for ticket copy"
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                        className="w-full h-10 rounded-xl border border-[#EADCC9] bg-white px-3 text-xs font-semibold text-[#593102] focus:outline-none focus:border-[#D49313]"
                                    />
                                </div>
                            </div>

                            {/* Validation error message */}
                            {validationError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700 flex items-center gap-2 animate-in fade-in">
                                    <AlertCircle size={16} className="shrink-0 text-red-600" />
                                    <span>{validationError}</span>
                                </div>
                            )}

                            {/* Modal Footer Actions */}
                            <div className="flex items-center gap-3 pt-3 border-t border-[#EADCC9]/80">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="flex-1 h-11 rounded-xl border border-[#EADCC9] text-xs font-extrabold text-[#593102] hover:bg-[#FAF5EC] transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 h-11 rounded-xl bg-[#593102] hover:bg-[#D49313] text-xs font-extrabold text-white transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin text-white" />
                                            Submitting Request...
                                        </>
                                    ) : (
                                        <>
                                            Submit Help Request
                                            <ArrowRight size={14} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
