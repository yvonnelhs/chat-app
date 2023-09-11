export interface ChatDisplayInfo {
  chatId: string;
  lastMessage: string;
  recipientId: string;
}

export interface ChatInfo {
  chat_id: string;
  last_message: string;
  timestamp: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
}
