export function downloadCalendar() {
  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Heggade Family//Gruha Pravesha//EN\r\nCALSCALE:GREGORIAN\r\nBEGIN:VEVENT\r\nUID:gruhapravesha-20261112@heggade.family\r\nDTSTAMP:20261101T000000Z\r\nDTSTART;TZID=Asia/Kolkata:20261112T073000\r\nDTEND;TZID=Asia/Kolkata:20261112T123000\r\nSUMMARY:Gruha Pravesha - SHRI HARI NILAYA\r\nLOCATION:Mudalododdi, Koppa Hobli, Maddur Taluk, Mandya District, Karnataka\r\nDESCRIPTION:Gruha Pravesha ceremony. Pooja: 7:30 AM - 8:30 AM. Lunch: 12:00 PM (Noon).\r\nEND:VEVENT\r\nEND:VCALENDAR`
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = Object.assign(document.createElement('a'), { href: url, download: 'gruhapravesha-12-november-2026.ics' })
  link.click(); URL.revokeObjectURL(url)
}

export function shareWhatsApp() {
  const message = 'With immense pleasure, we invite you and your family to our Gruha Pravesha celebration on Thursday, 12th November 2026. ' + window.location.href
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
}
