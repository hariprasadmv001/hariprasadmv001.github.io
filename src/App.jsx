import { useEffect, useMemo, useRef, useState } from 'react'
import { downloadCalendar, shareWhatsApp } from './utils/calendar'
import { useAmbientMusic } from './hooks/useAmbientMusic'

const destination = '12.687997,76.961992'
// Omit `origin` so Google Maps can detect the visitor's current location.
const mapDirectionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(destination) + '&travelmode=driving'
const address = <>Mudalododdi, Koppa Hobli,<br />Maddur Taluk, Mandya District,<br />Karnataka.</>

function Icon({ name, size = 20 }) {
  const paths = {
    pin: <><path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.4" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" /></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5M4 21h16" /></>,
    music: <><path d="M9 18V5l10-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></>,
    pause: <><path d="M7 5v14M17 5v14" /></>,
    replay: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></>
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Lotus({ small = false }) {
  return <span className={'lotus' + (small ? ' lotus-small' : '')} aria-hidden="true"><i /><i /><i /><i /><b /></span>
}
function OrnamentalRule() {
  return <div className="ornamental-rule" aria-hidden="true"><span /><Lotus small /><span /></div>
}
function ParticleField({ count = 16 }) {
  return <div className="particles" aria-hidden="true">{Array.from({ length: count }, (_, i) => <i key={i} style={{ '--x': ((i * 17 + 5) % 100) + '%', '--d': (9 + (i % 5) * 1.4) + 's', '--delay': (-i * 0.83) + 's', '--s': (2 + i % 3) + 'px' }} />)}</div>
}
function GaneshaStage({ className = '' }) {
  return <div className={'ganesha-stage ' + className}><span className="ganesha-aura" aria-hidden="true" /><img className="ganesha-photo" src="/images/ganesha.png" alt="Lord Ganesha" /></div>
}

function useTilt() {
  const ref = useRef(null)
  const frame = useRef(0)
  const canTilt = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches
  const reset = () => {
    if (!ref.current) return
    cancelAnimationFrame(frame.current)
    ref.current.style.setProperty('--tilt-x', '0deg')
    ref.current.style.setProperty('--tilt-y', '0deg')
    ref.current.style.setProperty('--tilt-shadow-x', '50%')
    ref.current.style.setProperty('--tilt-shadow-y', '50%')
  }
  const onPointerMove = event => {
    if (!canTilt() || event.pointerType !== 'mouse') return
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      element.style.setProperty('--tilt-x', ((0.5 - y) * 2.3) + 'deg')
      element.style.setProperty('--tilt-y', ((x - 0.5) * 2.3) + 'deg')
      element.style.setProperty('--tilt-shadow-x', (x * 100) + '%')
      element.style.setProperty('--tilt-shadow-y', (y * 100) + '%')
    })
  }
  useEffect(() => () => cancelAnimationFrame(frame.current), [])
  return { ref, onPointerMove, onPointerLeave: reset, onPointerCancel: reset }
}
function TiltSurface({ as: Tag = 'div', className = '', children }) {
  const tilt = useTilt()
  return <Tag className={'tilt-surface ' + className} {...tilt}>{children}</Tag>
}

function Opening({ phase, onOpen, lang }) {
  return <section className={'opening opening-' + phase} aria-label="Welcome to the Gruha Pravesha invitation">
    <ParticleField count={18} />
    <div className="opening-frame"><i /><i /><i /><i /></div>
    <div className="intro-content">
      <p className="sanskrit">॥ श्री गणेशाय नमः ॥</p>
      <GaneshaStage className="welcome-ganesha" />
      <h1>A NEW BEGINNING.<br />A NEW HOME.<br /><em>A LIFETIME OF BLESSINGS.</em></h1>
      <button className="gold-button opening-button" onClick={onOpen} disabled={phase !== 'welcome'}>{lang === 'ಕ' ? 'ಆಹ್ವಾನ ತೆರೆಯಿರಿ' : 'OPEN YOUR INVITATION'} <span aria-hidden="true">✦</span></button>
    </div>
  </section>
}

function Countdown({ lang }) {
  const target = useMemo(() => new Date('2026-11-12T07:30:00+05:30').getTime(), [])
  const calc = () => Math.max(0, target - Date.now())
  const [left, setLeft] = useState(calc)
  useEffect(() => {
    const timer = window.setInterval(() => setLeft(calc()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const labels = lang === 'ಕ' ? ['ದಿನಗಳು', 'ಗಂಟೆಗಳು', 'ನಿಮಿಷಗಳು', 'ಸೆಕೆಂಡುಗಳು'] : ['DAYS', 'HOURS', 'MINUTES', 'SECONDS']
  const unit = (n, label) => {
    const value = String(n).padStart(2, '0')
    return <div className="count-unit"><strong aria-label={value + ' ' + label}><span className="count-number" key={value}>{value}</span></strong><span>{label}</span></div>
  }
  if (!left) return <section className="countdown celebration"><p className="eyebrow">{lang === 'ಕ' ? 'ಶುಭ ದಿನ' : 'A BLESSED DAY'}</p><h2>{lang === 'ಕ' ? 'ಸಂಭ್ರಮ ಆರಂಭವಾಗಿದೆ' : 'The celebration has begun'}</h2><p>{lang === 'ಕ' ? 'ನಮ್ಮ ಹೊಸ ಮನೆ ಸದಾ ಸಂತೋಷ, ಶಾಂತಿ ಮತ್ತು ಆಶೀರ್ವಾದಗಳಿಂದ ತುಂಬಿರಲಿ.' : 'May this new home always be filled with joy, peace and blessings.'}</p></section>
  const total = Math.floor(left / 1000)
  return <section className="countdown" aria-label="Time remaining until the Gruha Pravesha"><ParticleField count={10} /><p className={'eyebrow ' + (lang === 'ಕ' ? 'kn' : '')}>{lang === 'ಕ' ? 'ಸಂಭ್ರಮ ಆರಂಭವಾಗಲು' : 'THE CELEBRATION BEGINS IN'}</p><div className="count-row" aria-live="polite">{unit(Math.floor(total / 86400), labels[0])}{unit(Math.floor(total % 86400 / 3600), labels[1])}{unit(Math.floor(total % 3600 / 60), labels[2])}{unit(total % 60, labels[3])}</div></section>
}

function InvitationCard({ lang, replayToken, sectionRef }) {
  const [cardState, setCardState] = useState('closed')
  const replayTimer = useRef(null)
  const openLabel = lang === 'ಕ' ? 'ಆಹ್ವಾನ ಕಾರ್ಡ್ ತೆರೆಯಿರಿ' : 'OPEN THE INVITATION CARD'
  const closeLabel = lang === 'ಕ' ? 'ಕಾರ್ಡ್ ಮುಚ್ಚಿ' : 'CLOSE THE CARD'
  const isOpen = cardState === 'open'
  const isClosing = cardState === 'closing'
  const hint = isClosing
    ? (lang === 'ಕ' ? 'ಕಾರ್ಡ್ ಮತ್ತೆ ತೆರೆಯಲು ಸಿದ್ಧವಾಗುತ್ತಿದೆ…' : 'Closing the card, ready to open it again…')
    : isOpen
    ? (lang === 'ಕ' ? 'ಕಾರ್ಡ್ ತೆರೆದಿದೆ. ಮತ್ತೆ ನೋಡಲು ಮುಚ್ಚಿ.' : 'The card is open. Close it to enjoy the opening again.')
    : (lang === 'ಕ' ? 'ಕಾರ್ಡ್ ತೆರೆಯಲು ಸ್ಪರ್ಶಿಸಿ.' : 'Tap the cover to open your invitation.')
  const openCard = () => {
    if (!replayTimer.current) setCardState('open')
  }
  const toggleCard = () => {
    if (replayTimer.current) return
    setCardState(state => state === 'open' ? 'closed' : 'open')
  }
  useEffect(() => {
    if (!replayToken || replayTimer.current) return
    setCardState('closing')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    replayTimer.current = window.setTimeout(() => {
      replayTimer.current = null
      setCardState('open')
    }, reducedMotion ? 30 : 900)
  }, [replayToken])
  useEffect(() => () => {
    if (replayTimer.current) window.clearTimeout(replayTimer.current)
  }, [])
  return <section ref={sectionRef} className={'invitation-wrap card-' + cardState} aria-label="Interactive Gruha Pravesha invitation card">
    <div className="opening-petals" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ '--x': (6 + (i * 29) % 88) + '%', '--delay': ((i % 6) * 0.15) + 's', '--duration': (2.2 + (i % 4) * 0.3) + 's' }} />)}</div>
    <TiltSurface className={'invitation-stage invitation-book-scene' + (isOpen ? ' is-open' : '') + (isClosing ? ' is-closing' : '')}>
      <div className="invitation-book">
        <div className="book-paper-edges" aria-hidden="true" />
        <article className="invitation-card card-inside">
          <div className="card-border"><i /><i /><i /><i /></div>
          <Lotus /><p className="ganesha">॥ SHREE GANESHAY NAMAH ॥</p><OrnamentalRule />
          <h2 className="invitation-title">GRUHA PRAVESHA</h2>
          <p className="lead booklet-only">With immense pleasure, we cordially invite you and your family to grace the auspicious occasion of the Gruha Pravesha ceremony of our new home.</p>
          <div className="house-name">SHRI HARI NILAYA</div>
          <div className="event-columns"><div><span>DATE &amp; DAY</span><strong>Thursday, 12th November 2026</strong></div><div><span>POOJA TIME</span><strong>7:30 AM – 8:30 AM</strong></div><div><span>LUNCH</span><strong>12:00 PM (Noon)</strong></div></div>
          <OrnamentalRule /><p className="label">VENUE</p><p className="venue-copy">{address}</p><OrnamentalRule />
          <p className="label booklet-only">CORDIALLY INVITED BY</p><p className="names booklet-only">Mr. Veerendra Heggade<br />Mrs. Shobha<br />Harikiran M. V.<br />Hariprasad M. V.</p>
          <p className="closing-copy booklet-only">We warmly welcome you and your family to join us on this special occasion and bless our new home.<br /><br />Your gracious presence will make our celebration more memorable.</p><Lotus small />
        </article>
        <button type="button" className="card-cover" onClick={openCard} aria-label={openLabel} aria-expanded={isOpen} tabIndex={isOpen || isClosing ? -1 : 0}>
          <span className="card-cover-front">
            <span className="cover-border"><i /><i /><i /><i /></span><span className="cover-ganesha-glow" aria-hidden="true" />
            <img className="cover-ganesha" src="/images/ganesha.png" alt="" /><span className="cover-blessing">॥ श्री गणेशाय नमः ॥</span><span className="cover-rule" aria-hidden="true" />
            <strong>GRUHA PRAVESHA</strong><span className="cover-family">THE HEGGADE FAMILY</span><span className="cover-home">SHRI HARI NILAYA</span><span className="cover-date">THURSDAY · 12 NOVEMBER 2026</span>
            <span className="cover-open-cue">{openLabel} <b aria-hidden="true">✦</b></span>
          </span>
          <span className="card-cover-back" aria-hidden="true"><span className="cover-back-mantra">॥ श्री गणेशाय नमः ॥</span><img className="cover-back-ganesha" src="/images/ganesha.png" alt="" /><strong>A NEW BEGINNING.<br />A NEW HOME.</strong><span className="cover-back-copy">With immense pleasure, we cordially invite you and your family to grace the auspicious occasion of the Gruha Pravesha ceremony of our new home.</span><i className="cover-back-divider" /><span className="cover-back-family">CORDIALLY INVITED BY<br /><b>Mr. Veerendra Heggade<br />Mrs. Shobha<br />Harikiran M. V.<br />Hariprasad M. V.</b></span><em>We warmly welcome you and your family to join us and bless our new home. Your gracious presence will make our celebration more memorable.</em></span>
        </button>
      </div>
    </TiltSurface>
    <div className="card-controls"><p aria-live="polite">{hint}</p><button type="button" className="card-toggle" onClick={toggleCard} aria-expanded={isOpen} disabled={isClosing}>{isOpen ? closeLabel : openLabel}</button></div>
  </section>
}

function CulturalSection() {
  return <section className="culture-section"><div className="thoranam" aria-hidden="true">{Array.from({ length: 13 }, (_, i) => <i key={i} />)}</div><div className="culture-inner reveal"><p className="eyebrow">THE SPIRIT OF TRADITION</p><h2>A home blessed by heritage</h2><p>Every threshold tells a story. May this one welcome prosperity, laughter and the warmth of togetherness.</p><GaneshaStage className="heritage-ganesha" /><OrnamentalRule /></div></section>
}
function Details() {
  return <section className="details-section reveal"><p className="eyebrow">MARK THE MOMENT</p><h2>GRUHA PRAVESHA</h2><OrnamentalRule /><div className="details-grid"><TiltSurface as="article" className="detail-card"><Icon name="calendar" /><span>DATE</span><strong>Thursday, 12th November 2026</strong></TiltSurface><TiltSurface as="article" className="detail-card"><span className="detail-symbol">☼</span><span>POOJA</span><strong>7:30 AM – 8:30 AM</strong></TiltSurface><TiltSurface as="article" className="detail-card"><span className="detail-symbol">✦</span><span>LUNCH</span><strong>12:00 PM (Noon)</strong></TiltSurface><TiltSurface as="article" className="detail-card"><Icon name="pin" /><span>VENUE</span><strong>{address}</strong></TiltSurface></div></section>
}

function Location() {
  const [status, setStatus] = useState('Google Maps will use your current location for directions.')
  const [directionsError, setDirectionsError] = useState(false)
  const openDirections = () => {
    setDirectionsError(false)
    setStatus('Opening Google Maps for driving directions…')
    try {
      // Navigate synchronously from the click, with no blank/about intermediate page.
      // Google Maps handles current-location detection and its installed-app handoff.
      window.location.assign(mapDirectionsUrl)
    } catch {
      setDirectionsError(true)
      setStatus('Google Maps could not be opened. Please try again.')
    }
  }
  return <section className="location-section reveal"><div className="location-map" aria-label="Illustrated directions motif"><div className="map-route route-a" /><div className="map-route route-b" /><div className="map-route route-c" /><div className="map-grain" /><div className="map-marker"><Icon name="pin" size={29} /></div><p>ILLUSTRATED DIRECTIONS MOTIF</p></div><div className="location-copy"><p className="eyebrow">OUR NEW THRESHOLD</p><h2>WE ARE WAITING<br />FOR YOU!</h2><p className="address">{address}</p><button type="button" className="gold-button directions" onClick={openDirections}><Icon name="pin" /> GET DIRECTIONS TO OUR HOME</button><small aria-live="polite" role={directionsError ? 'alert' : undefined}>{status}</small>{directionsError && <button type="button" className="gold-button directions" onClick={openDirections}>TRY AGAIN</button>}</div></section>
}

function Family() {
  return <section className="family-section reveal"><Lotus /><p className="eyebrow">WITH WARM HEARTS</p><h2>CORDIALLY INVITED BY</h2><OrnamentalRule /><p className="family-names">Mr. Veerendra Heggade <span>·</span> Mrs. Shobha<br />Harikiran M. V. <span>·</span> Hariprasad M. V.</p><div className="floral-bottom"><i /><i /><i /></div></section>
}
function Closing() {
  return <><section className="closing-section"><ParticleField count={12} /><div className="closing-frame"><GaneshaStage className="closing-ganesha" /><p className="eyebrow">WITH EVERY GOOD WISH</p><h2>YOUR PRESENCE IS OUR<br />GREATEST BLESSING.</h2><p>Your gracious presence will make our celebration more memorable.</p><p className="kannada">ಸಕುಟುಂಬ ಸಮೇತರಾಗಿ ಆಗಮಿಸಿ ನಮ್ಮನ್ನು ಹರಸಿ ಹಾರೈಸಬೇಕಾಗಿ ವಿನಂತಿ.</p><OrnamentalRule /><p className="with-love">WITH LOVE AND REGARDS</p><h3>THE HEGGADE FAMILY</h3></div></section><Footer /></>
}
function Footer() {
  return <footer className="site-footer"><p>Designed &amp; Developed by Theerthananda & Hariprasad M.V.</p><p>© 2026 All Rights Reserved.</p></footer>
}
function UtilityBar({ onReplay, playing, onMusic, lang, setLang }) {
  return <nav className="utility-bar" aria-label="Invitation controls"><button onClick={onMusic} aria-label={playing ? 'Pause background music' : 'Play background music'}><Icon name={playing ? 'pause' : 'music'} /><span>{lang === 'ಕ' ? (playing ? 'ನಿಲ್ಲಿಸಿ' : 'ಸಂಗೀತ') : (playing ? 'PAUSE' : 'MUSIC')}</span></button><button onClick={onReplay}><Icon name="replay" /><span>{lang === 'ಕ' ? 'ಮತ್ತೆ ನೋಡಿ' : 'REPLAY'}</span></button><button className="language" onClick={() => setLang(lang === 'EN' ? 'ಕ' : 'EN')} aria-label="Change display language">{lang}</button></nav>
}
function Actions({ lang }) {
  return <section className="actions-section reveal"><p className="eyebrow">{lang === 'ಕ' ? 'ದಿನಾಂಕ ಉಳಿಸಿ' : 'SAVE THE DATE'}</p><h2>{lang === 'ಕ' ? 'ನಮ್ಮೊಂದಿಗೆ ಸಂಭ್ರಮಿಸಿ' : 'Celebrate with us'}</h2><div className="action-buttons"><button onClick={downloadCalendar}><Icon name="calendar" /> {lang === 'ಕ' ? 'ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಸೇರಿಸಿ' : 'ADD TO CALENDAR'}</button><a href="/invitation.pdf" download="gruhapravesha-invitation.pdf"><Icon name="download" /> {lang === 'ಕ' ? 'ಆಹ್ವಾನ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ' : 'DOWNLOAD INVITATION'}</a><button onClick={shareWhatsApp}><Icon name="share" /> {lang === 'ಕ' ? 'ಆಹ್ವಾನ ಹಂಚಿಕೊಳ್ಳಿ' : 'SHARE INVITATION'}</button></div><a className="rsvp" href={'https://wa.me/?text=' + encodeURIComponent('Namaskara! I would like to confirm my attendance for the Gruha Pravesha on 12th November 2026.')} target="_blank" rel="noreferrer">{lang === 'ಕ' ? 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ RSVP' : 'RSVP ON WHATSAPP'} <span>→</span></a></section>
}

export default function App() {
  const [phase, setPhase] = useState('welcome')
  const [lang, setLang] = useState('EN')
  const [cardReplayToken, setCardReplayToken] = useState(0)
  const openingTimer = useRef(null)
  const cardSectionRef = useRef(null)
  const { playing, toggle } = useAmbientMusic()
  const open = () => {
    if (phase !== 'welcome') return
    setPhase('opening')
    openingTimer.current = window.setTimeout(() => {
      setPhase('revealed')
      window.scrollTo({ top: 0, behavior: 'auto' })
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 30 : 820)
  }
  const replay = () => {
    if (phase !== 'revealed') return
    setCardReplayToken(token => token + 1)
    window.requestAnimationFrame(() => {
      cardSectionRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      })
    })
  }
  useEffect(() => () => {
    if (openingTimer.current) window.clearTimeout(openingTimer.current)
  }, [])
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible')
    }), { threshold: 0.1 })
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [phase])
  useEffect(() => {
    document.documentElement.lang = lang === 'ಕ' ? 'kn' : 'en'
  }, [lang])
  const siteClass = phase === 'opening' ? 'site site-visible site-opening' : phase === 'revealed' ? 'site site-visible site-opening site-revealed' : 'site'
  return <>{phase !== 'revealed' && <Opening phase={phase} onOpen={open} lang={lang} />}<main className={siteClass}><UtilityBar onReplay={replay} playing={playing} onMusic={toggle} lang={lang} setLang={setLang} /><InvitationCard lang={lang} replayToken={cardReplayToken} sectionRef={cardSectionRef} /><Countdown lang={lang} /><CulturalSection /><Details /><Location /><Family /><Actions lang={lang} /><Closing /></main></>
}
