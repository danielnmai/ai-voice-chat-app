import '@testing-library/jest-dom'
import Page from '../../src/app/loginsignup/page'
import { render } from '../../test_utils'

import { useRouter, useSearchParams } from 'next/navigation'

jest.mock('next/navigation')
useRouter.mockReturnValue({
  push: jest.fn()
})

useSearchParams.mockReturnValue({
  toString: () => toString,
  get: jest.fn()
})

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
    expect(useSearchParams).toHaveBeenCalled()
  })
})
