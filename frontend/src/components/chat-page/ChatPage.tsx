import { useEffect, useState, useRef } from "react";
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { ChatServiceClient } from "../../generated/chat.client";
import { OutgoingDirectMessage } from "../../generated/chat";
import { Layout, Empty, message as alert } from "antd";
import TextMessage from "../text-message/TextMessage";
import HeaderContent from "../header-content/HeaderContent";
import FooterContent from "../footer-content/FooterContent";
import SiderContent from "../sider-content/SiderContent";
import WelcomeModal from "../welcome-modal/WelcomeModal";
import { ChatDisplayInfo } from "../../interfaces";
import { styles } from "./styles";
import {
  getChatById,
  fetchSortedChatList,
  getUserByUsername,
} from "../../utils/queries";

const { Footer, Sider, Content, Header } = Layout;

const ChatPage = () => {
  let transport = new GrpcWebFetchTransport({
    baseUrl: "http://localhost:8080",
  });
  const client = new ChatServiceClient(transport);

  const [userId, setUserId] = useState<string>("");
  const [username, setUserName] = useState<string>("");
  const [messageList, setMessageList] = useState<
    Omit<OutgoingDirectMessage, "chatId">[]
  >([]);
  const [chatList, setChatList] = useState<ChatDisplayInfo[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>();
  const [message, setMessage] = useState<string>("");
  const [receivedMessage, setReceivedMessage] =
    useState<OutgoingDirectMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [messageApi, contextHolder] = alert.useMessage();

  const fetchChatList = async () => {
    const list = await fetchSortedChatList(userId);
    setChatList(list);
  };

  const fetchMessageList = () => {
    if (selectedChatId) {
      getChatById(selectedChatId).then((data) =>
        setMessageList(data?.messages)
      );
    }
  };

  const fetchUserData = () => {
    getUserByUsername(username).then((data) => {
      if (data) {
        localStorage.setItem("userId", data._id);
        setUserId(localStorage.getItem("userId")!);
        setIsModalOpen(false);
      } else {
        messageApi.open({
          type: "error",
          content: "This is an error message",
        });
      }
    });
  };

  const sendMessage = () => {
    if (!recipientId) return;
    if (!message.replace(/\s/g, "").length) return;

    client
      .sendDirectMessage(
        {
          recipient: recipientId,
          content: message,
          timestamp: new Date().toISOString(),
        },
        { meta: { user: userId } }
      )
      .then(() => {
        const newMessage = {
          sender: userId,
          content: message,
          timestamp: new Date().toISOString(),
        };
        setMessageList((prevMessageList) => [...prevMessageList, newMessage]);
        setMessage("");
        fetchChatList();
      })
      .catch((error) => {
        console.error("Error in unary call:", error);
      });
  };

  useEffect(() => {
    if (userId) {
      fetchChatList();
    }
  }, [userId]);

  useEffect(() => {
    fetchMessageList();
  }, [selectedChatId]);

  useEffect(() => {
    if (receivedMessage && receivedMessage.chatId === selectedChatId) {
      setMessageList((prev) => [...prev, receivedMessage]);
    }
  }, [receivedMessage, selectedChatId]);

  useEffect(() => {
    const call = client.receiveDirectMessage({}, { meta: { user: userId } });
    call?.responses.onMessage((data: OutgoingDirectMessage) => {
      setReceivedMessage(data);
      fetchChatList();
    });
  }, [userId]);

  const messageListDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageListDiv.current) {
      messageListDiv.current.scrollTop = messageListDiv.current.scrollHeight;
    }
  }, [messageList]);

  useEffect(() => {
    if (localStorage.getItem("userId") != null) {
      setUserId(localStorage.getItem("userId")!);
    } else {
      setIsModalOpen(true);
    }
  }, []);

  return (
    <>
      {contextHolder}
      <WelcomeModal
        isModalOpen={isModalOpen}
        setUserName={setUserName}
        fetchUserData={fetchUserData}
      />
      <Layout>
        <Sider width={300} style={styles.sider}>
          <SiderContent
            userId={userId}
            chatList={chatList}
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
            setRecipientId={setRecipientId}
            fetchChatList={fetchChatList}
            message={message}
            setMessage={setMessage}
            onClick={sendMessage}
          />
        </Sider>
        {selectedChatId && recipientId ? (
          <Layout style={styles.layout}>
            <Header style={styles.header}>
              <HeaderContent recipientId={recipientId} />
            </Header>
            <Content style={styles.content}>
              <div ref={messageListDiv} style={styles.messageList}>
                {messageList?.map((message, idx) => (
                  <TextMessage
                    key={idx}
                    message={message.content}
                    sentByUser={message.sender === userId}
                  />
                ))}
              </div>
            </Content>
            <Footer style={styles.footer}>
              <FooterContent
                message={message}
                setMessage={setMessage}
                onClick={sendMessage}
              />
            </Footer>
          </Layout>
        ) : (
          <div style={styles.emptyContent}>
            <Empty description="Select a chat to start messaging..." />
          </div>
        )}
      </Layout>
    </>
  );
};

export default ChatPage;
