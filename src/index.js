import axios from 'axios';
import { Notify } from 'notiflix';
import templateFunction from './template.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import './css/styles.css';

const refs = {
  galleryEl: document.querySelector('.gallery'),
  formData: document.querySelector('#search-form'),
  input: document.querySelector('input'),
};
const simple = new SimpleLightbox('.gallery a');

let searchQuery = '';
let pages = 1;

refs.formData.addEventListener('submit', addNewSearch);

function addNewSearch(e) {
  e.preventDefault();
  searchQuery = refs.input.value;
  nullPage();
  paginationOfImg(searchQuery);
}

window.addEventListener('scroll', () => {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    paginationOfImg();
  }
});

async function paginationOfImg() {
  try {
    const response = await GetMorePhoto();
    return renderCard(response);
  } catch (error) {
    console.log(error.message);
  }
}

async function GetMorePhoto() {
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
        page: pages,
      },
    });
    Comment(res.data.totalHits);
    upPage();
    return res.data.hits;
  } catch (e) {
    return console.error(e);
  }
}

function Comment(value) {
  if (pages === 1 && value !== 0) {
    Notify.success(`Hooray! We found ${value} images.`);
  }
  if (value === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else if (value / 40 + 1 < pages) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

function renderCard(array) {
  refs.galleryEl.insertAdjacentHTML('beforeend', templateFunction(array));
  simple.refresh();
}

function upPage() {
  pages += 1;
}

function nullPage() {
  pages = 1;
  refs.galleryEl.innerHTML = '';
}
