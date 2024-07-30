import { useEffect } from "react"
import { ToggleAudio } from "./ToggleAudio"
import { VolumeAudio } from "./VolumeAudio"
import { useAudioStore } from "@/store/audio"
import { saltMusic } from "@/utils/saltMusic"

export const AudioWrapper = ({ isChatHidden }: { isChatHidden: boolean }) => {
  const setAudio = useAudioStore((store) => store.setAudio)

  useEffect(() => {
    setAudio(new Audio(saltMusic()))
  }, [])

  return (
    <div
      className={` ${
        !isChatHidden ? "hidden" : ""
      } md:flex gap-4 absolute z-50 bottom-5 left-5  p-3 rounded-md justify-center items-center`}
    >
      <ToggleAudio />
      <VolumeAudio />
    </div>
  )
}
