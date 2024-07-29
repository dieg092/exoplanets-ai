import React from "react"
import { useAudioStore } from "@/store/audio"
import { Pause, Play } from "lucide-react"

export const ToggleAudio = () => {
  const audio = useAudioStore((store) => store.audio)
  const volume = useAudioStore((store) => store.volume)
  const isPlaying = useAudioStore((store) => store.isPlaying)
  const setIsPlaying = useAudioStore((store) => store.setIsPlaying)

  return (
    <button onClick={() => setIsPlaying(!isPlaying)}>
      {isPlaying ? (
        <Play
          className="text-white hover:text-slate-400 hover:transition hover:ease-in-out hover:scale-125"
          onClick={() => {
            if (audio) {
              audio.volume = volume
              audio.loop = true
              audio.play()
            }
          }}
        />
      ) : (
        <Pause
          className="text-white hover:text-slate-400 hover:transition hover:ease-in-out hover:scale-125"
          onClick={() => {
            if (audio) audio.pause()
          }}
        />
      )}
    </button>
  )
}
