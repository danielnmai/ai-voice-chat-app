import axios, { AxiosInstance, AxiosPromise } from 'axios'
import { User } from '../hooks/useAuth'

type PostChatType = {
  language: string
  content: string
  source: 'client' | 'server'
}

type LoginType = {
  email: string
  password: string
}

type PostChatResult = {
  id: number
  source: 'server' | 'client'
  content: string
}

class APIService {
  BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

  axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.BASE_URL,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  postChat(payload: PostChatType): AxiosPromise<PostChatResult> {
    return this.axiosInstance.post('/chats', payload)
  }

  getChatAudioURL(chatId: number) {
    return `${this.BASE_URL}${chatId}/chats/audio/`
  }

  login(payload: LoginType): AxiosPromise<User> {
    return this.axiosInstance.post('/users/login', payload)
  }
}

export default APIService
