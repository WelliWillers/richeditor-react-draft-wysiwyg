import { theme } from "@/theme";
import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import clsx from "clsx";
import { getOrMakeStyles } from "./RichTextEditorStyles";
import { TagProps } from "..";

interface RichTextLabelProps {
  caption: string;
  status: {
    text: string;
    tags?: TagProps[];
  } | null;
  position: number;
}

export default function RichTextLabel({
  caption,
  position,
}: RichTextLabelProps) {
  const { classes: styles } = getOrMakeStyles();

  return (
    <Typography className={clsx(styles.caption, "SyoRichEditor-Label")}>
      {position}. {caption}
    </Typography>
  );
}
