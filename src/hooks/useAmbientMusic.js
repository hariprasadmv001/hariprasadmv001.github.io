import { useEffect, useRef, useState } from 'react'

export function useAmbientMusic() {
  const [playing, setPlaying] = useState(false)
  const ctx = useRef(null), nodes = useRef([])
  const stop = () => { nodes.current.forEach(n => { try { n.stop() } catch {} }); nodes.current = []; setPlaying(false) }
  const toggle = async () => {
    if (playing) return stop()
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    ctx.current ||= new AC()
    await ctx.current.resume()
    const gain = ctx.current.createGain(); gain.gain.value = .025; gain.connect(ctx.current.destination)
    ;[146.83, 220, 293.66].forEach((frequency, index) => {
      const osc = ctx.current.createOscillator(); const amp = ctx.current.createGain()
      osc.type = index === 1 ? 'sine' : 'triangle'; osc.frequency.value = frequency
      amp.gain.value = index === 0 ? .48 : .16; osc.connect(amp).connect(gain); osc.start(); nodes.current.push(osc)
    })
    setPlaying(true)
  }
  useEffect(() => {
    const hidden = () => { if (document.hidden && nodes.current.length) stop() }
    document.addEventListener('visibilitychange', hidden)
    return () => { document.removeEventListener('visibilitychange', hidden); nodes.current.forEach(n => { try { n.stop() } catch {} }) }
  }, [])
  return { playing, toggle }
}
