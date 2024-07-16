import '@testing-library/jest-dom'
import LoginSignupPage from '../../../src/app/loginsignup/page'
import { render, screen, userEvent } from '../../../test_utils'

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

describe('LoginSignup Page component', () => {
  it('renders a form for login or signup', () => {
    render(<LoginSignupPage />)
    const form = screen.getByRole('form')

    expect(form).toBeInTheDocument()
  })
  it('should switch between login and signup form when user clicks on appropriate links', async () => {
    const user = userEvent.setup()
    render(<LoginSignupPage />)
    await user.click(screen.getByRole('button', { name: "Don't have an account? Sign up" }))

    const signUpBtn = screen.getByRole('button', { name: 'Sign up' })
    expect(signUpBtn).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Already have an account? Login' }))
    const loginBtn = screen.getByRole('button', { name: 'Log in' })

    expect(loginBtn).toBeInTheDocument()
  })
  it('should raise an error if email is not valid', async () => {
    const user = userEvent.setup()
    render(<LoginSignupPage />)

    const emailField = screen.getByPlaceholderText('you@email.com')
    const pwField = screen.getByPlaceholderText('password')

    await user.type(emailField, 'wrongemail.com')
    await user.type(pwField, 'password')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByText('Email is required')).toBeVisible()
  })

  it('should raise an error if password is not at least 4 characters long', async () => {
    const user = userEvent.setup()
    render(<LoginSignupPage />)

    const emailField = screen.getByPlaceholderText('you@email.com')
    const pwField = screen.getByPlaceholderText('password')

    await user.type(emailField, 'test@email.com')
    await user.type(pwField, 'tes')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByText('Password should include at least 4 characters')).toBeVisible()
  })

  it('should raise an error if password and confirm password fields are not matched on signup form', async () => {
    const user = userEvent.setup()
    render(<LoginSignupPage />)

    await user.click(screen.getByRole('button', { name: "Don't have an account? Sign up" }))

    const emailField = screen.getByPlaceholderText('you@email.com')
    const pwField = screen.getByPlaceholderText('password')
    const confirmPwField = screen.getByPlaceholderText('confirm password')

    await user.type(emailField, 'test@email.com')
    await user.type(pwField, 'pass1')
    await user.type(confirmPwField, 'pass2')
    await user.click(screen.getByRole('button', { name: 'Sign up' }))

    expect(await screen.findByText('Password did not match')).toBeVisible()
  })
})
