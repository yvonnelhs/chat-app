import { Button, Input, Divider, Modal, Space } from "antd";
import { PlusOutlined, SendOutlined } from "@ant-design/icons";
import { ChatDisplayInfo } from "../../interfaces";
import ChatCard from "../chat-card/ChatCard";
import { useState } from "react";
import { styles } from "./styles";

const { Search } = Input;

interface SiderContentProps {
  userId: string;
  message: string;
  chatList: ChatDisplayInfo[];
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;
  setRecipientId: (id: string | null) => void;
  fetchChatList: () => void;
  setMessage: (message: string) => void;
  onClick: () => void;
}

const SiderContent: React.FC<SiderContentProps> = ({
  userId,
  chatList,
  message,
  selectedChatId,
  setSelectedChatId,
  setRecipientId,
  fetchChatList,
  setMessage,
  onClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div style={styles.container}>
        <Search
          placeholder="search..."
          onSearch={() => {}}
          style={styles.search}
        />
        <Button size="middle" onClick={showModal}>
          <PlusOutlined />
        </Button>
        <Modal
          title={
            <div style={styles.modalDiv}>
              <p style={styles.modalHeader}>To:</p>
              <Input
                height={20}
                style={styles.recipientInput}
                placeholder="Enter recipient"
                bordered={false}
                onChange={(event) => setRecipientId(event.target.value)}
              />
            </div>
          }
          open={isModalOpen}
          onCancel={handleCancel}
          footer={[]}
        >
          <Space.Compact style={styles.space}>
            <Input
              value={message}
              placeholder="Write a message..."
              onChange={(event) => setMessage(event.target.value)}
            />
            <Button
              type="primary"
              onClick={() => {
                onClick();
                setIsModalOpen(false);
                fetchChatList();
              }}
            >
              <SendOutlined />
            </Button>
          </Space.Compact>
        </Modal>
      </div>
      <Divider style={styles.divider} />
      {chatList.map((chatInfo) => (
        <ChatCard
          key={chatInfo.chatId}
          userId={userId}
          chatId={chatInfo.chatId}
          recipientId={chatInfo.recipientId}
          lastMessage={chatInfo.lastMessage}
          selected={selectedChatId === chatInfo.chatId}
          setSelectedChatId={setSelectedChatId}
          setRecipientId={setRecipientId}
          fetchChatList={fetchChatList}
        />
      ))}
    </>
  );
};

export default SiderContent;
