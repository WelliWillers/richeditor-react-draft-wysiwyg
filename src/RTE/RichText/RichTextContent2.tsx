import { theme } from "@/theme";
import { Box, InputBase, TextField, Typography } from "@mui/material";
import { TextStyles } from "..";
import { useEffect, useRef, useState } from "react";

interface RichTextContentProps {
  styles: TextStyles;
  textContent: string;
}

export default function RichTextContent({
  styles,
  textContent,
}: RichTextContentProps) {

  const textInputRef = useRef<HTMLInputElement>()

  const [initialTextContent, setInitialTextContent] = useState<string>('')
  const [textContentWithHtml, setTextContentWithHtml] = useState<(string | JSX.Element)[]>()


  useEffect(() => {
    adjustTextContent(initialTextContent)
  }, [initialTextContent])

  useEffect(() => {
    setInitialTextContent(textContent)
  }, [textContent])

  // falta validar 
  // [] Quando o negrito ou itálico engloma mais de uma palavra
  // [] Substituir a variavel pelo seu devido nome
  // [] Ao add editar texto atualizar textContent
  // [] Ao digitar com negrito ou itálico ativo add * ou _ entre o novo texto 

  function adjustTextContent(text:string){
    const textArray = text.replaceAll('\n', ' -- ').split(' ')
    
    const texteWithHtml = textArray.map(item => {
      if(item.includes('*')){
        if(item.includes('###')){
          if(item[item.length - 1] === ':' || item[item.length - 1] === '!' || item[item.length - 1] === '?' || item[item.length - 1] === '.' || item[item.length - 1] === ')' || item[item.length - 1] === ','){
            const lastCaracter = item[item.length - 1]
            if(item.substring(0) === '_'){
              return (
                <>
                    <span style={{ color: theme.palette.secondary.main }}>{`${"{{"}`}</span>
                      <b>
                        <i>
                          {` ${item.replaceAll("*", "").replace("###", "").replace(lastCaracter, "")} `}
                        </i>
                      </b>
                    <span style={{ color: theme.palette.secondary.main }}>{`${"}}"}`}</span>
                  {lastCaracter}{" "}
                </>
              )
            }
            return (
              <>
                <span style={{ color: theme.palette.secondary.main }}>{`${"{{"}`}</span>
                  <b>
                    {` ${item.replaceAll("*", "").replace("###", "").replace(lastCaracter, "")} `}
                  </b>
                <span style={{ color: theme.palette.secondary.main }}>{`${"}}"}`}</span>
                {lastCaracter}{" "}
              </>
            );
          }
          return (
            <>
              <span style={{ color: theme.palette.secondary.main }}>{`${"{{"}`}</span>
                <b>
                  {` ${item.replaceAll("*", "").replace("###", "")} `}{" "}
                </b>
              <span style={{ color: theme.palette.secondary.main }}>{`${"}}"}`}</span>
            </>
          )
        }
        return <b>{item}</b>
      }
  
      if(item.includes('###')){
        return (
          <>
            <span style={{color: theme.palette.secondary.main}}>{`${'{{'}`}</span>
            {` ${item.replace('###', '')} `}
            <span style={{color: theme.palette.secondary.main}}>{`${'}}'}`}</span>
          </>
        )
      }
  
      if(item.includes('_')){
        return <i>{item.replaceAll('_', '')} </i>
      }
  
      if(item.includes('--')){
        return <br/> 
      }
  
      return `${item} ` 
    })

    setTextContentWithHtml(texteWithHtml)
  }

  function getInnerHTML(e: any){
    
    if(styles.bold){
      console.log('01', document.getSelection())
    }
    
    if(styles.italic){
      console.log('02')
    }

    if(!styles.bold && !styles.italic){
      console.log('03')
    }
    
  }

  return (
    <Box>
      <Box py={1} px={1.5} ref={textInputRef} contentEditable="true" onKeyDown={(e) => getInnerHTML(e)}>

        <Typography variant="body2">
          {
            textContentWithHtml
          }
        </Typography>

      </Box>
    </Box>
  );
}
