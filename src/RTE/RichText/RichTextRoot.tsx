import { theme } from "@/theme";
import { Box } from "@mui/material";
import { ReactNode } from "react";

interface RichTextRootProps {
  children: ReactNode;
  error?: boolean;
}

export default function RichTextRoot({ children, error = false }: RichTextRootProps) {
  return (
    <Box display={"flex"} flexDirection={"column"} width={"100%"} mt={7}>
      <Box
        borderRadius={1}
        border={"1px solid"}
        borderColor={error ? theme.palette.error.main : theme.palette.grey[300]}
      >
        {children}
      </Box>
    </Box>
  );
}
