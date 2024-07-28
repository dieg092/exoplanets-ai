import { FormEvent, useEffect, useState } from "react"
import { Message, useChat as useChatAI } from "ai/react"
import { useChatStore } from "@/store/chat"

const ENV = process.env.NODE_ENV

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
    handleSubmit: handleSubmitAI,
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

  useEffect(() => {
    const sceneData = () => {
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
    }

    setSceneData(sceneData())
  }, [messages, setSceneData])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !isInputDisabled)
      handleSubmit(e as unknown as FormEvent<HTMLFormElement>)
  }

  const handleChangeOpenaiKey = (text: string) => setOpenAiKey(text)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (ENV !== "development" && openaiKey === "") {
      alert("Debes ingresar una API_KEY de OPEN_AI para usar el chat")
      return
    }
    handleSubmitAI(e.currentTarget.value)
  }

  return {
    openaiKey,
    input,
    conversation,
    error,
    isLoading,
    isInputDisabled,
    stop,
    handleInputChange,
    handleSubmit,
    handleKeyDown,
    handleChangeOpenaiKey,
  }
}
