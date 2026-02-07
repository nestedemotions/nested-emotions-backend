function validateEmotionText(text) {
  if (
    typeof text !== "string" ||
    text.trim().length === 0 ||
    text.length > 100
  ) {
    return "text must be a non-empty string under 100 characters";
  }

  return null;
}

module.exports = validateEmotionText;
