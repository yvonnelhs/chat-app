import { Button, Input, Divider, Modal, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ChatDisplayInfo } from "../../interfaces";
import ChatCard from "../chat-card/ChatCard";
import { useState } from "react";

const { Search } = Input;

interface SiderContentProps {
  userId: string;
  chatList: ChatDisplayInfo[];
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;
  setRecipientId: (id: string | null) => void;
  fetchChatList: () => void;
}

const SiderContent: React.FC<SiderContentProps> = ({
  userId,
  chatList,
  selectedChatId,
  setSelectedChatId,
  setRecipientId,
  fetchChatList,
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
      <div style={{ display: "flex", marginBottom: "20px" }}>
        <Search
          placeholder="search..."
          onSearch={() => {}}
          style={{ marginRight: "5px" }}
        />
        <Button size="middle" onClick={showModal}>
          <PlusOutlined />
        </Button>
        <Modal
          title="Create chat"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={[]}
        >
          <p>Key in user id to start chatting</p>
          <Space.Compact style={{ width: "100%" }}>
            <Input />
            <Button type="primary" onClick={handleCancel}>
              Create
            </Button>
          </Space.Compact>
        </Modal>
      </div>
      <Divider style={{ margin: "0px" }} />
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
