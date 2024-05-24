'use client'

import { Anchor, Button, Center, Group, Paper, PasswordInput, Stack, Text, TextInput } from '@mantine/core'
import { isEmail, useForm } from '@mantine/form'
import { upperFirst, useToggle } from '@mantine/hooks'
import { useRouter } from 'next/navigation'
import useAuth from '../hooks/useAuth'
import APIService from '../service/api'

type FormType = {
  email: string
  password: string
  name?: string
}

const Login = () => {
  const [type, toggle] = useToggle(['login', 'register'])
  const router = useRouter()
  const { loginUser, logoutUser } = useAuth()

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: ''
    },

    validate: {
      email: isEmail('Email is required'),
      password: (val: string) => val.length < 4 && 'Password should include at least 4 characters'
    }
  })

  const handleSubmit = async (values: FormType) => {
    try {
      if (type == 'login') {
        const api = new APIService()
        const { email, password } = values
        const { data } = await api.login({ email, password })

        loginUser(data)
        form.reset()
        router.push('/')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleLogout = () => {
    logoutUser()
    router.push('/login')
  }

  return (
    <Center className="h-screen">
      <Paper radius="md" p="xl" withBorder>
        <Text size="lg" fw={500} pb={5}>
          {upperFirst(type)}
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {type === 'register' && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                radius="md"
              />
            )}

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
          </Stack>

          <Group mt="xl">
            <Anchor component="button" type="button" onClick={() => toggle()} size="xs">
              {type === 'register' ? 'Already have an account? Login' : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit">{upperFirst(type)}</Button>
          </Group>
        </form>
        <Button onClick={handleLogout}>Log Out</Button>
      </Paper>
    </Center>
  )
}

export default Login
