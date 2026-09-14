import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { CSSProperties } from 'react'
import { useAppContext } from '../../context/AppContext'
import { PageNavigation } from '../../components/PageNavigation/PageNavigation'
import { TRACKS } from './tracks'
import styles from './Page2.module.css'

export interface Page3Props {
  onComplete: () => void
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

function Icon({ name }: { name: 'shuffle' | 'previous' | 'play' | 'pause' | 'next' | 'repeat' | 'volume-low' | 'volume-high' | 'arrow-right' }) {
  const paths = {
    shuffle: <><path d="M4 7h2.5c3.8 0 5.2 10 9 10H20" /><path d="m17 14 3 3-3 3" /><path d="M4 17h2.5c1.1 0 2-1 2.7-2.1M14.8 9.1C15.4 8 16 7 17 7H20" /><path d="m17 4 3 3-3 3" /></>,
    previous: <><path d="m19 5-9 7 9 7V5Z" /><path d="M5 5v14" /></>,
    play: <path d="m8 5 11 7-11 7V5Z" />,
    pause: <><path d="M8 5v14" /><path d="M16 5v14" /></>,
    next: <><path d="m5 5 9 7-9 7V5Z" /><path d="M19 5v14" /></>,
    repeat: <><path d="M17 4l3 3-3 3" /><path d="M4 7h16M7 20l-3-3 3-3" /><path d="M20 17H4" /></>,
    'volume-low': <><path d="M4 10v4h3l4 3V7l-4 3H4Z" /><path d="M15 10.5a3 3 0 0 1 0 3" /></>,
    'volume-high': <><path d="M4 10v4h3l4 3V7l-4 3H4Z" /><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" /></>,
    'arrow-right': <><path d="M4 12h15" /><path d="m14 6 6 6-6 6" /></>,
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{paths[name]}</svg>
}

export function Page2({ onComplete }: Page3Props) {
  const { dispatch } = useAppContext()
  const [trackIndex, setTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isShuffled, setIsShuffled] = useState(false)
  const [isRepeating, setIsRepeating] = useState(false)
  const [audioFailed, setAudioFailed] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const track = TRACKS[trackIndex]
  const hasRealAudio = Boolean(track.audioUrl) && !audioFailed

  useEffect(() => () => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  const goToTrack = (index: number, shouldPlay = isPlaying) => {
    setTrackIndex((index + TRACKS.length) % TRACKS.length)
    setCurrentTime(0)
    setAudioFailed(false)
    setIsPlaying(shouldPlay)
  }

  const handleTrackEnd = () => {
    if (isRepeating) {
      setCurrentTime(0)
      if (audioRef.current) audioRef.current.currentTime = 0
      return
    }
    if (!isShuffled && trackIndex === TRACKS.length - 1) {
      setIsPlaying(false)
      setCurrentTime(0)
      return
    }
    const nextIndex = isShuffled ? Math.floor(Math.random() * TRACKS.length) : trackIndex + 1
    goToTrack(nextIndex)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !hasRealAudio) return
    audio.volume = volume
    if (isPlaying) audio.play().catch(() => setAudioFailed(true))
    else audio.pause()
  }, [isPlaying, hasRealAudio, trackIndex, volume])

  useEffect(() => {
    if (!isPlaying || hasRealAudio) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const delta = (now - last) / 1000
      last = now
      setCurrentTime((time) => {
        const next = time + delta
        if (next >= track.duration) {
          handleTrackEnd()
          return 0
        }
        return next
      })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // Track changes intentionally restart this preview clock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, hasRealAudio, track.duration])

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const time = Number(event.target.value)
    setCurrentTime(time)
    if (audioRef.current && hasRealAudio) audioRef.current.currentTime = time
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Arfa FM · made for your mood</p>
          <h1>Good songs for a good day.</h1>
        </div>
        <span className={styles.liveBadge}><i /> Listening room</span>
      </header>

      <section className={styles.playerLayout}>
        <div className={styles.playerCard}>
          <div className={styles.artworkShell} style={{ '--track-color': track.color } as CSSProperties}>
            <div className={styles.artworkGlow} />
            <div className={`${styles.vinyl} ${isPlaying ? styles.spinning : ''}`}>
              <img src={track.coverUrl} alt={`${track.title} cover`} decoding="async" />
            </div>
          </div>
          <div className={styles.trackInfo}>
            <p className={styles.nowPlaying}>Now playing</p>
            <h2>{track.title}</h2>
            <p>{track.artist}</p>
          </div>

          <input className={styles.seek} type="range" min={0} max={track.duration} step={0.1} value={Math.min(currentTime, track.duration)} onChange={handleSeek} aria-label="Song progress" />
          <div className={styles.timeRow}><span>{formatTime(currentTime)}</span><span>{formatTime(track.duration)}</span></div>

          <div className={styles.controls}>
            <button type="button" className={`${styles.controlButton} ${isShuffled ? styles.active : ''}`} onClick={() => setIsShuffled((value) => !value)} aria-label="Toggle shuffle"><Icon name="shuffle" /></button>
            <button type="button" className={styles.controlButton} onClick={() => goToTrack(trackIndex - 1)} aria-label="Previous track"><Icon name="previous" /></button>
            <button type="button" className={styles.playButton} onClick={() => setIsPlaying((value) => !value)} aria-label={isPlaying ? 'Pause' : 'Play'}><Icon name={isPlaying ? 'pause' : 'play'} /></button>
            <button type="button" className={styles.controlButton} onClick={() => goToTrack(trackIndex + 1)} aria-label="Next track"><Icon name="next" /></button>
            <button type="button" className={`${styles.controlButton} ${isRepeating ? styles.active : ''}`} onClick={() => setIsRepeating((value) => !value)} aria-label="Toggle repeat"><Icon name="repeat" /></button>
          </div>

          <label className={styles.volume}><span aria-hidden="true"><Icon name="volume-low" /></span><input type="range" min={0} max={1} step={0.01} value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Volume" /><span aria-hidden="true"><Icon name="volume-high" /></span></label>
          {!track.audioUrl && <p className={styles.notice}>Preview mode · add an audio file to this track to enable playback.</p>}
          {audioFailed && <p className={styles.notice}>Audio file unavailable · continuing in preview mode.</p>}
          {hasRealAudio && <audio ref={audioRef} src={track.audioUrl} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onEnded={handleTrackEnd} onError={() => setAudioFailed(true)} />}
        </div>

        <section className={styles.queue}>
          <div className={styles.queueHeading}><div><p className={styles.kicker}>Keep the feeling going</p><h2>Some songs suggested for you</h2></div><span>{TRACKS.length} tracks</span></div>
          <div className={styles.trackList}>
            {TRACKS.map((item, index) => <button type="button" className={`${styles.trackItem} ${index === trackIndex ? styles.trackItemActive : ''}`} onClick={() => goToTrack(index, true)} key={item.id}><span className={styles.trackNumber}>{String(index + 1).padStart(2, '0')}</span><img src={item.coverUrl} alt="" loading={index === trackIndex ? 'eager' : 'lazy'} decoding="async" /><span className={styles.trackText}><strong>{item.title}</strong><small>{item.artist}</small></span><span className={styles.trackPlay}><Icon name={index === trackIndex && isPlaying ? 'pause' : 'play'} /></span></button>)}
          </div>
        </section>
      </section>

      <PageNavigation onPrevious={() => dispatch({ type: 'PREV_PAGE' })} onNext={onComplete} />
    </main>
  )
}

export default Page2
