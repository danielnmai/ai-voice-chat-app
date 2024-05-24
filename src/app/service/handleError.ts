import { notifications } from '@mantine/notifications'
import { AxiosError } from 'axios'

const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    notifications.show({ color: 'red', title: 'Error', message: error.message })
  } else {
    notifications.show({ color: 'red', title: 'Error', message: 'Oops, that did not work. Please try again' })
  }
}

export default handleError
