import { Divider, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getUserById } from "../../utils/queries";
import { styles } from "./styles";

interface HeaderContentProps {
  recipientId: string;
}

const HeaderContent: React.FC<HeaderContentProps> = ({ recipientId }) => {
  const [recipientName, setRecipientName] = useState("");

  useEffect(() => {
    getUserById(recipientId).then((data) => {
      setRecipientName(data.username);
    });
  }, [recipientId]);

  return (
    <>
      <div style={styles.container}>
        <Avatar size={32} shape="square" icon={<UserOutlined />} />
        <p style={styles.name}>{recipientName}</p>
      </div>
      <Divider style={styles.divider} />
    </>
  );
};

export default HeaderContent;
