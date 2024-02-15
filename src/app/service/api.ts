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
  static BASE_URL = 'http://localhost:8000/chats/';

  axiosInstance: AxiosInstance;

  constructor(auth: AuthType) {
    this.axiosInstance = axios.create({
      baseURL: APIService.BASE_URL,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
      auth,
    });
  }

  postChat(payload: PostChatType): AxiosPromise<PostChatResult> {
    return this.axiosInstance.post('', payload);
  }

  static getChatAudioURL(chatId: number) {
    return `${APIService.BASE_URL}${chatId}/audio/`;
  }
}

export default APIService;
