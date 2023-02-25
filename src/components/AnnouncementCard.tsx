import React from 'react';
import moment from "moment"
import Announcement from '../models/Announcement';
import "./AnnouncementCard.css"
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export interface IAnnouncementCardProps {
    announcement: Announcement
    handleShowEditModal: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, announcement: Announcement) => void
    handleShowDeleteModal: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, announcement: Announcement) => void
}

export default function AnnouncementCard({ announcement, handleShowEditModal, handleShowDeleteModal }: IAnnouncementCardProps) {

    const admin = useAppSelector(state => state.admin);
    const dispatch = useAppDispatch();

    return (
        <div className='announcement-card-container'>
            <div>
                <h1>{announcement.topic}</h1>
                <p>{announcement.content}</p>
                <p>Geçerlilik tarihi: {moment.utc(announcement.expirationDate).local().format('HH:mm:ss DD-MM-YYYY')}</p>
                <img width={"400px"} src={`${announcement.image}`}></img>
            </div>
            {
                admin.jwtToken ?
                    <div className='d-flex justify-content-center gap-3'>
                        <button onClick={(event) => handleShowEditModal(event, announcement)} type="button" className="btn btn-primary">Edit</button>
                        <button onClick={(event) => handleShowDeleteModal(event, announcement)} type="button" className="btn btn-danger">Delete</button>
                    </div>
                    : null
            }

        </div>
    );
}
