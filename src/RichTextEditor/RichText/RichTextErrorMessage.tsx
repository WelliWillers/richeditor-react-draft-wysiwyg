import clsx from "clsx";
import { getOrMakeStyles } from "./RichTextEditorStyles";
import { TagProps } from "..";
import { IconButton, MenuItem, MenuList, Typography } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import { useDialog } from "@/hooks/useDialog";
import { useRef } from "react";
import { DialogBase } from "@/components/Dialog";

interface RichTextErrorMessageProps {
  className?: string;
  status?: {
    text: string;
    tags?: TagProps[];
  } | null;
  onTagClicked?: (tag: string) => void;
}

export default function RichTextErrorMessage({
  className,
  status,
  onTagClicked,
}: RichTextErrorMessageProps) {
  const { classes: styles } = getOrMakeStyles();
  const variablesRef = useRef<HTMLDivElement>();
  const { dialogRef, handleOpenDialog, isOpen, handleCloseDialog } =
    useDialog();

  if (status && status.text) {
    const tags = status?.tags ?? [];

    return (
      <>
        <div className={clsx(styles.view, className)}>
          <IconButton
            sx={{ ml: "auto" }}
            onClick={() => handleOpenDialog(variablesRef)}
          >
            <CodeIcon />
          </IconButton>

          <DialogBase
            open={dialogRef === variablesRef ? isOpen : false}
            maxWidth={"xs"}
            fullWidth
            title={"Selecionar variável"}
          >
            <MenuList>
              {tags.length > 0
                ? tags.map((tag, i) => (
                    <MenuItem
                      key={i}
                      onClick={onTagClicked?.bind(undefined, `{{${tag.name}}}`)}
                    >
                      {tag.name}
                    </MenuItem>
                  ))
                : undefined}
            </MenuList>
          </DialogBase>
        </div>
        <Typography mt={1} className={styles.adjustErrorMessage}>
          {status.text}
        </Typography>
      </>
    );
  } else {
    return <></>;
  }
}
