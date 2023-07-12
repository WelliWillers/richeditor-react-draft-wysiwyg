import { Box } from "@mui/material";
import clsx from "clsx";
import { ReactNode } from "react";
import { getOrMakeStyles } from "./RichTextEditorStyles";
import { TagProps } from "..";

interface RichTextRootProps {
  children: ReactNode;
  status: {
    text: string;
    tags?: TagProps[];
  } | null;
  className?: string;
}

export default function RichTextRoot({
  children,
  status,
  className,
}: RichTextRootProps) {
  const { classes: styles } = getOrMakeStyles();

  return (
    <Box className={clsx(styles.messageBox, className)}>
      <Box
        className={clsx(
          styles.editorBox,
          status?.text
            ? styles.editorBoxWithError
            : styles.editorBoxWithoutError
        )}
      >
        {children}
      </Box>
    </Box>
  );
}
