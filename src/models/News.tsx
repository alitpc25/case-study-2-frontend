export default class News {
    id: string;
    topic: string;
    content: string;
    expirationDate: string;
    link: string;

    constructor(id: string, topic: string, content: string, expirationDate: string, link: string) {
        this.id = id;
        this.topic = topic;
        this.content = content;
        this.expirationDate = expirationDate;
        this.link = link;
    }
}