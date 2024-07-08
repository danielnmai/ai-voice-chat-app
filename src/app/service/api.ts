import axios, { AxiosError, AxiosInstance, AxiosPromise } from 'axios'
import { User } from '../hooks/useAuth'
import { UserFormType } from '../loginsignup/page'

export type ChatType = {
  language: string
  content: string
  source: 'client' | 'server'
  sessionId?: number
  id?: number
}

export type GetChatsParams = {
  sessionId?: number
  userId?: number
}

export type GetChatSessionsParams = {
  userId: number
}

export type ChatSession = {
  id: number
  created: string
  firstMessage: string
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

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.BASE_URL,
      timeout: 30000
    })

    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        if (error instanceof AxiosError && error.response?.status == 401) {
          window.location.href = '/loginsignup'
        }
        return Promise.reject(error)
      }
    )
  }

  postChat(payload: ChatType): AxiosPromise<PostChatResponse> {
    return this.axiosInstance.post('/chats', payload)
  }

  postChatDemo(payload: ChatType): AxiosPromise<PostChatResponse> {
    return this.axiosInstance.post('/chats/demo', payload)
  }

  getChatAudioURL(chatId: number) {
    return `${this.BASE_URL}${chatId}/chats/audio/`
  }

  getChats(params: GetChatsParams) {
    return this.axiosInstance.get('/chats', { params })
  }

  getChatSessions({ userId }: GetChatSessionsParams): AxiosPromise<ChatSession[]> {
    return this.axiosInstance.get(`/users/${userId}/chatsessions`)
  }

  login(payload: LoginType): AxiosPromise<User> {
    return this.axiosInstance.post('/users/login', payload)
  }

  postUser(payload: UserFormType): AxiosPromise {
    return this.axiosInstance.post('/users', payload)
  }
}

export default APIService
