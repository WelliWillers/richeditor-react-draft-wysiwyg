import { useRef } from "react";
import { Editor } from "react-draft-wysiwyg";
import { getOrMakeStyles } from "./RichTextEditorStyles";
import { Box } from "@mui/material";
import { RichTextContentProps } from "@/types";

export default function RichTextContent({
  scope,
  children,
}: RichTextContentProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor>(null);

  if (scope.focus) {
    const editorContainer = editorContainerRef.current;
    const editor = editorRef.current;
    if (editorContainer && editor) {
      scope.focus = false;
      editorContainer.scrollIntoView({ behavior: "smooth" });
      editor.focusEditor();
    }
  }

  const { classes: styles } = getOrMakeStyles();

  const sugestionOtion = scope.status?.tags?.map((field) => {
    const item = {
      text: field.field,
      value: field.name,
    };

    return item;
  });

  return (
    <Box className={styles.editorInput} ref={editorContainerRef}>
      <Editor
        ref={editorRef}
        editorState={scope.text}
        onEditorStateChange={scope.onChanged}
        wrapperStyle={{
          display: "flex",
          flexDirection: "column-reverse",
        }}
        localization={{
          locale: "pt",
        }}
        editorClassName={styles.editorConfiguration}
        toolbarClassName={styles.toolbarConfiguration}
        toolbar={{
          options: ["inline", "emoji", "history"],
          inline: {
            bold: { className: styles.toolbarButtons },
            italic: { className: styles.toolbarButtons },
            options: ["bold", "italic"],
          },
          emoji: {
            component: undefined,
            className: styles.toolbarButtons,
            popupClassName: styles.emojiPopup,
          },
          history: {
            undo: { className: styles.toolbarButtons },
            redo: { className: styles.toolbarButtons },
          },
        }}
        mention={{
          separator: " ",
          trigger: "#",
          suggestions: sugestionOtion ? sugestionOtion : [],
        }}
      />
      <Box className={styles.errorMessageRelativeToToolbar}>{children}</Box>
    </Box>
  );
}
