import { useLayoutEffect, useRef } from "react"

type UseScrollProps = {
  element: any[]
}

export const useScroll = ({ element }: UseScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    scrollRef.current?.scrollIntoView({ block: "end" })
  }, [element])

  return {
    scrollRef,
  }
}
