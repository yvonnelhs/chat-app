import { Divider, Avatar, Col, Row } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getUserById } from "../../utils/queries";
import { useEffect, useState } from "react";
import { defaultStyles, selectedStyles } from "./styles";

interface ChatProps {
  userId: string;
  chatId: string;
  recipientId: string;
  lastMessage: string;
  selected: boolean;
  setSelectedChatId: (id: string | null) => void;
  setRecipientId: (id: string | null) => void;
  fetchChatList: () => void;
}
const ChatCard: React.FC<ChatProps> = ({
  chatId,
  recipientId,
  lastMessage,
  selected,
  setSelectedChatId,
  setRecipientId,
}) => {
  const [recipientName, setRecipientName] = useState("");

  useEffect(() => {
    getUserById(recipientId).then((data) => {
      setRecipientName(data.username);
    });
  }, []);

  return (
    <div
      onClick={() => {
        setSelectedChatId(chatId);
        setRecipientId(recipientId);
      }}
    >
      <Row style={selected ? selectedStyles.row : defaultStyles.row}>
        <Col span={6} order={1}>
          <Avatar size={40} shape="square" icon={<UserOutlined />} />
        </Col>
        <Col span={18} order={2}>
          <div style={defaultStyles.container}>
            <p style={selected ? selectedStyles.name : defaultStyles.name}>
              {recipientName}
            </p>
            <p
              style={
                selected
                  ? selectedStyles.lastMessage
                  : defaultStyles.lastMessage
              }
            >
              {lastMessage}
            </p>
          </div>
        </Col>
      </Row>
      <Divider style={defaultStyles.divider} />
    </div>
  );
};

export default ChatCard;
