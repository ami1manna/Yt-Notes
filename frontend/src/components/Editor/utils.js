import katex from "katex";
 export const decodeLatex = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    tempDiv.querySelectorAll("span").forEach((el) => {
      const latexMatch = el.textContent.match(/^\$\$(.*?)\$\$/);
      if (latexMatch) {
        const latexCode = latexMatch[1];
        const katexSpan = document.createElement("span");
        katexSpan.innerHTML = katex.renderToString(latexCode, { throwOnError: false });
        el.replaceWith(katexSpan);
      }
    });
    return tempDiv.innerHTML;
  };

  export const extractLatex = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    tempDiv.querySelectorAll("span").forEach((el) => {
      const latexCode = el.getAttribute("data-exp");
      if (latexCode) {
        const latexSpan = document.createElement("span");
        latexSpan.textContent = `$$${latexCode}$$`;
        el.replaceWith(latexSpan);
      }
    });
    return tempDiv.innerHTML;
  };