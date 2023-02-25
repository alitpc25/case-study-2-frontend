export default class AnnouncementSchema {
    topic: string | undefined;
    content: string | undefined;
    expirationDate: Date | undefined;
    image: File | undefined;

    constructor(topic: string, content: string, expirationDate: Date, image: File) {
        this.topic = topic;
        this.content = content;
        this.expirationDate = expirationDate;
        this.image = image;
    }
}