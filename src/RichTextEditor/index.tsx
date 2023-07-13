import { Box, Container, Stack, TextField, Typography } from "@mui/material";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useEffect, useState } from "react";
import draftToHtml from "draftjs-to-html";
import { EditorState, Modifier, convertToRaw } from "draft-js";

import { EditorStateUtils } from "../RichTextEditor/utils/draft-js/editorstate-utils";
import {
  editorStateToWhatsapp,
  whatsappToEditorState,
} from "../RichTextEditor/utils/draft-js";

import lodash, { includes } from "lodash";
import { HtmlUtils } from "../utils/html-utils";
import { RichText } from "./RichText";
import { getText } from "./utils/getText";
import { highlightMacro } from "./utils/hightlithMacro";

const TAG_START_EXP = /(?<!\w)###(\w+(?:_\w+)*)(?![\w`'"~])/g;
const TAG_EXP = /\{\{[*,_,~,`]*[A-z\u00C0-\u00ff]+[*,_,~,`]*}\}/g;

export type TagProps = {
  field: string;
  name: string;
};

type StatusProps = {
  text: string;
  tags?: TagProps[];
} | null;

interface RichTextProps {
  initialConfigs: {
    title: string;
    description: string;
    key: string;
    defaultMessage: string;
    fields: TagProps[];
    message: string;
  };
}

export default function RichTextEditor({ initialConfigs }: RichTextProps) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [tag, setTag] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [decoratedTag, setDecoratedTag] = useState<string[]>(
    initialConfigs.fields.map((item) => `{{${item.name}}}`)
  );
  const [userTag, setUserTag] = useState<string[]>(
    initialConfigs.fields.map((item) => item.field)
  );
  const [userDecoratedTag, setUserDecoratedTag] = useState<string[]>([]);
  const [modified, setModified] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusProps>(null);
  const [focus, setFocus] = useState<boolean>(false);

  useEffect(() => {
    if (initialConfigs) {
      setTag(initialConfigs.key);
      setCaption(initialConfigs.title);
      setStatus({
        text: "Tags",
        tags: initialConfigs.fields,
      });
      synchronizeState(initialConfigs.defaultMessage);
    }
  }, [initialConfigs]);

  useEffect(() => {
    setUserDecoratedTag(userTag ? userTag.map((item) => `{{${item}}}`) : []);
  }, [userTag]);

  function onTextChanged(editorState: EditorState) {
    if (initialConfigs.fields) {
      setEditorState(
        highlightMacro(editorState, false, userTag, decoratedTag, TAG_EXP)
      );
    } else {
      setEditorState(editorState);
    }

    setModified(true);
    onBeforeScopeUpdate();
  }

  function onTagClicked(variableClicked: string) {
    let editorStateValue = editorState;
    let contentState = editorStateValue.getCurrentContent();

    let selection = editorStateValue.getSelection();
    contentState = Modifier.removeRange(contentState, selection, "forward");

    editorStateValue = EditorState.push(
      editorStateValue,
      contentState,
      "delete-character"
    );
    selection = editorStateValue.getSelection();

    const variableToInclude = decoratedTag.find((item) =>
      item.includes(variableClicked)
    );

    contentState = Modifier.insertText(
      contentState,
      selection,
      variableToInclude!,
      EditorStateUtils.NoStyle
    );

    editorStateValue = EditorState.push(
      editorStateValue,
      contentState,
      "insert-characters"
    );

    selection = editorStateValue.getSelection();

    setStatus(null);
    setFocus(true);

    editorStateValue = highlightMacro(
      editorStateValue,
      false,
      userTag,
      decoratedTag,
      TAG_EXP
    );
    editorStateValue = EditorState.forceSelection(editorStateValue, selection);
    setEditorState(editorStateValue);
  }

  async function synchronizeState(markupText: string) {
    markupText = lodash.replace(markupText, TAG_START_EXP, (match) => {
      const foundUserTag = userTag.find((item) => item === match.substring(3));

      if (foundUserTag) {
        const finded = initialConfigs.fields.find(
          (item) => item.field === foundUserTag
        );
        if (finded) {
          return `{{${finded.name}}}`;
        }
        return match;
      } else {
        return match;
      }
    });

    let editorState = whatsappToEditorState(markupText);

    if (decoratedTag) {
      decoratedTag.map((decoratedTagItem) => {
        editorState = highlightMacro(
          editorState,
          true,
          userTag,
          decoratedTag,
          TAG_EXP
        );
      });
    }

    setEditorState(editorState);
    validate(true);

    setModified(true);
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
    decoratedTag.map((decoratedTagItem) => {
      if (text.includes(decoratedTagItem)) {
        setStatus(null);
        return;
      } else {
        const missingTags = initialConfigs.fields.find(
          (item) =>
            item.name ===
            decoratedTagItem.substring(2, decoratedTagItem.length - 2)
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

  function validate(force = false) {
    if (force || modified) {
      updateMessageStatus(editorState);
      setModified(false);
    }
  }

  function onBeforeScopeUpdate() {
    validate(true);
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
              status: status,
              focus: focus,
              onChanged: onTextChanged,
              onTagClicked: onTagClicked,
            }}
          >
            <RichText.Error status={status} onTagClicked={onTagClicked} />
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
