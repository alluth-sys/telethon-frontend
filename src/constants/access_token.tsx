export const access_token_header = (): { Authorization: string } => {
  if (
    localStorage.getItem("access_token") != "undefined" &&
    localStorage.getItem("access_token") != null
  ) {
    return {
      Authorization: JSON.parse(localStorage.getItem("access_token") || ""),
    };
  }
  return { Authorization: "" };
};
