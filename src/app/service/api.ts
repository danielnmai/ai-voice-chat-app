import axios, { AxiosInstance } from "axios";

type PostChatType = {
  language: string;
  content: string;
  source: 'client' | 'server';
}

type AuthType = {
  username: string;
  password: string;
}

class APIService {
  BASE_URL = 'http://localhost:8000/chats/';
  axiosInstance: AxiosInstance;

  constructor(auth: AuthType) {
    this.axiosInstance = axios.create({ 
      baseURL: this.BASE_URL,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json'},
      auth
    })
  }

  postChat(payload: PostChatType) {
    return this.axiosInstance.post('', payload);
  }
}

export default APIService;