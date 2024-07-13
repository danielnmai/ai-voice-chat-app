import '@testing-library/jest-dom'
import Page from '../../src/app/loginsignup/page'
import { render } from '../../test_utils'

const getFn = jest.fn()
const pushFn = jest.fn()

jest.mock('next/navigation', () => ({
  useSearchParams() {
    return {
      get: getFn
    }
  },
  useRouter() {
    return {
      push: pushFn
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

describe('Page', () => {
  it('renders a heading', () => {
    render(<Page />)
    expect(getFn).toHaveBeenCalled()
  })
})
  