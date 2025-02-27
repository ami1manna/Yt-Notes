// Define templates
export const templates = [
    {
      name: "Template-1",
      html: "<p>HTML source1</p>",
    },
    {
      name: "Template-2",
      html: "<p>HTML source2</p>",
    },
  ];
  
  // Define button lists for responsive design
  export const responsiveButtonList = [
    // Default (mobile first)
    ["undo", "redo"],
    [
      ":p-More Paragraph-default.more_paragraph",
      "font",
      "fontSize",
      "formatBlock",
      "paragraphStyle",
      "blockquote",
    ],
    ["bold", "underline", "italic", "strike", "subscript", "superscript"],
    ["fontColor", "hiliteColor", "textStyle"],
    ["removeFormat"],
    ["outdent", "indent"],
    ["align", "horizontalRule", "list", "lineHeight"],
    [
      "-right",
      ":i-More Misc-default.more_vertical",
      "fullScreen",
      "showBlocks",
      "codeView",
      "preview",
      "print",
      "save",
      "template",
    ],
    ["-right", ":r-More Rich-default.more_plus", "table", "math", "imageGallery"],
    ["-right", "image", "video", "audio", "link"],
  
    // Desktop (min-width: 992px)
    [
      "%992",
      [
        ["undo", "redo"],
        [
          ":p-More Paragraph-default.more_paragraph",
          "font",
          "fontSize",
          "formatBlock",
          "paragraphStyle",
          "blockquote",
        ],
        ["bold", "underline", "italic", "strike"],
        [
          ":t-More Text-default.more_text",
          "subscript",
          "superscript",
          "fontColor",
          "hiliteColor",
          "textStyle",
        ],
        ["removeFormat"],
        ["outdent", "indent"],
        ["align", "horizontalRule", "list", "lineHeight"],
        [
          "-right",
          ":i-More Misc-default.more_vertical",
          "fullScreen",
          "showBlocks",
          "codeView",
          "preview",
          "print",
          "save",
          "template",
        ],
        [
          "-right",
          ":r-More Rich-default.more_plus",
          "table",
          "link",
          "image",
          "video",
          "audio",
          "math",
          "imageGallery",
        ],
      ],
    ],
  
    // Tablet (min-width: 767px)
    [
      "%767",
      [
        ["undo", "redo"],
        [
          ":p-More Paragraph-default.more_paragraph",
          "font",
          "fontSize",
          "formatBlock",
          "paragraphStyle",
          "blockquote",
        ],
        [
          ":t-More Text-default.more_text",
          "bold",
          "underline",
          "italic",
          "strike",
          "subscript",
          "superscript",
          "fontColor",
          "hiliteColor",
          "textStyle",
        ],
        ["removeFormat"],
        ["outdent", "indent"],
        [
          ":e-More Line-default.more_horizontal",
          "align",
          "horizontalRule",
          "list",
          "lineHeight",
        ],
        [
          ":r-More Rich-default.more_plus",
          "table",
          "link",
          "image",
          "video",
          "audio",
          "math",
          "imageGallery",
        ],
        [
          "-right",
          ":i-More Misc-default.more_vertical",
          "fullScreen",
          "showBlocks",
          "codeView",
          "preview",
          "print",
          "save",
          "template",
        ],
      ],
    ],
  
    // Mobile large (min-width: 480px)
    [
      "%480",
      [
        ["undo", "redo"],
        [
          ":p-More Paragraph-default.more_paragraph",
          "font",
          "fontSize",
          "formatBlock",
          "paragraphStyle",
          "blockquote",
        ],
        [
          ":t-More Text-default.more_text",
          "bold",
          "underline",
          "italic",
          "strike",
          "subscript",
          "superscript",
          "fontColor",
          "hiliteColor",
          "textStyle",
          "removeFormat",
        ],
        [
          ":e-More Line-default.more_horizontal",
          "outdent",
          "indent",
          "align",
          "horizontalRule",
          "list",
          "lineHeight",
        ],
        [
          ":r-More Rich-default.more_plus",
          "table",
          "link",
          "image",
          "video",
          "audio",
          "math",
          "imageGallery",
        ],
        [
          "-right",
          ":i-More Misc-default.more_vertical",
          "fullScreen",
          "showBlocks",
          "codeView",
          "preview",
          "print",
          "save",
          "template",
        ],
      ],
    ],
  ];
  