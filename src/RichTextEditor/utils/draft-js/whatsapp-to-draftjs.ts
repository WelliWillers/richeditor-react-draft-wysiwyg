import lodash from "lodash";
import { ContentState, convertFromHTML, EditorState } from "draft-js";

type Tag = {
  name: string;
  mark: string;
};

const styleCharMap = new Map<string, Tag>([
  ["*", { name: "b", mark: "*" }], // bold: *text*
  ["~", { name: "s", mark: "~" }], // Strikethrough: ~text~
  ["_", { name: "i", mark: "_" }], // italic: _text_
  ["`", { name: "pre", mark: "```" }], // Monospace: ```text```
]);

function processSegment(target: string[], segment: string) {
  if (!segment) {
    return;
  }

  const buffer: string[] = [];

  let i = 0;
  outter: while (i < segment.length) {
    const iChar = segment.charAt(i);

    const tag = styleCharMap.get(iChar);
    if (
      tag &&
      (tag.mark.length === 1 ||
        segment.substring(i, i + tag.mark.length) === tag.mark)
    ) {
      for (let j = i + tag.mark.length; j < segment.length; j++) {
        const jChar = segment.charAt(j);
        if (jChar === iChar) {
          if (
            tag.mark.length === 1 ||
            segment.substring(j, j + tag.mark.length) === tag.mark
          ) {
            if (buffer.length > 0) {
              target.push(lodash.escape(buffer.join("")));
              buffer.length = 0;
            }

            target.push(`<${tag.name}>`);
            processSegment(target, segment.substring(i + tag.mark.length, j));
            target.push(`</${tag.name}>`);

            i = j + tag.mark.length;
            continue outter;
          }
          break;
        }
      }
    }

    buffer.push(iChar);
    i++;
  }

  if (buffer.length > 0) {
    target.push(lodash.escape(buffer.join("")));
  }
}

export function whatsappToEditorState(whastappText: string): EditorState {
  if (!whastappText) {
    return EditorState.createEmpty();
  }
  try {
    const html: string[] = [];

    for (const line of whastappText.split(/\r?\n/)) {
      const paragraph: string[] = [];
      processSegment(paragraph, line);
      html.push(paragraph.join(""));
      html.push("<br/>");
    }

    const blocksFromHTML = convertFromHTML(html.join(""));

    return EditorState.createWithContent(
      ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      )
    );
  } catch (caught) {
    return EditorState.createEmpty();
  }
}
