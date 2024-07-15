import '@testing-library/jest-dom'
import ChatComponent from '../../src/app/shared/chat'
import { render, screen, userEvent } from '../../test_utils'

const replaceFn = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      replace: replaceFn
    }
  }
}))

describe('Chats Page component', () => {
  it('renders a text input prompting user to ask question ', () => {
    render(<ChatComponent chats={[]} handlePostChat={jest.fn()} voiceEnabled setVoiceEnabled={jest.fn()} />)
    const inputField = screen.getByPlaceholderText('How can I help?')
    expect(inputField).toBeInTheDocument()
  })

  it('allows user to use voice input', () => {
    render(<ChatComponent chats={[]} handlePostChat={jest.fn()} voiceEnabled setVoiceEnabled={jest.fn()} />)
    const voiceInputBtn = screen.getByRole('button', { name: 'Start Talking' })
    expect(voiceInputBtn).toBeInTheDocument()
  })

  it('allows user to enable or disable voice response', async () => {
    const user = userEvent.setup()
    const mockedSetVoiceEnabled = jest.fn()

    render(
      <ChatComponent
        chats={[]}
        handlePostChat={jest.fn()}
        voiceEnabled={false}
        setVoiceEnabled={mockedSetVoiceEnabled}
      />
    )
    const enableVoiceBtn = screen.getByRole('button', { name: 'Enable Voice Response' })
    expect(enableVoiceBtn).toBeInTheDocument()

    await user.click(enableVoiceBtn)
    expect(mockedSetVoiceEnabled).toHaveBeenCalled()
  })

  it('triggers the method to post chat after user click the send button', async () => {
    const user = userEvent.setup()
    const mockedHandlePostChat = jest.fn()
    render(
      <ChatComponent
        chats={[]}
        handlePostChat={mockedHandlePostChat}
        voiceEnabled={false}
        setVoiceEnabled={jest.fn()}
      />
    )
    const textInput = screen.getByPlaceholderText('How can I help?')
    await user.type(textInput, 'Hello')
    const sendBtn = screen.getByRole('button', { name: 'Send' })

    await user.click(sendBtn)
    expect(mockedHandlePostChat).toHaveBeenCalledWith('Hello', expect.any(Function))
  })
})
