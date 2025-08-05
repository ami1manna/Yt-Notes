import katex from "katex";
import "katex/dist/katex.min.css";
import { responsiveButtonList, templates } from "@/components/editor/toolbarConfig";

export const editorOptions = {
  stickyToolbar: true,
  width: "100%",
  popupDisplay: "full",
  templates: templates,
  katex: katex,
  buttonList: responsiveButtonList,
  responsiveToolbar: true,
};
