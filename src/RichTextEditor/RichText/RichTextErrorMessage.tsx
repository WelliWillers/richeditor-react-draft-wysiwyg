import clsx from "clsx";
import { getOrMakeStyles } from "./RichTextEditorStyles";
import { TagProps } from "@/types";
import { Box, Typography } from "@mui/material";
import { theme } from "@/theme";

interface RichTextErrorMessageProps {
  className?: string;
  hint?: string;
  status?: {
    text: string;
    tags?: TagProps[];
  } | null;
}

export default function RichTextErrorMessage({
  className,
  hint,
  status,
}: RichTextErrorMessageProps) {
  const { classes: styles } = getOrMakeStyles();

  const tags = status?.tags ?? [];

  return (
    <div className={clsx(styles.view, className)}>
      <Box display={"flex"} flexDirection={"column"}>
        <Typography
          mb={!status?.text ? "39px" : "0px"}
          variant="caption"
          color={theme.palette.text.secondary}
        >
          {hint}
        </Typography>

        {status && status.text ? (
          <Typography mt={"20px"} className={styles.adjustErrorMessage}>
            {status.text}&nbsp;
            <b>
              {tags.length > 0
                ? tags.map((tag, i) => `#` + tag.name).join(", ")
                : undefined}
            </b>
          </Typography>
        ) : (
          <></>
        )}
      </Box>
    </div>
  );
}
