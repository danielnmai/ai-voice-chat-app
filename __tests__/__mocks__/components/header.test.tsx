import '@testing-library/jest-dom'
import Header from '../../../src/app/components/header'
import useAuth, { User } from '../../../src/app/hooks/useAuth'
import { render, screen } from '../../../test_utils'

const mockUser: User = {
  id: 1,
  name: 'Admin',
  email: 'admin@email.com',
  authToken: 'token'
}

jest.mock('../../../src/app/hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(() => [mockUser])
}))

describe('Header component', () => {
  it('renders a header with Signup and Login buttons', () => {
    render(<Header />)
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument()
  })

  it('shows a Logout button if user is logged in', () => {
    const mockUseAuth = jest.mocked(useAuth)

    mockUseAuth.mockReturnValue({
      loggedInUser: mockUser,
      setLoggedInUser: jest.fn(),
      loginUser: jest.fn(),
      logoutUser: jest.fn()
    })

    render(<Header />)
    expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
  })
})
