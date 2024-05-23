import axios, { AxiosInstance, AxiosPromise } from 'axios'
import { User } from '../hooks/useAuth'

export type ChatType = {
  language: string
  content: string
  source: 'client' | 'server'
  sessionId?: number
  id?: number
}

type LoginType = {
  email: string
  password: string
}

type PostChatResponse = {
  id: number
  source: 'server' | 'client'
  language: string
  content: string
  sessionId?: number
}

class APIService {
  BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

  axiosInstance: AxiosInstance

  constructor(authToken?: string) {
    this.axiosInstance = axios.create({
      baseURL: this.BASE_URL,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authToken }
    })
  }

  postChat(payload: ChatType): AxiosPromise<PostChatResponse> {
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
