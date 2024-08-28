const postProcessBlogPost = (content, documents) => {
  console.log("Input Content:", content);
  console.log("Documents:", documents);

  if (!content || typeof content !== 'string') {
    console.error("Invalid content provided to postProcessBlogPost");
    return "";
  }

  if (!Array.isArray(documents)) {
    console.error("Invalid documents provided to postProcessBlogPost");
    return content;
  }

  try {
    // Extract headings
    const headings = content.match(/^#{1,3} .+$/gm) || [];

    // Generate table of contents
    let toc = "## Table of Contents\n\n";
    let tocEntries = [];

    // Create a map to store unique slugs
    const slugMap = new Map();

    headings.forEach((heading, index) => {
      const level = heading.match(/^#+/)[0].length - 1;
      const text = heading.replace(/^#+\s/, "");
      let slug = text.toLowerCase().replace(/[^\w]+/g, "-");
      
      // Ensure unique slugs
      if (slugMap.has(slug)) {
        let count = 1;
        while (slugMap.has(`${slug}-${count}`)) {
          count++;
        }
        slug = `${slug}-${count}`;
      }
      slugMap.set(slug, true);

      // Add entry to TOC, ensuring indentation is never negative
      tocEntries.push(
        `${"  ".repeat(Math.max(0, level - 1))}* [${text}](#${slug})`
      );

      // Replace original heading with a markdown-style anchor link
      content = content.replace(heading, `<a id="${slug}"></a>\n\n${heading}`);
    });

    toc += tocEntries.join("\n");

    // Insert TOC after the first heading (assumed to be the title)
    const firstHeadingIndex = content.indexOf("\n", content.indexOf("#"));
    if (firstHeadingIndex !== -1) {
      content =
        content.slice(0, firstHeadingIndex) +
        "\n\n" +
        toc +
        "\n\n" +
        content.slice(firstHeadingIndex);
    } else {
      console.warn("No headings found in the content");
      content = toc + "\n\n" + content;
    }

    // Add citations
    documents.forEach((doc, index) => {
      if (doc.metadata && doc.metadata.source && doc.metadata.title) {
        const citation = `[${index + 1}]: ${doc.metadata.source} "${
          doc.metadata.title
        }"`;
        content += `\n\n${citation}`;
      } else {
        console.warn(`Invalid document metadata for index ${index}`);
      }
    });

    console.log("Processed Content:", content);
    return content;
  } catch (error) {
    console.error("Error in postProcessBlogPost:", error);
    return content; // Return original content if processing fails
  }
};

module.exports = {
  postProcessBlogPost
}