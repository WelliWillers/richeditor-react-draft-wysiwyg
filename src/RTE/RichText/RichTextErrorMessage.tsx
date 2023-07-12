import { theme } from "@/theme";
import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface RichTextErrorMessageProps {
  message?: string;
}

export default function RichTextErrorMessage({ message }: RichTextErrorMessageProps) {

  if(!message){
    return <></>
  }

  return (
    <Box position={'absolute'} px={'14px'} pt={1}>
      <Typography variant="body2" color={theme.palette.error.main}>
        {message}
      </Typography>
    </Box>
  );
}
