import { EditorState } from "react-draft-wysiwyg";
import { editorStateToWhatsapp } from "./draft-js";
import lodash from "lodash";

export function getText(
  editorState: EditorState,
  userTag: string[],
  decoratedTag: string[],
  regex: RegExp
): string {
  let text = editorStateToWhatsapp(editorState);

  console.log("text:", text);
  text = lodash.replace(text, regex, (match) => {
    if (userTag.includes(match)) {
      const decoratedTagFinded = decoratedTag.find((item) =>
        item.includes(match)
      );
      if (decoratedTagFinded) {
        return decoratedTagFinded;
      }

      return match;
    } else {
      return match;
    }
  });
  return text;
}
