import '@testing-library/jest-dom'
import Page from '../../src/app/chats/page'
import { render } from '../../test_utils'

const replaceFn = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      replace: replaceFn
    }
  }
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

describe('Page', () => {
  it('renders a heading', () => {
    render(<Page />)
    expect(replaceFn).toHaveBeenCalled()
  })
})
