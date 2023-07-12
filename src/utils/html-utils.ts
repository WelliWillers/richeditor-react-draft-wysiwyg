const divCleanerElm = document.createElement('div')

export const hasFiles = (p: FileList | null): p is FileList => (p?.length ?? 0) > 0

const hasChars = (text: string | undefined | null) => {
    if (text) {
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i)
            if (code > 32 && code < 255) {
                return true
            }
        }
    }
    return false
}

export class HtmlUtils {
    public static htmlToPlainText(html: string) {
        divCleanerElm.innerHTML = html
        return divCleanerElm.textContent
    }

    public static isEmpty(html: string) {
        return !hasChars(HtmlUtils.htmlToPlainText(html))
    }

    public static hasText(html: string) {
        return hasChars(HtmlUtils.htmlToPlainText(html))
    }
}
