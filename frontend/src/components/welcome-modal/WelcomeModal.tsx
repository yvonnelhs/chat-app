import { Input, Modal, Space, Button } from "antd";

interface WelcomeModalProps {
  isModalOpen: boolean;
  setUserName: (username: string) => void;
  fetchUserData: () => void;
}
const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isModalOpen,
  setUserName,
  fetchUserData,
}) => {
  return (
    <Modal title="Welcome!" open={isModalOpen} footer={[]} closable={false}>
      <p>Enter your username to start chatting</p>
      <Space.Compact style={{ width: "100%" }}>
        <Input
          placeholder="Enter username here..."
          onChange={(event) => setUserName(event.target.value)}
        />
        <Button
          type="primary"
          onClick={() => {
            fetchUserData();
          }}
        >
          Submit
        </Button>
      </Space.Compact>
    </Modal>
  );
};

export default WelcomeModal;
