import fetchCards from './js/fetch';
import { addMarkup } from './js/markup';
import { refs } from './js/refs';
import { message } from './js/message';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

let pageNumber = 1;
let searchName;

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

lightbox.refresh();

refs.searchFormEl.addEventListener('submit', onSearchRequest);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearchRequest(e) {
  e.preventDefault();
  pageNumber = 1;
  refs.galleryEl.innerHTML = '';
  searchName = e.target.searchQuery.value.trim();

  const resultRequest = await fetchCards(searchName, pageNumber);
  const tHits = resultRequest.totalHits;

  if (resultRequest.hits.length === 0) {
    refs.loadMoreBtn.classList.add('is-hidden');
    message.failure();
  } else {
    addMarkup(resultRequest.hits);
    lightbox.refresh();
    message.success(tHits);

    let countPage = Math.ceil(tHits / 40);

    if (tHits < 40 || pageNumber === countPage) {
      refs.loadMoreBtn.classList.add('is-hidden');
      setTimeout(() => {
        message.info();
      }, 3500);
    } else {
      lightbox.refresh();
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
  }
  refs.searchFormEl.reset();
}

async function onLoadMore() {
  pageNumber += 1;
  const getResultRequest = await fetchCards(searchName, pageNumber);
  const moreHits = getResultRequest.totalHits;
  addMarkup(getResultRequest.hits);
  //console.log(moreHits);
  lightbox.refresh();
  smoothScroll();

  if (moreHits <= refs.galleryEl.children.length) {
    refs.loadMoreBtn.classList.add('is-hidden');
    setTimeout(() => {
      message.info();
    }, 3500);
  }
}
