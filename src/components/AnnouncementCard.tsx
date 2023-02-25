import React from 'react';
import moment from "moment"
import Announcement from '../models/Announcement';

export interface IAnnouncementCardProps {
    announcement: Announcement
}

export default function AnnouncementCard ({announcement}: IAnnouncementCardProps) {
  return (
    <div>
        <h2>{announcement.topic}</h2>
        <p>{announcement.content}</p>
        <p>Geçerlilik tarihi: {moment.utc(announcement.expirationDate).local().format('HH:mm:ss DD-MM-YYYY')}</p>
        <img width={"250px"} src={`${announcement.image}`}></img>
    </div>
  );
}
