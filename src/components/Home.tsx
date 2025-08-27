"use client";
import React, { useState, useEffect } from "react";
import {
  FiMail,
  FiBriefcase,
  FiLink,
  FiShare2,
  FiX,
  FiDownload,
  FiPhone,
} from "react-icons/fi";
import {
  FaLinkedin,
  FaGlobe,
  FaFacebook,
  FaXTwitter,
  FaWhatsapp,
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { PiCopySimpleFill } from "react-icons/pi";

const contactInfo = {
  name: "Dan Agarwal",
  title: "Founder & Chief Product Officer",
  email: "dan@pclnxai.com",
  number: "(732)596-7225",
  company: "PCLnXAI",
  website: "https://pclnxai.com/",
  linkedin: "https://www.linkedin.com/in/payrollcloud/",
  vCardUrl: "/dan-agarwal.vcf",
};

export default function VCardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<"emailForm" | "share">(
    "emailForm"
  );
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  // --- MODIFIED FUNCTIONS ---
  // Opens the modal directly to the email form
  const openEmailModal = () => {
    setIsModalOpen(true);
    setModalView("emailForm");
    setStatusMessage("");
  };
  // Opens the modal directly to the share options
  const openShareModal = () => {
    setIsModalOpen(true);
    setModalView("share");
    setCopyStatus("idle");
  };
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    setStatusMessage("Sending...");

    try {
      const response = await fetch("/api/send-vcard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recipientEmail }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to send email.");
      setStatusMessage("✅ Success! Email sent.");

      fetch("/api/store-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recipientEmail }),
      }).catch((err) => console.error("Failed to store email to sheet:", err));

      setTimeout(() => closeModal(), 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatusMessage(`❌ Error: ${error.message}`);
      } else {
        setStatusMessage(`❌ An unknown error occurred.`);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-2 sm:p-4 
      bg-gradient-to-tr from-sky-50 via-teal-50 to-emerald-50"
    >
      <div
        className={`w-full sm:max-w-lg md:max-w-xl mx-auto ${
          isModalOpen ? "filter blur-sm" : ""
        } sm:rounded-2xl sm:shadow-xl sm:bg-white sm:border sm:border-gray-100 sm:overflow-hidden`}
      >
        {/* Header */}
        <div className="p-2 sm:p-4 text-center bg-gradient-to-r from-sky-400 to-teal-400 text-white">
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {contactInfo.name}
          </h1>
          <p className="text-sm sm:text-md mt-1 opacity-90">
            {contactInfo.title}
          </p>
        </div>

        {/* Info Section */}
        <div className="p-2 sm:p-4 space-y-4 sm:space-y-6 bg-white/70 sm:bg-transparent rounded-xl">
          <InfoRow
            icon={<FiMail />}
            label="EMAIL"
            value={contactInfo.email}
            href={`mailto:${contactInfo.email}`}
          />
          <InfoRow
            icon={<FiPhone />}
            label="CONTACT"
            value={contactInfo.number}
            href={`tel:${contactInfo.number}`}
          />
          <InfoRow
            icon={<FiBriefcase />}
            label={contactInfo.company}
            value={contactInfo.title}
          />
          <InfoRow
            icon={<FiLink />}
            label="WEBSITE"
            value={contactInfo.website}
            href={contactInfo.website}
          />
        </div>

        {/* Socials */}
        <div className="px-6 sm:px-8 py-3 bg-white/60 sm:bg-gray-50 border-t">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-4">
            Social Media
          </h3>
          <div className="flex flex-wrap gap-4">
            <SocialIcon href={contactInfo.linkedin} icon={<FaLinkedin />} />
            <SocialIcon href={contactInfo.website} icon={<FaGlobe />} />
          </div>
        </div>

        {/* --- MODIFIED ACTIONS SECTION --- */}
        <div className="bg-slate-50/70 p-4 sm:p-6 border-t">
          <div className="space-y-3">
            <ActionButton onClick={openEmailModal} variant="primary">
              <FiMail className="mr-2" />
              Send by Email
            </ActionButton>

            <ActionButton
              href={contactInfo.vCardUrl}
              download
              variant="secondary"
            >
              <FiDownload className="mr-2" />
              Download VCard
            </ActionButton>

            <ActionButton onClick={openShareModal} variant="tertiary">
              <FiShare2 className="mr-2" />
              Share this Page
            </ActionButton>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-sm relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Email Form */}
            {modalView === "emailForm" && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  {/* Removed back button as it's a direct entry now */}
                  <h3 className="text-md font-semibold text-sky-600 w-full text-center">
                    Send by Email
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <form onSubmit={handleSendEmail}>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter Email Address"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:text-black rounded-md focus:ring-2 focus:ring-sky-400 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full mt-3 px-4 py-2 bg-sky-500 text-white font-medium rounded-md hover:bg-sky-600 disabled:bg-sky-300 text-sm"
                  >
                    {isSending ? "SENDING..." : "SEND"}
                  </button>
                </form>
                {statusMessage && (
                  <p className="text-center text-xs mt-3 text-gray-600">
                    {statusMessage}
                  </p>
                )}
              </div>
            )}

            {/* Share Modal */}
            {modalView === "share" && (
              <div className="py-6 px-5">
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </button>
                <div className="font-semibold text-sky-600 text-md mb-2 text-left">
                  Share
                </div>
                <ul className="mb-2">
                  <li>
                    <ShareOption
                      icon={
                        <span className="text-blue-600">
                          <FaFacebook />
                        </span>
                      }
                      label="Facebook"
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.href
                      )}`}
                    />
                  </li>
                  <li>
                    <ShareOption
                      icon={
                        <span className="text-black">
                          <FaXTwitter />
                        </span>
                      }
                      label="X"
                      href={`https://x.com/intent/tweet?url=${encodeURIComponent(
                        window.location.href
                      )}`}
                    />
                  </li>
                  <li>
                    <ShareOption
                      icon={
                        <span className="text-green-600">
                          <FaWhatsapp />
                        </span>
                      }
                      label="WhatsApp"
                      href={`https://wa.me/?text=${encodeURIComponent(
                        window.location.href
                      )}`}
                    />
                  </li>
                  <li>
                    <ShareOption
                      icon={
                        <span className="text-red-500">
                          <MdEmail />
                        </span>
                      }
                      label="Email"
                      href={`mailto:?body=${encodeURIComponent(
                        window.location.href
                      )}`}
                    />
                  </li>
                </ul>

                <div className="flex items-center mt-4">
                  <span className="text-[1.3rem] text-gray-700 mr-2">
                    <PiCopySimpleFill />
                  </span>
                  <input
                    value="https://conatct-card-sqiy.vercel.app/"
                    readOnly
                    className="border border-gray-200 dark:text-black rounded px-2 py-1 flex-1 text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "https://conatct-card-sqiy.vercel.app/"
                      );
                      setCopyStatus("copied");
                      setTimeout(() => setCopyStatus("idle"), 1800);
                    }}
                    className="ml-2 px-3 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
                  >
                    {copyStatus === "copied" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

// --- Reusable Components (No changes needed) ---
function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="text-2xl text-sky-400 pt-0.5">{icon}</div>
      <div>
        <div className="text-xs text-gray-900 font-extrabold tracking-wide mb-1">
          {label}
        </div>
        <div className="text-base text-gray-500 break-words">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center h-11 w-11 rounded-full text-xl text-white bg-sky-400 hover:bg-sky-500 transition shadow"
    >
      {icon}
    </a>
  );
}

function ActionButton({
  onClick,
  children,
  variant = "secondary",
  href,
  download,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
  href?: string;
  download?: boolean;
}) {
  const baseStyles =
    "w-full flex items-center justify-center py-3 px-4 text-sm font-bold rounded-lg transition-all duration-200 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2";

  const styles = {
    primary:
      "bg-sky-400 text-black hover:bg-sky-700 shadow-sm focus:ring-sky-500 cursor-pointer",
    secondary:
      "bg-white text-black-600 border border-sky-300 hover:bg-sky-50 focus:ring-sky-500",
    tertiary:
      "bg-transparent text-black-500 hover:bg-slate-100 focus:ring-slate-400 cursor-pointer",
  };

  const className = `${baseStyles} ${styles[variant]}`;

  if (href) {
    return (
      <a href={href} download={download} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}

function ModalButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center p-3 text-left border rounded-lg hover:bg-sky-50 text-gray-800 font-medium text-sm transition"
    >
      {children}
    </button>
  );
}

function ShareOption({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-3 py-2 px-2 rounded hover:bg-gray-50 transition mb-1"
    >
      {icon}
      <span className="text-black text-sm font-medium">{label}</span>
    </a>
  );
}
