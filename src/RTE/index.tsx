import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { RichText } from "./RichText";

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import CodeIcon from '@mui/icons-material/Code';

export interface TextStyles {
  bold?: boolean,
  italic?: boolean,
};

export default function RTE() {
  const [styles, setStyles] = useState<TextStyles>({
    bold: false,
    italic: false,
  });
  
  const [textContent, setTextContent] = useState<string>('*Não há horários disponíveis no dia informado.* Encontrei _alguns *horários*_ disponíveis no dia *###ARG_1*:\n\n ###OPTIONS\nSelecione o horário desejado informando o número correspondente ou digite uma nova data (Ex.: *###ARG_2*) para verificarmos a disponibilidade.');

  return (
    <RichText.Root >
      <RichText.Label  label={'Seleção de veículo (Lista)'} position={1} />
      <RichText.Content setStyles={setStyles} textContent={textContent} styles={styles} />
        
      <RichText.ActionsBar >
        <RichText.Action
          icon={CodeIcon}
          onSelect={() => alert('Abrir modal para selecionar variáveis')}
        />
        <RichText.Action
          selected={styles.bold}
          icon={FormatBoldIcon}
          onSelect={() => setStyles({ ...styles, bold: !styles.bold })}
        />
        <RichText.Action
          selected={styles.italic}
          icon={FormatItalicIcon}
          onSelect={() => setStyles({ ...styles, italic: !styles.italic })}
        />
        <RichText.Action
          icon={SentimentSatisfiedIcon}
          onSelect={() => {}}
        />
        <RichText.Action
          icon={UndoIcon}
          onSelect={() => {}}
        />
        <RichText.Action
          icon={RedoIcon}
          onSelect={() => {}}
        />
      </RichText.ActionsBar>
      
      <RichText.Error message=""/>
    </RichText.Root>
  );
};