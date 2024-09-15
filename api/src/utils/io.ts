export const sanitize = (text: string | null): string | null => {
  if (!text) {
    return null;
  }

  return text.replaceAll("/", "").replaceAll("%2f", "");
};
