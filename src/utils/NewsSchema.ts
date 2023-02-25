export default class NewsSchema {
    topic: string | undefined;
    content: string | undefined;
    expirationDate: Date | undefined;
    link: string | undefined;

    constructor(topic: string, content: string, expirationDate: Date, link: string) {
        this.topic = topic;
        this.content = content;
        this.expirationDate = expirationDate;
        this.link = link;
    }
}