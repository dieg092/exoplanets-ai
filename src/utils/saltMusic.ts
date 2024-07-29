import { SOUND_EXOPLANET_PATH } from "@/config"

export const saltMusic = () => {
  const randomMusic = Math.round(Math.random() * (7 - 1) + 1)
  const musicPath = `${SOUND_EXOPLANET_PATH}/${randomMusic}.mp3`

  return musicPath
}
