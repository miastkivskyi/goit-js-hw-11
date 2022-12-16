import { Notify } from 'notiflix';

export const message = {
  success(params) {
    Notify.success(`Hooray! We found ${params} images.`);
  },
  failure() {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  },
  info() {
    Notify.info("We're sorry, but you've reached the end of search results.");
  },
};
