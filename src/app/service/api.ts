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
  BASE_URL = 'https://70i26raxn9.execute-api.us-west-1.amazonaws.com/dev/chats/';

  // BASE_URL = 'http://localhost:8000/chats/';

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
