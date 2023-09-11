export const defaultStyles: { [key: string]: React.CSSProperties } = {
  divider: {
    margin: "0px",
  },
  name: {
    textAlign: "left",
    lineHeight: "18px",
    margin: "0px",
    fontWeight: "bold",
  },
  lastMessage: {
    textAlign: "left",
    lineHeight: "18px",
    margin: "0px",
    color: "#706f6f",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "180px",
    whiteSpace: "nowrap",
  },
  row: {
    lineHeight: "65px",
  },
  container: {
    display: "table-cell",
    verticalAlign: "middle",
    height: "65px",
  },
  icon: {
    color: "#706f6f",
  },
};

export const selectedStyles = {
  row: {
    ...defaultStyles.row,
    backgroundColor: "#1777fe",
    borderRadius: "10px",
  },
  name: {
    ...defaultStyles.name,
    color: "#ffffff",
  },
  lastMessage: {
    ...defaultStyles.lastMessage,
    color: "#e3e3e3",
  },
  icon: {
    color: "#ffffff",
  },
};
