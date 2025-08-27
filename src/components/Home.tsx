"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { FiMail, FiBriefcase, FiLink, FiShare2, FiX, FiDownload, FiPhone } from "react-icons/fi"
import { FaLinkedin, FaGlobe, FaFacebook, FaXTwitter, FaWhatsapp } from "react-icons/fa6"
import { MdEmail } from "react-icons/md"
import { PiCopySimpleFill } from "react-icons/pi"

const contactInfo = {
  name: "Dan Agarwal",
  title: "Founder & Chief Product Officer",
  email: "dan@pclnxai.com",
  number: "(732)596-7225",
  company: "PCLnXAI",
  website: "https://pclnxai.com/",
  linkedin: "https://www.linkedin.com/in/payrollcloud/",
  vCardUrl: "/dan-agarwal.vcf",
}

export default function VCardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalView, setModalView] = useState<"emailForm" | "share">("emailForm")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle")

  // --- MODIFIED FUNCTIONS ---
  // Opens the modal directly to the email form
  const openEmailModal = () => {
    setIsModalOpen(true)
    setModalView("emailForm")
    setStatusMessage("")
  }
  // Opens the modal directly to the share options
  const openShareModal = () => {
    setIsModalOpen(true)
    setModalView("share")
    setCopyStatus("idle")
  }
  const closeModal = () => setIsModalOpen(false)

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isModalOpen])

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSending) return
    setIsSending(true)
    setStatusMessage("Sending...")

    try {
      const response = await fetch("/api/send-vcard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recipientEmail }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to send email.")
      setStatusMessage("✅ Success! Email sent.")

      fetch("/api/store-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recipientEmail }),
      }).catch((err) => console.error("Failed to store email to sheet:", err))

      setTimeout(() => closeModal(), 2000)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatusMessage(`❌ Error: ${error.message}`)
      } else {
        setStatusMessage(`❌ An unknown error occurred.`)
      }
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-0 sm:p-6 bg-background sm:bg-gradient-to-br sm:from-card sm:via-background sm:to-muted">
      <div
        className={`w-full h-full min-h-screen sm:min-h-0 sm:h-auto sm:max-w-lg md:max-w-xl mx-auto
      ${isModalOpen ? "filter blur-sm" : ""}
      bg-card sm:border sm:border-border sm:rounded-2xl sm:shadow-2xl overflow-hidden`}
      >
        <div className="p-8 sm:p-10 text-center bg-gradient-to-r from-primary to-accent text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-balance leading-tight tracking-tight">
              {contactInfo.name}
            </h1>
            <p className="text-lg sm:text-xl mt-3 opacity-95 font-medium text-pretty">{contactInfo.title}</p>
          </div>
        </div>

        <div className="p-8 sm:p-10 space-y-8 bg-card">
          <InfoRow icon={<FiMail />} label="EMAIL" value={contactInfo.email} href={`mailto:${contactInfo.email}`} />
          <InfoRow icon={<FiPhone />} label="CONTACT" value={contactInfo.number} href={`tel:${contactInfo.number}`} />
          <InfoRow icon={<FiBriefcase />} label={contactInfo.company} value={contactInfo.title} />
          <InfoRow icon={<FiLink />} label="WEBSITE" value={contactInfo.website} href={contactInfo.website} />
        </div>

        <div className="px-8 sm:px-10 py-6 bg-muted border-t border-border">
          <h3 className="text-sm font-bold text-muted-foreground mb-6 tracking-wide uppercase">Social Media</h3>
          <div className="flex flex-wrap gap-4">
            <SocialIcon href={contactInfo.linkedin} icon={<FaLinkedin />} />
            <SocialIcon href={contactInfo.website} icon={<FaGlobe />} />
          </div>
        </div>

        <div className="bg-muted/50 p-8 sm:p-10 border-t border-border">
          <div className="space-y-4">
            <ActionButton onClick={openEmailModal} variant="primary">
              <FiMail className="mr-3" />
              Send by Email
            </ActionButton>

            <ActionButton href={contactInfo.vCardUrl} download variant="secondary">
              <FiDownload className="mr-3" />
              Download VCard
            </ActionButton>

            <ActionButton onClick={openShareModal} variant="tertiary">
              <FiShare2 className="mr-3" />
              Share this Page
            </ActionButton>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-card rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md relative border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Email Form */}
            {modalView === "emailForm" && (
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-primary w-full text-center">Send by Email</h3>
                  <button
                    onClick={closeModal}
                    className="text-muted-foreground hover:text-foreground transition-colors"
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
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-base bg-input"
                  />
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full mt-4 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 disabled:bg-primary/50 text-base transition-colors"
                  >
                    {isSending ? "SENDING..." : "SEND"}
                  </button>
                </form>
                {statusMessage && <p className="text-center text-sm mt-4 text-muted-foreground">{statusMessage}</p>}
              </div>
            )}

            {/* Share Modal */}
            {modalView === "share" && (
              <div className="py-8 px-6">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FiX size={20} />
                </button>
                <div className="font-bold text-primary text-lg mb-4 text-left">Share</div>
                <ul className="mb-6">
                  <li>
                    <ShareOption
                      icon={
                        <span className="text-blue-600">
                          <FaFacebook />
                        </span>
                      }
                      label="Facebook"
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    />
                  </li>
                  <li>
                    <ShareOption
                      icon={
                        <span className="text-foreground">
                          <FaXTwitter />
                        </span>
                      }
                      label="X"
                      href={`https://x.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
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
                      href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
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
                      href={`mailto:?body=${encodeURIComponent(window.location.href)}`}
                    />
                  </li>
                </ul>

                <div className="flex items-center gap-3">
                  <span className="text-xl text-muted-foreground">
                    <PiCopySimpleFill />
                  </span>
                  <input
                    value="https://conatct-card-sqiy.vercel.app/"
                    readOnly
                    className="border border-border rounded-lg px-3 py-2 flex-1 text-sm bg-input"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("https://conatct-card-sqiy.vercel.app/")
                      setCopyStatus("copied")
                      setTimeout(() => setCopyStatus("idle"), 1800)
                    }}
                    className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
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
  )
}

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const content = (
    <div className="flex items-start gap-5">
      <div className="text-3xl text-accent pt-1 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-muted-foreground font-bold tracking-wider mb-2 uppercase">{label}</div>
        <div className="text-lg text-card-foreground break-words font-medium leading-relaxed">{value}</div>
      </div>
    </div>
  )
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block hover:bg-muted/50 -mx-3 px-3 py-3 rounded-xl transition-colors group"
    >
      {content}
    </a>
  ) : (
    <div className="px-3 py-3">{content}</div>
  )
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center h-14 w-14 rounded-full text-2xl text-accent-foreground bg-accent hover:bg-accent/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
    >
      {icon}
    </a>
  )
}

function ActionButton({
  onClick,
  children,
  variant = "secondary",
  href,
  download,
}: {
  onClick?: () => void
  children: React.ReactNode
  variant?: "primary" | "secondary" | "tertiary"
  href?: string
  download?: boolean
}) {
  const baseStyles =
    "w-full flex items-center justify-center py-4 px-6 text-base font-bold rounded-xl transition-all duration-200 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"

  const styles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl",
    secondary: "bg-card text-card-foreground border-2 border-border hover:bg-muted/50 hover:border-accent/50",
    tertiary: "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
  }

  const className = `${baseStyles} ${styles[variant]}`

  if (href) {
    return (
      <a href={href} download={download} className={className}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  )
}

function ShareOption({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode
  label: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-4 py-3 px-3 rounded-lg hover:bg-muted/50 transition-colors mb-2"
    >
      <div className="text-xl">{icon}</div>
      <span className="text-card-foreground text-base font-medium">{label}</span>
    </a>
  )
}
