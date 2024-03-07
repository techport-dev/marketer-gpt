const baseStyle = {
  flex: 1,
  width: "80%",
  margin: "0 auto",
  minHeight: "400px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#3b82f6",
};

const acceptStyle = {
  borderColor: "#3b82f6",
  backgroundColor: "#E8F0FE",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export { baseStyle, focusedStyle, acceptStyle, rejectStyle };
