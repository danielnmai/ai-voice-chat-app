'use client'

import { Anchor, Button, Center, Group, Paper, PasswordInput, Stack, Text, TextInput } from '@mantine/core'
import { isEmail, useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import APIService from '../service/api'
import handleError from '../service/handleError'

export type UserFormType = {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

type LoginSignupType = 'login' | 'signup'

const LoginSignUp = () => {
  const params = useSearchParams()
  const defaultType = params.get('type') as LoginSignupType

  const [type, setType] = useState<LoginSignupType>(defaultType || 'login')
  const router = useRouter()
  const { loginUser } = useAuth()

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },

    validate: {
      email: isEmail('Email is required'),
      password: (val: string) => val.length < 4 && 'Password should include at least 4 characters',
      confirmPassword: (val, values) => (type === 'signup' && val !== values.password ? 'Password did not match' : null)
    }
  })

  const toggleType = () => {
    if (type == 'login') setType('signup')
    else setType('login')
  }

  const handleSubmit = async (values: UserFormType) => {
    try {
      const api = new APIService()
      if (type == 'login') {
        const { email, password } = values
        const { data } = await api.login({ email, password })
        console.log('data ', data)

        loginUser(data)
        form.reset()
        router.push('/chats')
      } else {
        const { email, password } = values
        const response = await api.postUser({ email, password })

        if (response && response.data) {
          notifications.show({
            color: 'green',
            title: 'Success',
            message: 'User created. Please log in with your credentials.'
          })
          form.reset()
          setType('login')
        }
      }
    } catch (err) {
      handleError(err)
    }
  }

  return (
    <Center className="h-screen">
      <Paper radius="md" p="xl" withBorder>
        <Text size="lg" fw={500} pb={5}>
          {type === 'signup' ? 'Sign up' : 'Log in'}
        </Text>
        <form aria-label="form" onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="you@email.com"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password}
              radius="md"
            />
            {type === 'signup' && (
              <PasswordInput
                required
                label="Confirm password"
                placeholder="confirm password"
                value={form.values.confirmPassword}
                onChange={(event) => form.setFieldValue('confirmPassword', event.currentTarget.value)}
                error={form.errors.confirmPassword}
                radius="md"
              />
            )}
          </Stack>

          <Group mt="xl">
            <Anchor component="button" type="button" onClick={toggleType} size="xs">
              {type === 'signup' ? 'Already have an account? Login' : "Don't have an account? Sign up"}
            </Anchor>
            <Button type="submit">{type === 'signup' ? 'Sign up' : 'Log in'}</Button>
          </Group>
        </form>
      </Paper>
    </Center>
  )
}

export default LoginSignUp
