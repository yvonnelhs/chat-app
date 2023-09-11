export const styles: { [key: string]: React.CSSProperties } = {
  emptyContent: {
    backgroundColor: "#ffffff",
    width: "100%",
    alignItems: "center",
    height: "100vh",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  layout: {
    height: "100vh",
  },
  header: {
    backgroundColor: "#ffffff",
  },
  content: {
    textAlign: "center",
    backgroundColor: "#ffffff",
    padding: "10px 50px 0",
  },
  sider: {
    textAlign: "center",
    lineHeight: "120px",
    backgroundColor: "#f9f9f9",
    padding: "10px",
    height: "100vh",
    overflowY: "auto",
  },
  footer: {
    backgroundColor: "#ffffff",
    height: "85px",
    padding: "0 50px",
  },
  messageList: {
    overflowY: "auto",
    maxHeight: `calc(100% - 1px)`,
  },
};
