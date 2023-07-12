import { IconButton, IconProps, SvgIconTypeMap } from "@mui/material";
import { ReactNode } from "react";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface RichTextActionProps {
  onSelect: () => void,
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  }
  selected?: Boolean
};

export default function RichTextAction({ onSelect, icon: Icon, selected = false }: RichTextActionProps){

  return (
    <IconButton
      onClick={() => onSelect()}
      color={selected ? 'inherit' : 'default'}
    >
      {
        Icon ? (
          <Icon />
        ) : (
          <DragIndicatorIcon />
        ) 
      }
    </IconButton>
  );
};
