import { refs } from './refs';

const createMarkup = data =>
  data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
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
            
          </div>`;
      }
    )
    .join('');

function addMarkup(data) {
  refs.galleryEl.insertAdjacentHTML('beforeend', createMarkup(data));
}

export { addMarkup };
