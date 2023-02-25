import React, { useEffect, useState } from 'react';
import News from '../models/News';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import axios from "axios"
import { updateAdminInfo } from '../redux/adminSlice';
import NewsCard from '../components/NewsCard';

export interface INewsPageProps {
}

export default function NewsPage(props: INewsPageProps) {

    const admin = useAppSelector(state => state.admin);
    const dispatch = useAppDispatch();

    const [newsList, setNewsList] = useState<News[]>()

    const getAllNews = () => {
        axios.get(`/api/v1/news`)
        .then((res) => {
            setNewsList(res.data)
        }).catch((e) => {
            console.log(e);
            if (e.response.status == 403) {
                dispatch(updateAdminInfo({
                    jwtToken: null,
                }))
            }
        })
    }

    useEffect(() => {
        getAllNews();
    }, [])

    return (
        <div className='text-3xl font-bold underline'>
            {
                newsList?.map(news => {
                    return <NewsCard news={news}></NewsCard>
                })
            }
        </div>
    );
}
