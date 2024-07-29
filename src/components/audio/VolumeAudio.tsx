import { useAudioStore } from "@/store/audio"
import * as Slider from "@radix-ui/react-slider"
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react"
import { useState } from "react"

export const VolumeAudio = () => {
  const volume = useAudioStore((store) => store.volume)
  const setVolume = useAudioStore((store) => store.setVolume)
  const audio = useAudioStore((store) => store.audio)
  const [oldVolume, setOldVolume] = useState(0)

  return (
    <div className="flex gap-2 justify-center items-center">
      <button
        className="hover:transition hover:ease-in-out hover:scale-125"
        onClick={() => {
          if (volume !== 0) {
            setOldVolume(volume)
            audio.volume = 0
            setVolume(0)
          }

          if (volume === 0) {
            audio.volume = oldVolume
            setVolume(oldVolume)
          }
        }}
      >
        {volume === 0 ? (
          <VolumeX className="text-white hover:text-slate-400" />
        ) : volume <= 0.2 ? (
          <Volume className="text-white hover:text-slate-400" />
        ) : volume <= 0.5 ? (
          <Volume1 className="text-white hover:text-slate-400" />
        ) : (
          volume <= 1 && <Volume2 className="text-white hover:text-slate-400" />
        )}
      </button>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-[100px] h-5 cursor-pointer"
        value={[volume]}
        max={1}
        min={0}
        step={0.1}
        onValueChange={(e) => {
          setVolume(e[0])
          audio.volume = e[0]
        }}
      >
        <Slider.Track className="bg-blackA7 relative grow rounded-full h-[3px]">
          <Slider.Range className="absolute bg-white rounded-full h-full hover:bg-slate-400" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-blackA4 rounded-[10px] hover:bg-violet3 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-blackA5 hover:bg-slate-400 hover:ease-in-out hover:scale-125"
          aria-label="Volume"
        />
      </Slider.Root>
    </div>
  )
}
