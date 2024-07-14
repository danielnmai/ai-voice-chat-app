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

describe('Chats Page component', () => {
  it('renders a heading', () => {
    render(<Page />)
    expect(replaceFn).toHaveBeenCalled()
  })
})
