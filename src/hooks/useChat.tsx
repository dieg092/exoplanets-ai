import { FormEvent, useEffect, useState } from "react"
import { Message, useChat as useChatAI } from "ai/react"
import { useChatStore } from "@/store/chat"

const ENV = process.env.NODE_ENV

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "¡Hola! 🌍 Soy tu guía de exoplanetas. Por defecto te mostraré la Tierra y a medida que interactuamos, aprenderás sobre los exoplanetas. Puedes pedirme exoplanetas aleatorios 🪐, detalles específicos, ajustar la velocidad de rotación, mostrarte los confirmados por la NASA, etc. 🚀",
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
