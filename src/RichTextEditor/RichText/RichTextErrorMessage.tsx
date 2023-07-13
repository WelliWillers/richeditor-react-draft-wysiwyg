import clsx from "clsx";
import { getOrMakeStyles } from "./RichTextEditorStyles";
import { TagProps } from "..";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import { useState } from "react";

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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (status && status.text) {
    const tags = status?.tags ?? [];

    return (
      <>
        <div className={clsx(styles.view, className)}>
          <IconButton sx={{ ml: "auto" }} onClick={handleClick}>
            <CodeIcon />
          </IconButton>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
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
          </Menu>
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
