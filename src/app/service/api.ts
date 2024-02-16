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
  url = 'http://localhost:8000/chats/';

  axiosInstance: AxiosInstance;

  username: string;

  password: string;

  constructor(auth: AuthType) {
    this.axiosInstance = axios.create({
      baseURL: this.url,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
      auth,
    });

    this.username = auth.username;
    this.password = auth.password;
  }

  streamResponse(payload: PostChatType) {
    return fetch(`${this.url}stream/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${this.username}:${this.password}`)}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(100000),
    });
  }

  postChat(payload: PostChatType): AxiosPromise<PostChatResult> {
    return this.axiosInstance.post('', payload);
  }

  getChatAudioURL(chatId: number) {
    return `${this.url}${chatId}/audio/`;
  }
}

export default APIService;
