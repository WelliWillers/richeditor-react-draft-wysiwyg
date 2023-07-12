import { ReactNode } from "react";
import { Box } from "@mui/material";
import { theme } from "@/theme";

interface RichTextActionBarProps {
  children: ReactNode
  error?: boolean
};

export default function RichTextActionsBar({ children, error = false }: RichTextActionBarProps){
  return (
    <Box display={'flex'} justifyContent={'flex-end'} gap={1} borderTop={'1px solid'} borderColor={error ? theme.palette.error.main : theme.palette.grey[300]} py={'4px'} px={1.5}>
      <Box display={'flex'} justifyContent={'flex-end'}>
        {children}
      </Box>
    </Box>
  );
};