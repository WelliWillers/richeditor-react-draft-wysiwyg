import { EditorState } from "react-draft-wysiwyg";
import { OrderedSet } from "immutable";
import { ContentBlock } from "react-draft-wysiwyg";
import { getText } from "./getText";
import { EditorStateUtils } from "./draft-js/editorstate-utils";

const markBodyStyle = "BOLD";
const markEdgeStyle = "color-rgb(26,188,156)";

export function highlightMacro(
  editorState: EditorState,
  all: boolean,
  userTag: string[],
  decoratedTag: string[],
  userDecoratedTag: string[],
  TAG_EXP: RegExp,
  tag: string
) {
  const previousSelection = editorState.getSelection();

  const undoStack = editorState.getUndoStack();
  const redoStack = editorState.getRedoStack();
  const decorator = editorState.getDecorator();

  const changed = [false];

  const tagStyles = OrderedSet.of<string>(markEdgeStyle, markBodyStyle);
  const nonValidEdgeStyles = OrderedSet.of<string>(markBodyStyle, "ITALIC");
  const nonValidBodyTagStyles = OrderedSet.of<string>(markEdgeStyle, "ITALIC");

  let blocks: ContentBlock[];
  if (all) {
    blocks = editorState.getCurrentContent().getBlocksAsArray();
  } else {
    const previousSelection = editorState.getSelection();
    blocks = [];
    const editionBlock = editorState
      .getCurrentContent()
      .getBlockForKey(previousSelection.getStartKey());
    if (editionBlock) {
      blocks.push(editionBlock);
    }
  }

  for (let block of blocks) {
    const text = getText(editorState, userTag, decoratedTag, TAG_EXP, tag);
    // Format valid tags
    let i = 0;
    decoratedTag.map((decoratedTagItem) => {
      do {
        const rangeStartIndex = text.indexOf(decoratedTagItem, i);

        if (rangeStartIndex !== -1) {
          const rangeEndIndex = rangeStartIndex + decoratedTagItem.length;
          const tagBodyIndex = rangeStartIndex + 2;
          const tabBodyEndIndex = rangeEndIndex - 2;

          console.log("tagBodyIndex", tagBodyIndex);
          console.log("tabBodyEndIndex", tabBodyEndIndex);

          editorState = EditorStateUtils.applyStyleIfNeeded(
            editorState,
            block,
            markEdgeStyle,
            rangeStartIndex,
            tagBodyIndex,
            changed
          );
          editorState = EditorStateUtils.removeStyleIfNeeded(
            editorState,
            block,
            nonValidEdgeStyles,
            rangeStartIndex,
            tagBodyIndex,
            changed
          );

          editorState = EditorStateUtils.applyStyleIfNeeded(
            editorState,
            block,
            markBodyStyle,
            tagBodyIndex,
            tabBodyEndIndex,
            changed
          );
          editorState = EditorStateUtils.removeStyleIfNeeded(
            editorState,
            block,
            nonValidBodyTagStyles,
            tagBodyIndex,
            tabBodyEndIndex,
            changed
          );

          editorState = EditorStateUtils.applyStyleIfNeeded(
            editorState,
            block,
            markEdgeStyle,
            tabBodyEndIndex,
            rangeEndIndex,
            changed
          );
          editorState = EditorStateUtils.removeStyleIfNeeded(
            editorState,
            block,
            nonValidEdgeStyles,
            tabBodyEndIndex,
            rangeEndIndex,
            changed
          );
          i = rangeEndIndex;
        } else {
          break;
        }
      } while (i < text.length);

      // Unformat invalid tags, when detectable
      i = 0;
      while (i < text.length) {
        let ch = text.charAt(i);
        if (ch === "{") {
          const tagStartIdx = i;
          let tagEndIdx = -1;

          i++;
          if (i < text.length) {
            ch = text.charAt(i);
            if (ch === "{") {
              i++;
            }
          }

          while (i < text.length) {
            ch = text.charAt(i);
            if (ch === "{") {
              tagEndIdx = Math.max(i - 1, 0);
              break;
            } else if (ch === "}") {
              tagEndIdx = Math.min(i + 2, text.length);
              break;
            } else if (ch === "\n") {
              break;
            }
            i++;
          }

          if (tagEndIdx !== -1 && tagEndIdx > tagStartIdx) {
            const possibleDecoratedTag = text.substring(tagStartIdx, tagEndIdx);
            if (possibleDecoratedTag !== decoratedTagItem) {
              editorState = EditorStateUtils.removeStyleIfNeeded(
                editorState,
                block,
                tagStyles,
                tagStartIdx,
                tagEndIdx,
                changed
              );
            }
          }
        } else {
          i++;
        }
      }

      block = editorState.getCurrentContent().getBlockForKey(block.getKey());
      block.findStyleRanges(
        // Filter
        (characters) => {
          return characters.hasStyle(markEdgeStyle);
        },
        // Callback
        (start, end) => {
          let tagStartIdx = text.indexOf("{{", start);
          let tagEndIdx = -1;
          if (tagStartIdx !== -1) {
            tagEndIdx = Math.min(
              tagStartIdx + decoratedTagItem.length,
              text.length
            );
          } else {
            const p = text.indexOf("}}", start);
            if (p !== -1) {
              tagEndIdx = p + 2;
              tagStartIdx = Math.max(tagEndIdx - decoratedTagItem.length, 0);
            } else {
              editorState = EditorStateUtils.removeInlineStyle(
                editorState,
                block,
                start,
                end,
                markEdgeStyle
              );
              changed[0] = true;
            }
          }

          if (tagStartIdx !== -1 && tagEndIdx !== -1) {
            const possibleTag = text.substring(tagStartIdx, tagEndIdx);
            if (possibleTag !== decoratedTagItem) {
              editorState = EditorStateUtils.removeInlineStyle(
                editorState,
                block,
                start,
                end,
                markEdgeStyle
              );
              changed[0] = true;
            } else {
              if (tagStartIdx > start) {
                while ("}" === text.charAt(start)) {
                  start++;
                }

                editorState = EditorStateUtils.removeInlineStyle(
                  editorState,
                  block,
                  start,
                  tagStartIdx,
                  markEdgeStyle
                );
                changed[0] = true;
              }

              if (tagEndIdx < end) {
                editorState = EditorStateUtils.removeInlineStyle(
                  editorState,
                  block,
                  tagEndIdx,
                  end,
                  markEdgeStyle
                );
                changed[0] = true;
              }
            }
          } else {
            editorState = EditorStateUtils.removeInlineStyle(
              editorState,
              block,
              start,
              end,
              markEdgeStyle
            );
            changed[0] = true;
          }
        }
      );
    });
  }

  if (changed[0]) {
    // editorState = EditorState.createEmpty({
    //   currentContent: editorState.getCurrentContent(),
    //   undoStack,
    //   redoStack,
    //   decorator,
    //   selection: previousSelection,
    // });
  }

  return editorState;
}
