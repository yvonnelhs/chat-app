import axios from "axios";
import { ChatDisplayInfo, ChatInfo } from "../interfaces";

export const baseUrl = "http://localhost:9000/api";
const chatsResource = "chats";
const usersResource = "users";
const chatListResouce = "chat-list";

export const getChatById = async (id: string) => {
  try {
    const response = await axios.get(`${baseUrl}/${chatsResource}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat:", error);
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await axios.get(`${baseUrl}/${usersResource}/id/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const response = await axios.get(`${baseUrl}/${usersResource}/username/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

export const getChatListById = async (id: string) => {
  try {
    const response = await axios.get(`${baseUrl}/${chatListResouce}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chatList:", error);
  }
};

export const fetchSortedChatList = async (chatId: string) => {
  const chatListData = await getChatListById(chatId);
  const initialChatList = chatListData?.chat_list
    .sort((a: ChatInfo, b: ChatInfo) =>
      new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1
    );

  const transformedChatList = (await Promise.all(
    initialChatList.map(async (chatInfo: ChatInfo) => {
      try {
        const chatData = await getChatById(chatInfo.chat_id);
        const participants = chatData.participants;
        const recipientId = participants.find(
          (participant: string) => participant !== chatId
        );
        return {
          chatId: chatInfo.chat_id,
          lastMessage: chatInfo.last_message,
          recipientId: recipientId,
        };
      } catch (error) {
        console.log("Error: ", error);
      }
    })
  )) as ChatDisplayInfo[];

  return transformedChatList;
};
