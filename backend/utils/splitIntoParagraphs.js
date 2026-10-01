 function splitIntoParagraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph.replace(/\s+/g, " ").trim()
    )
    .filter((paragraph) => paragraph.length > 30);
}

module.exports = {
  splitIntoParagraphs,
};