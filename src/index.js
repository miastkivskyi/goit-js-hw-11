import axios from 'axios';
import templateFunction from './template.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';

const refs = {
  galleryEl: document.querySelector('.gallery'),
  formData: document.querySelector('#search-form'),
  input: document.querySelector('input'),
};
let searchQuery = '';

refs.formData.addEventListener('submit', addNewSearch);

function addNewSearch(e) {
  e.preventDefault();
  searchQuery = refs.input.value;
  console.log(searchQuery);

  findSimilarPhotos(searchQuery).then(renderCard);
}

async function findSimilarPhotos() {
  try {
    const res = await axios({
      url: 'https://pixabay.com/api/',
      params: {
        key: '31896058-85566f2bc64dcb55d4cd975a7',
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
      },
    });
    return res.data.hits;
  } catch (e) {
    return console.error(e);
  }
}

function renderCard(array) {
  refs.galleryEl.insertAdjacentHTML('beforeend', templateFunction(array));
}
