import { useChatStore } from "@/store/chat"
import { Send, StopCircle } from "lucide-react"
import { ChangeEvent, FormEvent, KeyboardEvent } from "react"

type Props = {
  input: string
  isLoading: boolean
  isInputDisabled: boolean
  stop: () => void
  handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  handleKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
}

const ChatFooter = ({
  input,
  isLoading,
  isInputDisabled,
  stop,
  handleInputChange,
  handleSubmit,
  handleKeyDown,
}: Props) => {
  return (
    <>
      <form
        onSubmit={e => {
          handleSubmit(e)
        }}
        className="flex items-center px-3 pb-3"
      >
        <textarea
          className="border rounded-md mr-2 flex-grow p-2 bg-black bg-opacity-30 text-white backdrop-blur-md"
          name="prompt"
          value={input}
          onChange={handleInputChange}
          id="input"
          onKeyDown={handleKeyDown}
          style={{ resize: "none" }}
        />

        <button
          type={`${isLoading ? "button" : "submit"}`}
          onClick={isLoading ? stop : () => {}}
          disabled={!isLoading && isInputDisabled}
          className="p-4 bg-opacity-50 text-white rounded-full flex items-center justify-center ml-2"
        >
          {isLoading ? <StopCircle size={35} /> : <Send size={30} />}
        </button>
      </form>
    </>
  )
}

export default ChatFooter
