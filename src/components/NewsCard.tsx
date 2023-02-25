import moment from 'moment';
import React from 'react';
import News from '../models/News';

export interface INewsCardProps {
    news: News
}

export default function NewsCard ({news}: INewsCardProps) {
  return (
    <div>
        <h2>{news.topic}</h2>
        <p>{news.content}</p>
        <p>Geçerlilik tarihi: {moment.utc(news.expirationDate).local().format('HH:mm:ss DD-MM-YYYY')}</p>
        <p>Link: {news.link}</p>
    </div>
  );
}
