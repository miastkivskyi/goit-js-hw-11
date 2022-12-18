import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayApiService from './js/fetch.js';
import { message } from './js/message.js';
import { refs } from './js/refs';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const newPixabayApiService = new PixabayApiService();
console.log(newPixabayApiService);

refs.form.addEventListener('submit', onSubmitForm);
refs.button.addEventListener('click', onloadMore);
refs.button.classList.add('is-hidden');

function onSubmitForm(ev) {
  ev.preventDefault();
  refs.button.classList.add('is-hidden');
  clearGallery();
  const query = ev.currentTarget.elements.searchQuery.value;
  newPixabayApiService.query = query;
  newPixabayApiService.resetPage();

  if (query === '') {
    refs.container.innerHTML = '';
    refs.button.classList.add('is-hidden');
    return;
  }

  newPixabayApiService
    .fetchCards()
    .then(images => {
      const tHits = images.totalHits;
      console.log(tHits);
      if (tHits === 0) {
        message.failure();
        refs.button.classList.add('is-hidden');
      } else {
        addMarkup(images);
        message.success(tHits);
        lightbox.refresh();
        if (tHits < 40) {
          refs.button.classList.add('is-hidden');
          setTimeout(() => {
            message.info();
          }, 2500);
        } else {
          lightbox.refresh();
          refs.button.classList.remove('is-hidden');
        }
      }
      refs.button.setAttribute('disabled', true);
    })
    .catch(error => message.failure())
    .finally(() => {
      refs.form.reset();
      refs.button.removeAttribute('disabled');
    });
}

async function onloadMore() {
  try {
    const data = await newPixabayApiService.fetchCards();
    const moreHits = data.totalHits;
    console.log(moreHits);
    addMarkup(data);
    lightbox.refresh();
    smoothScroll();

    if (moreHits <= refs.container.children.length) {
      refs.button.classList.add('is-hidden');
      setTimeout(() => {
        message.info();
      }, 3500);
    }
  } catch (error) {
    refs.button.classList.add('is-hidden');
    message.info();
  }
}

function clearGallery() {
  refs.container.innerHTML = '';
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function createMarkup(images) {
  const cards = images.hits;
  const markup = cards
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
            <a class="gallery__link" href="${largeImageURL}"> 
              <img class="gallery__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>
              <div class="data">
                <p class="data-item">
                  <b class ="data-info">Likes</b>${likes}
                </p>
                <p class="data-item">
                  <b class ="data-info">Views</b>${views}
                </p>
                <p class="data-item">
                  <b class ="data-info">Comments</b>${comments}
                </p>
                <p class="data-item">
                  <b class ="data-info">Downloads</b>${downloads}
                </p>
              </div>
            
          </div>`
    )
    .join('');
  return markup;
}

function addMarkup(images) {
  refs.container.insertAdjacentHTML('beforeend', createMarkup(images));
}
