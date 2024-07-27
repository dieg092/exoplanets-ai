import { KeyboardEvent, useEffect, useMemo, useState } from "react"
import { Message, useChat as useChatAI } from "ai/react"
import { useChatStore } from "@/store/chat"

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "¡Hola! Estoy aquí para ser tu guía en el aprendizaje acerca de exoplanetas.",
  },
]

export const useChat = () => {
  const [openaiKey, setOpenAiKey] = useState<string>("")
  const setSceneData = useChatStore(state => state.setSceneData)

  const {
    messages,
    input,
    isLoading,
    error,
    handleInputChange,
    handleSubmit,
    stop,
  } = useChatAI({
    api: "api/chat",
    maxToolRoundtrips: 1,
    initialMessages: initialMessages,
    body: {
      api_key: openaiKey,
    },
  })

  const isInputDisabled = input.trim() === "" || isLoading
  const conversation = messages.filter(message => !message.toolInvocations)

  const sceneData = useMemo(() => {
    const lastMessage = messages.findLast(message =>
      message.toolInvocations?.some(
        invocation => invocation.result?.updateScene === true
      )
    )

    if (lastMessage) {
      const invocation = lastMessage.toolInvocations?.find(
        invocation => invocation.result?.updateScene === true
      )
      return invocation?.result?.data
    }

    return undefined
  }, [messages])

  useEffect(() => {
    setSceneData(sceneData)
  }, [sceneData, setSceneData])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()

      if (openaiKey === "") {
        alert("Debes ingresar una API_KEY de OPEN_AI para usar el chat")
        return
      }

      !isInputDisabled && handleSubmit(e)
    }
  }

  const handleChangeOpenaiKey = (text: string) => setOpenAiKey(text)

  return {
    openaiKey,
    input,
    conversation,
    error,
    sceneData,
    isLoading,
    isInputDisabled,
    stop,
    handleInputChange,
    handleSubmit,
    handleKeyDown,
    handleChangeOpenaiKey,
  }
}
