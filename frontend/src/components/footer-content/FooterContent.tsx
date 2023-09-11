import { Divider, Input, Space, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { styles } from "./styles";

interface FooterContentProps {
  message: string;
  setMessage: (message: string) => void;
  onClick: () => void;
}

const FooterContent: React.FC<FooterContentProps> = ({
  message,
  setMessage,
  onClick,
}) => {
  return (
    <>
      <Divider style={styles.divider} />
      <Space.Compact style={styles.space}>
        <Input
          value={message}
          placeholder="Write a message..."
          onChange={(event) => setMessage(event.target.value)}
        />
        <Button size="large" type="primary" onClick={() => onClick()}>
          <SendOutlined />
        </Button>
      </Space.Compact>
    </>
  );
};

export default FooterContent;
