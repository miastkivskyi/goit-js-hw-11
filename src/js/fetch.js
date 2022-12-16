import { Notify } from 'notiflix/build/notiflix-notify-aio';
// const axios = require('axios').default;
import axios from 'axios'


const BASE_URL = 'https://pixabay.com/api';
const API_KEY = "31091511-86aaddbe12333e38c55dc8e63";

export default async function fetchCards(name, pageNumber){
    try{
    const response = await axios.get(`${BASE_URL}/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=40`)
    return response.data;
  } catch(error){
    Notify.failure('error')
  }
}

