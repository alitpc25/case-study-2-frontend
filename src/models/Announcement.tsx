export default class Announcement {
    id: string | undefined;
    topic: string | undefined;
    content: string | undefined;
    expirationDate: string | undefined;
    image: string | undefined;

    constructor(id: string, topic: string, content: string, expirationDate: string, image: string) {
        this.id = id;
        this.topic = topic;
        this.content = content;
        this.expirationDate = expirationDate;
        this.image = image;
    }
}