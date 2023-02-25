import moment from 'moment';
import React from 'react';
import News from '../models/News';
import "./NewsCard.css";
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export interface INewsCardProps {
    news: News
    handleShowEditModal: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, news: News) => void
    handleShowDeleteModal: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, news: News) => void
}

export default function NewsCard({ news, handleShowEditModal, handleShowDeleteModal }: INewsCardProps) {

    const admin = useAppSelector(state => state.admin);
    const dispatch = useAppDispatch();

    return (
        <div className='news-card-container'>
            <div>
                <h2>{news.topic}</h2>
                <p>{news.content}</p>
                <p>Geçerlilik tarihi: {moment.utc(news.expirationDate).local().format('HH:mm:ss DD-MM-YYYY')}</p>
                <p>Link: <a href={news.link} target="_blank">{news.link}</a></p>
            </div>
            {
                admin.jwtToken ?
                    <div className='d-flex justify-content-center gap-3'>
                        <button onClick={(event) => handleShowEditModal(event, news)} type="button" className="btn btn-primary">Edit</button>
                        <button onClick={(event) => handleShowDeleteModal(event, news)} type="button" className="btn btn-danger">Delete</button>
                    </div>
                    : null
            }
        </div>
    );
}
