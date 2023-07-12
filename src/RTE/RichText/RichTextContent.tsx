import { theme } from "@/theme";
import { Box, InputBase, TextField, Typography } from "@mui/material";
import { TextStyles } from "..";
import { FormEvent, useEffect, useRef, useState } from "react";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

interface RichTextContentProps {
  styles: TextStyles;
  textContent: string;
  setStyles: React.Dispatch<React.SetStateAction<TextStyles>>;
}

export default function RichTextContent({
  styles,
  textContent,
  setStyles,
}: RichTextContentProps) {
  const textInputRef = useRef<HTMLInputElement>();
  let clickTimeout: NodeJS.Timeout | null = null;

  const [initialTextContent, setInitialTextContent] = useState<string>("");
  const [textContentHtml, setTextContentHtml] = useState("");
  const [textContentHtmlUnformated, setTextContentHtmlUnformated] =
    useState("");

  useEffect(() => {
    formatTextContentToHtml(initialTextContent);
  }, [initialTextContent]);

  useEffect(() => {
    setInitialTextContent(textContent);
  }, [textContent]);

  function unformatHtmlToTextContent(text: string) {
    const regexBold = /<b>(.*?)<\/b>/g;
    const regexItalic = /<i>(.*?)<\/i>/g;
    const regexSpan = /{{\s*(.*?)\s*}}/g;
    const regexLineBreak = /<br\s*\/?>/g;

    text = text
      .replace(regexBold, "*$1*")
      .replace(regexItalic, "_$1_")
      .replace(regexSpan, "###$1")
      .replace(regexLineBreak, "\n");

    return text;
  }

  function formatTextContentToHtml(text: string) {
    text = text.replaceAll("*###", "###*");
    text = text.replace(/\*(.*?)\*/g, "<b>$1</b>");
    text = text.replace(/_(.*?)_/g, "<i>$1</i>");
    text = text.replace(/###(.*?)([:.,?!)]?)(\s|$)/g, "{{ $1 }}$2$3");
    text = text.replace(/\n/g, "<br/>");

    setTextContentHtml(text);

    return text;
  }

  useEffect(() => {
    handleBold();
  }, [styles]);

  const handleBold = () => {
    const selectedText = window.getSelection()?.anchorNode?.nodeValue || "";
    let updatedContent = initialTextContent;

    if (selectedText) {
      const regex = /(\*{1})([^*]+)(\*{1})/g;
      const matches = initialTextContent.matchAll(regex);

      for (const match of matches) {
        const [fullMatch, startTag, matchedText, endTag] = match;

        if (matchedText.includes(selectedText)) {
          const replacement = matchedText.replace(
            selectedText,
            selectedText.startsWith("*") && selectedText.endsWith("*")
              ? selectedText.slice(1, -1)
              : `*${selectedText}*`
          );
          updatedContent = updatedContent.replace(
            fullMatch,
            `${startTag}${replacement}${endTag}`
          );
        } else {
          updatedContent = updatedContent.replace(
            fullMatch,
            `${startTag}${matchedText}${endTag}`
          );
        }
      }

      if (!updatedContent.includes(selectedText)) {
        updatedContent = `${updatedContent}*${selectedText}*`;
      }

      setInitialTextContent(updatedContent);
    }
  };

  // const handleItalic = () => {
  //   if (!textInputRef.current) return;
  //   const editor = textInputRef.current;
  //   const selection = window.getSelection();
  //   if (selection) {
  //     const range = selection.getRangeAt(0);
  //     const selectedText = range.toString();
  //     const italicText = `_${selectedText}_`;
  //     const modifiedContent = initialTextContent.replace(selectedText, italicText);
  //     setInitialTextContent(modifiedContent);
  //   }
  //   // editor.focus();
  // };

  function getSelectionTextToValidIfHaveBoldOrItalic() {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      return;
    }

    clickTimeout = setTimeout(() => {
      const selectedText = window.getSelection()?.anchorNode?.nodeValue;
      console.log("selectedText", selectedText);

      let bold = false;
      let italic = false;

      if (selectedText) {
        const regexBold = /\*(.*?)\*/g;
        const regexItalic = /_(.*?)_/g;

        const boldMatches = initialTextContent.match(regexBold);
        const italicMatches = initialTextContent.match(regexItalic);

        if (boldMatches) {
          boldMatches.forEach((match) => {
            if (match.includes(selectedText)) {
              bold = true;
            }
          });
        }

        if (italicMatches) {
          italicMatches.forEach((match) => {
            if (match.includes(selectedText)) {
              italic = true;
            }
          });
        }
      }

      setStyles({ bold, italic });
      clickTimeout = null;
    }, 100);
  }

  function getSelectionText() {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    const startPosSelection = range?.startOffset;
    const endPosSelection = range?.endOffset;

    console.log("Posição inicial selection: ", startPosSelection);
    console.log("Posição final selection: ", endPosSelection);
  }

  function getInnerHTML(event: any) {
    const textUnformated = unformatHtmlToTextContent(event.target.innerHTML);

    const startPos = textInputRef.current?.selectionStart;
    const endPos = textInputRef.current?.selectionEnd;
    // console.log("Posição inicial: ", startPos);
    // console.log("Posição final: ", endPos);

    setInitialTextContent(textUnformated);
  }

  return (
    <>
      <Box>
        <Box
          py={1}
          px={1.5}
          ref={textInputRef}
          contentEditable
          onBlur={getInnerHTML}
          onKeyUp={getSelectionText}
          onClick={getSelectionTextToValidIfHaveBoldOrItalic}
          dangerouslySetInnerHTML={{ __html: textContentHtml }}
        />

        <Typography mt={12}>{initialTextContent}</Typography>
      </Box>
    </>
  );
}
