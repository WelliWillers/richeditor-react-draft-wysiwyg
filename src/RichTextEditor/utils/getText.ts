import { EditorState } from "react-draft-wysiwyg";
import { editorStateToWhatsapp } from "./draft-js";
import lodash from "lodash";

export function getText(
  editorState: EditorState,
  userTag: string[],
  decoratedTag: string[],
  regex: RegExp,
  tag?: string
): string {
  let text = editorStateToWhatsapp(editorState);
  if (tag) {
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
  }
  return text;
}
