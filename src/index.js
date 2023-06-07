import ImagesAPIsevice from './image-API-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import LoadMoreBtn from './load-more-btn';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let allHits = '';

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  spinner: document.querySelector('.spinner-border'),
};
let imagesNumber = 0;
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load"]',
  hidden: true,
});

const picturesApiService = new ImagesAPIsevice();

refs.galleryContainer.addEventListener('click', onGalleryLinkClick);
refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onGalleryLinkClick(e) {
  if (e.target.classList.contains('gallery__link')) {
    e.preventDefault();
    lightbox.open();
  }
}

function onSearch(e) {
  e.preventDefault();

  const searchQuery = e.currentTarget.elements.searchQuery.value;

  if (searchQuery === '') {
    return Notify.failure('Sorry, the Search Field can not be empty');
  }

  loadMoreBtn.show();
  loadMoreBtn.disable();

  picturesApiService.resetPage();
  picturesApiService.query = searchQuery;

  picturesApiService.fetchImages().then(response => {
    console.log(response);
    const imageList = response.data.hits;

    if (imageList.length === 0) {
      console.log(imagesNumber);
      loadMoreBtn.hide();
      clearContainer();
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    allHits = response.data.totalHits;

    Notify.success(`Hooray! We found ${allHits} images.`);

    clearContainer();

    imageList.forEach(image => {
      appendImageMarkup(image);
      loadMoreBtn.enable();
    });
    imagesNumber += imageList.length;
    console.log(imagesNumber);

    smoothImageLoader();
  });
}

function onLoadMore() {
  loadMoreBtn.disable();
  picturesApiService.fetchImages().then(response => {
    const imageList = response.data.hits;
    imagesNumber += imageList.length;
    console.log(imagesNumber);
    if (imagesNumber >= allHits) {
      loadMoreBtn.hide();
    }
    imageList.forEach(image => {
      appendImageMarkup(image);
      loadMoreBtn.enable();
    });

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
}

function clearContainer() {
  refs.galleryContainer.innerHTML = '';
}

function appendImageMarkup({
  largeImageURL,
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  let markup = '';
  markup = `
<a class = "gallery__link" href="${largeImageURL}">
<div class="photo-card">
  <img src="${webformatURL}"  alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>
</a>
`;
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function smoothImageLoader() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
