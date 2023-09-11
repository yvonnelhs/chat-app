import { styles } from "./styles";

interface TextMessageProps {
  message: string;
  sentByUser: boolean;
}

const TextMessage: React.FC<TextMessageProps> = ({ message, sentByUser }) => {
  return (
    <div style={sentByUser ? styles.sentMessage : styles.receivedMessage}>
      {message}
    </div>
  );
};

export default TextMessage;
