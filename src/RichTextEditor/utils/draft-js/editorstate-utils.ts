import {
    ContentBlock,
    ContentState,
    convertFromHTML,
    convertToRaw,
    EditorState,
    Modifier,
    SelectionState
} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { OrderedSet } from 'immutable'

export class EditorStateUtils {
    public static readonly NoStyle = OrderedSet.of<string>()

    public static createWithHTML(htmlText: string | undefined | null) {
        if (htmlText) {
            const draftContent = convertFromHTML(htmlText)
            const contentstate = ContentState.createFromBlockArray(draftContent.contentBlocks, draftContent.entityMap)
            return EditorState.createWithContent(contentstate)
        } else {
            return EditorState.createEmpty()
        }
    }

    public static getHtml(editorState: EditorState) {
        const rawContent = convertToRaw(editorState.getCurrentContent())
        return draftToHtml(rawContent)
    }

    public static removeInlineStyle(me: EditorState, block: ContentBlock, i: number, j: number, style: string) {
        const key = block.getKey()
        const selection = SelectionState.createEmpty(key).merge({
            anchorKey: key,
            anchorOffset: i,
            focusKey: key,
            focusOffset: j
        })

        const contentState = Modifier.removeInlineStyle(me.getCurrentContent(), selection, style)
        me = EditorState.push(me, contentState, 'change-inline-style')
        return me
    }

    public static removeStyleIfNeeded(
        me: EditorState,
        block: ContentBlock,
        styles: OrderedSet<string>,
        i: number,
        j: number,
        changed: boolean[]
    ) {
        const segments: { start: number; end: number; style: string }[] = []

        styles.forEach((optionStyle) => {
            const style = optionStyle ?? ''
            block.findStyleRanges(
                // Filter
                (characters) => {
                    return characters.hasStyle(style)
                },
                // Callback
                (start, end) => {
                    if (start >= i && end <= j) {
                        segments.push({ start, end, style })
                    }
                }
            )
        })

        if (segments.length > 0) {
            const key = block.getKey()

            for (const segment of segments) {
                const selection = SelectionState.createEmpty(key).merge({
                    anchorKey: key,
                    anchorOffset: segment.start,
                    focusKey: key,
                    focusOffset: segment.end
                })

                const contentState = Modifier.removeInlineStyle(me.getCurrentContent(), selection, segment.style)
                me = EditorState.push(me, contentState, 'change-inline-style')
                changed[0] = true
            }
        }

        return me
    }

    public static applyStyleIfNeeded(
        me: EditorState,
        block: ContentBlock,
        style: string,
        i: number,
        j: number,
        changed: boolean[]
    ) {
        let foundStartIndex = false
        let foundEndIndex = false

        block.findStyleRanges(
            // Filter
            (characters) => {
                return characters.hasStyle(style)
            },
            // Callback
            (start, end) => {
                if (!foundStartIndex) {
                    foundStartIndex = start === i
                }

                if (!foundEndIndex) {
                    foundEndIndex = end === j
                }
            }
        )

        if (!foundStartIndex || !foundEndIndex) {
            const key = block.getKey()

            const selection = SelectionState.createEmpty(key).merge({
                anchorKey: key,
                anchorOffset: i,
                focusKey: key,
                focusOffset: j
            })

            const contentState = Modifier.applyInlineStyle(me.getCurrentContent(), selection, style)
            me = EditorState.push(me, contentState, 'change-inline-style')
            changed[0] = true
        }

        return me
    }
}

export class ContentBlockUtils {
    public static getAllStyles(me: ContentBlock, i: number, j: number) {
        const map = new Map<string, boolean>()
        while (i < j) {
            const style = me.getInlineStyleAt(i)
            style.forEach((v) => {
                if (v) {
                    map.set(v, true)
                }
            })
            i++
        }
        return map
    }
}
