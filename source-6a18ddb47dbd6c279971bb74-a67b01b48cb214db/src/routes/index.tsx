import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: WeddingInvitation,
})

const WEDDING_DATE = new Date('2026-07-17T19:00:00')

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(() => Math.max(0, target.getTime() - Date.now()))
  useEffect(() => {
    const id = setInterval(() => setDiff(Math.max(0, target.getTime() - Date.now())), 1000)
    return () => clearInterval(id)
  }, [target])
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

function FloralDivider() {
  return (
    <div className="floral-divider">
      <svg viewBox="0 0 320 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="20" x2="120" y2="20" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.5" />
        <circle cx="140" cy="20" r="2.5" fill="currentColor" opacity="0.5" />
        <circle cx="160" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
        <path d="M156 16 Q160 9 164 16 Q160 12 156 16Z" fill="currentColor" opacity="0.45" />
        <path d="M164 16 Q171 12 164 24 Q161 19 164 16Z" fill="currentColor" opacity="0.45" />
        <path d="M156 16 Q149 12 156 24 Q159 19 156 16Z" fill="currentColor" opacity="0.45" />
        <path d="M156 24 Q160 31 164 24 Q160 28 156 24Z" fill="currentColor" opacity="0.45" />
        <circle cx="160" cy="20" r="1.5" fill="currentColor" opacity="0.8" />
        <circle cx="180" cy="20" r="2.5" fill="currentColor" opacity="0.5" />
        <line x1="200" y1="20" x2="320" y2="20" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.5" />
      </svg>
    </div>
  )
}

function CornerOrnament({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const transforms: Record<string, string> = {
    tl: 'rotate(0deg)',
    tr: 'rotate(90deg)',
    bl: 'rotate(270deg)',
    br: 'rotate(180deg)',
  }
  return (
    <div className={`corner-ornament corner-${position}`} style={{ transform: transforms[position] }}>
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 6 L6 28" stroke="currentColor" strokeWidth="0.8" />
        <path d="M6 6 L28 6" stroke="currentColor" strokeWidth="0.8" />
        <path d="M6 6 Q18 6 18 18" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <circle cx="6" cy="6" r="2" fill="currentColor" />
        <circle cx="15" cy="15" r="1.2" fill="currentColor" opacity="0.6" />
        <path d="M14 10 Q18 14 14 18 Q10 14 14 10Z" fill="currentColor" opacity="0.35" />
      </svg>
    </div>
  )
}

function RSVPModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    'full-name': '',
    phone: '',
    attendance: 'accepts',
    guests: '1',
  })
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeBtnRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prev
    }
  }, [onClose])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'wedding-rsvp',
          ...formData,
        }).toString(),
      })
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="rsvp-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="presentation"
    >
      <div
        className="rsvp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rsvp-modal-title"
      >
        <button
          className="rsvp-modal-close"
          onClick={onClose}
          aria-label="Close RSVP form"
          ref={closeBtnRef}
        >
          ×
        </button>

        {submitted ? (
          <div className="rsvp-success">
            <FloralDivider />
            <h2 className="rsvp-success-title" id="rsvp-modal-title">Thank You</h2>
            <p className="rsvp-success-message">
              Your response has been received. We look forward to celebrating this special day with you.
            </p>
            <FloralDivider />
          </div>
        ) : (
          <>
            <div className="rsvp-modal-header">
              <p className="rsvp-modal-eyebrow">kindly confirm your attendance</p>
              <h2 className="rsvp-modal-title" id="rsvp-modal-title">Click Here </h2>
              <p className="rsvp-modal-subtitle">We would be honored to celebrate with you.</p>
            </div>

            <FloralDivider />

            <form
              name="wedding-rsvp"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="rsvp-form"
            >
              <input type="hidden" name="form-name" value="wedding-rsvp" />
              <p style={{ display: 'none' }}>
                <label>
                  Don't fill this out: <input name="bot-field" tabIndex={-1} />
                </label>
              </p>

              <div className="rsvp-field">
                <label className="rsvp-label" htmlFor="rsvp-full-name">
                  Full Name <span className="rsvp-required" aria-hidden="true">*</span>
                </label>
                <input
                  id="rsvp-full-name"
                  name="full-name"
                  type="text"
                  className="rsvp-input"
                  value={formData['full-name']}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>

              <div className="rsvp-field">
                <label className="rsvp-label" htmlFor="rsvp-phone">Phone Number</label>
                <input
                  id="rsvp-phone"
                  name="phone"
                  type="tel"
                  className="rsvp-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  autoComplete="tel"
                />
              </div>

              <div className="rsvp-field">
                <label className="rsvp-label" htmlFor="rsvp-attendance">Attendance</label>
                <select
                  id="rsvp-attendance"
                  name="attendance"
                  className="rsvp-select"
                  value={formData.attendance}
                  onChange={handleChange}
                >
                  <option value="accepts">Joyfully Accepts</option>
                  <option value="declines">Regretfully Declines</option>
                </select>
              </div>

              <div className="rsvp-field">
                <label className="rsvp-label" htmlFor="rsvp-guests">Number of Guests</label>
                <select
                  id="rsvp-guests"
                  name="guests"
                  className="rsvp-select"
                  value={formData.guests}
                  onChange={handleChange}
                >
                  {Array.from({ length: 6 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="rsvp-submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Sending…' : 'CONFIRM ATTENDANCE'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false)
  const [envelopeAnim, setEnvelopeAnim] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [rsvpOpen, setRsvpOpen] = useState(false)
  const rsvpBtnRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE)

  function handleOpen() {
    setEnvelopeAnim(true)
    setTimeout(() => {
      setOpened(true)
      setTimeout(() => setContentVisible(true), 100)
    }, 900)
  }

  function handleRsvpClose() {
    setRsvpOpen(false)
    setTimeout(() => rsvpBtnRef.current?.focus(), 50)
  }

  const petals = Array.from({ length: 14 }, (_, i) => ({
    left: `${5 + (i * 6.8) % 90}%`,
    delay: `${i * 0.7}s`,
    duration: `${9 + (i % 5) * 1.8}s`,
    size: 6 + (i % 4) * 3,
    opacity: 0.18 + (i % 5) * 0.06,
    rotate: (i * 37) % 360,
  }))

  return (
    <div className="invitation-root">
      {/* Ambient floating petals */}
      <div className="petals-container" aria-hidden="true">
        {petals.map((p, i) => (
          <div
            key={i}
            className="falling-petal"
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.size,
              height: p.size * 1.6,
              opacity: p.opacity,
              '--rotate': `${p.rotate}deg`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Envelope splash */}
      {!opened && (
        <div className={`envelope-screen ${envelopeAnim ? 'opening' : ''}`}>
          <div className="env-letter-paper">
            <p className="env-paper-names">Mohamed &amp; Amal</p>
            <p className="env-paper-date">17 · 07 · 2026</p>
          </div>
          <div className="envelope-shell" onClick={!envelopeAnim ? handleOpen : undefined}>
            <div className="env-back" />
            <div className="env-flap" />
            <div className="env-body">
              <div className="env-seal">
                <span className="seal-text">M&amp;A</span>
              </div>
            </div>
            <div className="env-left-flap" />
            <div className="env-right-flap" />
            <div className="env-bottom-flap" />
          </div>
          <p className="tap-hint">{envelopeAnim ? '' : 'OPEN THE INVITATION'}</p>
        </div>
      )}

      {/* Main card */}
      {opened && (
        <div className={`invitation-card ${contentVisible ? 'card-visible' : ''}`} ref={contentRef}>
          <div className="card-border-frame">
            <CornerOrnament position="tl" />
            <CornerOrnament position="tr" />
            <CornerOrnament position="bl" />
            <CornerOrnament position="br" />
          </div>

          <div className="card-content">
            <div className="rule-top" />

            <p className="invite-preamble">you are cordially invited to celebrate the marriage of</p>

            <div className="couple-names">
              <span className="bride-name">Mohamed</span>
              <div className="names-ampersand">
                <svg viewBox="0 0 40 60" fill="none" className="amp-svg">
                  <text x="4" y="48" fontSize="52" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fill="currentColor" opacity="0.7">&amp;</text>
                </svg>
              </div>
              <span className="groom-name">Amal</span>
            </div>

            <FloralDivider />

            <div className="save-date-ribbon">
              <span className="ribbon-line" />
              <span className="ribbon-text">SAVE THE DATE</span>
              <span className="ribbon-line" />
            </div>

            <div className="date-display">
              <p className="date-weekday">Friday</p>
              <div className="date-numerals">
                <span>17</span>
                <span className="date-dot">·</span>
                <span>07</span>
                <span className="date-dot">·</span>
                <span>2026</span>
              </div>
              <p className="date-time">Evening &middot; 7:00 PM</p>
            </div>

            <FloralDivider />

            <div className="countdown-wrap">
              <p className="countdown-title">counting down to our day</p>
              <div className="countdown-row">
                {[
                  { v: days, l: 'Days' },
                  { v: hours, l: 'Hours' },
                  { v: minutes, l: 'Min' },
                  { v: seconds, l: 'Sec' },
                ].map(({ v, l }, i) => (
                  <div key={l} className="count-box">
                    {i > 0 && <span className="count-colon">:</span>}
                    <div className="count-inner">
                      <span className="count-value">{String(v).padStart(2, '0')}</span>
                      <span className="count-label">{l}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <FloralDivider />

            <div className="venue-wrap">
               <p className="venue-eyebrow">ceremony &amp; celebration</p>

                <p className="venue-name">Dar Gardenia</p>

                <p className="venue-detail">
                 Cairo, Egypt
                </p>

               <a
                href="https://maps.app.goo.gl/qFoEFmPyRjx2nQ946"
                target="_blank"
               rel="noopener noreferrer"
               className="venue-map-link"
                   >
                View Location
               </a>
            </div>

            <FloralDivider />

            <div className="rsvp-wrap">
              <p className="rsvp-eyebrow">kindly confirm your attendance</p>
              <button
                className="rsvp-btn"
                onClick={() => setRsvpOpen(true)}
                ref={rsvpBtnRef}
              >
                RSVP
              </button>
            </div>

            <div className="ayah-verse">
              <p className="ayah-text">"وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ"</p>
              
            </div>

            <div className="rule-bottom" />
            <p className="card-footer">Mohamed &amp; Amal · July 2026</p>
          </div>
        </div>
      )}

      {/* RSVP Modal */}
      {rsvpOpen && <RSVPModal onClose={handleRsvpClose} />}
    </div>
  )
}
