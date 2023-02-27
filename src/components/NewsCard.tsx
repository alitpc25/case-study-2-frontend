import moment from 'moment';
import React, { useState } from 'react';
import News from '../models/News';
import "./NewsCard.css";
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export interface INewsCardProps {
    news: News
    handleShowEditModal: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, news: News) => void
    handleShowDeleteModal: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, news: News) => void
    handleShowDetailsModal: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, news: News) => void
    showContentDetail: boolean
}

export default function NewsCard({ news, handleShowEditModal, handleShowDeleteModal, handleShowDetailsModal, showContentDetail }: INewsCardProps) {

    const admin = useAppSelector(state => state.admin);
    const dispatch = useAppDispatch();

    const handleShowMore = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        handleShowDetailsModal(event, news)
    }

    return (
        <div className='news-card-container'>
            <div>
                <h2>{news.topic}</h2>
                {
                    showContentDetail ?
                    <p>{news.content}</p>
                    :
                    <p>{news.content?.substring(0, 200)}... <a onClick={handleShowMore}><span>Show More</span></a></p>
                }
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
