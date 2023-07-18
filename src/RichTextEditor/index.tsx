import { Box, Container, Stack, TextField, Typography } from "@mui/material";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useEffect, useState } from "react";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw } from "draft-js";

import { whatsappToEditorState } from "./utils/draft-js";

import { HtmlUtils } from "../utils/html-utils";
import { RichText } from "./RichText";
import { convertVariablesToHashtagVariable } from "./utils/convertVariablesToHashtagVariable";
import { RichTextProps, StatusProps, TagProps } from "@/types";

export default function RichTextEditor({ initialConfigs }: RichTextProps) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [caption, setCaption] = useState<string>("");

  const [modified, setModified] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusProps>(null);
  const [focus, setFocus] = useState<boolean>(false);

  useEffect(() => {
    if (initialConfigs) {
      setCaption(initialConfigs.title);
      setStatus({
        text: "Tags obrigatórias: ",
        tags: initialConfigs.fields,
      });

      const text = convertVariablesToHashtagVariable(
        initialConfigs.defaultMessage,
        initialConfigs.fields
      );

      const textConvertedToEditonState = whatsappToEditorState(text);

      setEditorState(textConvertedToEditonState);
    }
  }, [initialConfigs]);

  useEffect(() => {
    validate(true);
  }, [editorState]);

  function onTextChanged(editorState: EditorState) {
    updateMessageStatus(editorState);
    setEditorState(editorState);
    setFocus(true);
  }

  function validate(force = false) {
    if (force || modified) {
      updateMessageStatus(editorState);
      setModified(false);
    }
  }

  function updateMessageStatus(editorState: EditorState) {
    setHasError(false);
    const text = (editorState.getCurrentContent().getPlainText() ?? "").trim();
    if (HtmlUtils.isEmpty(text)) {
      setStatus({
        text: "Falta informar o conteúdo",
      });
      setHasError(true);
    }

    let variablesList: TagProps[] = [];

    initialConfigs.fields.map((decoratedTagItem) => {
      if (text.includes(`#${decoratedTagItem.name}`)) {
        setStatus(null);
        return;
      } else {
        const missingTags = initialConfigs.fields.find(
          (item) => item.name === decoratedTagItem.name
        );

        if (missingTags) {
          variablesList.push(missingTags);
          return;
        }
      }
    });

    if (variablesList.length > 0) {
      setStatus({
        text:
          variablesList.length > 1
            ? `Insira as variáveis necessárias (${variablesList.length})`
            : `Insira a variável necessária (${variablesList.length})`,
        tags: variablesList,
      });
      setHasError(true);
      return;
    } else {
      setStatus(null);
      setHasError(false);
      return;
    }
  }

  return (
    <Stack p={2}>
      <Container>
        <RichText.Root status={status}>
          <RichText.Label caption={caption} position={1} status={status} />
          <RichText.Content
            scope={{
              caption: caption,
              text: editorState,
              variables: initialConfigs.fields,
              status: status,
              focus: focus,
              onChanged: onTextChanged,
            }}
          >
            <RichText.Error
              status={status}
              hint="Para adicionar uma varíavel use #"
            />
          </RichText.Content>
        </RichText.Root>

        <Box mt={4}>
          <Typography>Texto convertido para HTML</Typography>
          <TextField
            disabled
            fullWidth
            multiline
            type="textarea"
            value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
          />
        </Box>
      </Container>
    </Stack>
  );
}
