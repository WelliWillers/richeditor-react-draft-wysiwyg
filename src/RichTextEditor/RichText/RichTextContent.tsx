import { ReactNode, useRef } from "react";
import { Editor, EditorState } from "react-draft-wysiwyg";
import { getOrMakeStyles } from "./RichTextEditorStyles";
import { Box } from "@mui/material";
import { TagProps } from "..";
import CodeIcon from "@mui/icons-material/Code";

interface RichTextContentProps {
  children: ReactNode;
  scope: {
    caption: string;
    text: EditorState;
    status: {
      text: string;
      tags?: TagProps[];
    } | null;
    focus: boolean;
    onChanged: (p0: EditorState) => void;
    onTagClicked: (p: string) => void;
  };
}

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
            className: styles.toolbarButtons,
            popupClassName: styles.emojiPopup,
          },
          history: {
            undo: { className: styles.toolbarButtons },
            redo: { className: styles.toolbarButtons },
          },
        }}
      />
      <Box className={styles.errorMessageRelativeToToolbar}>
        {scope.status?.text ? children : <></>}
      </Box>
    </Box>
  );
}
