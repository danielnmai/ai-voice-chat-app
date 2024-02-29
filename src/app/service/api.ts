import axios, { AxiosInstance, AxiosPromise } from 'axios';

type PostChatType = {
  language: string;
  content: string;
  source: 'client' | 'server';
};

type AuthType = {
  username: string;
  password: string;
};

type PostChatResult = {
  id: number;
  source: 'server' | 'client';
  content: string
};

class APIService {
  BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  axiosInstance: AxiosInstance;

  constructor(auth: AuthType) {
    this.axiosInstance = axios.create({
      baseURL: this.BASE_URL,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
      auth,
    });
  }

  postChat(payload: PostChatType): AxiosPromise<PostChatResult> {
    return this.axiosInstance.post('', payload);
  }

  getChatAudioURL(chatId: number) {
    return `${this.BASE_URL}${chatId}/audio/`;
  }
}

export default APIService;
