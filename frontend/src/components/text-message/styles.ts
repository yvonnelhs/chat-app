const commonStyles: React.CSSProperties = {
  maxWidth: "360px",
  minWidth: "10px",
  width: "fit-content",
  wordWrap: "break-word",
  lineHeight: "18px",
  padding: "8px 18px",
  textAlign: "left",
  marginBottom: "5px",
};

export const styles: { [key: string]: React.CSSProperties } = {
  sentMessage: {
    ...commonStyles,
    backgroundColor: "#1777fe",
    borderRadius: "10px 10px 0 10px",
    color: "#ffffff",
    marginLeft: "auto",
  },
  receivedMessage: {
    ...commonStyles,
    backgroundColor: "#e8e8eb",
    borderRadius: "10px 10px 10px 0px",
    marginRight: "auto",
  },
};
