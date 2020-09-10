export function getTitle(text: string): string {
    // cannot use that because old browsers don't support ?<= regexp
    // const foundTitleMatch = text.match(/(?<=<h2>)(.|\n)*?(?=<\/h2>)/i);
    // const title = (foundTitleMatch && foundTitleMatch[0] ? foundTitleMatch[0] : this.props.til.text.substring(0, 25));
    // return title;

    const loweredText = text.toLowerCase();
    const openIndex = loweredText.indexOf('<h2>');
    const closeIndex = loweredText.indexOf('</h2>', openIndex + 4);

    if (openIndex == -1 || closeIndex == -1) {
        return text.substring(0, 25);
    }

    return text.substring(openIndex + 4, closeIndex - openIndex - 4);
}