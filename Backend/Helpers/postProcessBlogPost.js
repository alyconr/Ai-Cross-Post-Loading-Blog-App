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
    // Extract headings, excluding those within code blocks
    const nonCodeBlockContent = content.replace(/```[\s\S]*?```/g, match => match.replace(/^#{1,3} .+$/gm, ''));
    const headings = nonCodeBlockContent.match(/^#{1,3} .+$/gm) || [];

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

      // Replace original heading with a markdown-style anchor link, 
      // but only outside of code blocks
      content = content.replace(
        new RegExp(`^(${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})$`, 'm'), 
        (match, originalHeading) => {
          // Check if the match is within a code block
          const lines = content.split('\n');
          const matchIndex = lines.findIndex(line => line === originalHeading);
          
          let isInCodeBlock = false;
          let openCodeBlocks = 0;
          
          for (let i = 0; i < matchIndex; i++) {
            if (lines[i].startsWith('```')) {
              openCodeBlocks += lines[i].match(/```/g).length;
            }
          }
          
          isInCodeBlock = (openCodeBlocks % 2 !== 0);
          
          // If not in a code block, add the anchor
          return isInCodeBlock 
            ? originalHeading 
            : `<a id="${slug}"></a>\n\n${originalHeading}`;
        }
      );
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
        const citation = `[${index + 1}] ${doc.metadata.source} "${
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
};