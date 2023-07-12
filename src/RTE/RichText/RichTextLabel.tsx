import { theme } from "@/theme";
import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface RichTextLabelProps {
  label: string;
  position: number;
  error?: boolean;
}

export default function RichTextLabel({ label, position, error = false }: RichTextLabelProps) {
  return (
    <Typography variant="body2" color={error ? theme.palette.error.main : theme.palette.text.secondary} mt={'-12px'} ml={1} bgcolor={theme.palette.common.white} px={1} width={'fit-content'}>
      {position}. {label}
    </Typography>
  );
}
