import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import  {renderGallery}  from './js/render-gallery.js';
import NewsApiService from './js/api-servis.js';
import LoadMoreBtn from './js/load-more-btn';
import SimpleLightbox from 'simplelightbox'; 
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchFormEl: document.querySelector('.search-form'),
  imagesContainerEl: document.querySelector('.gallery'),
  inputEl: document.querySelector('.search-form__input'),
  buttonEl: document.querySelector('.search-form__btn'),
};


const modeSwitch = document.querySelector('.display-mode__input');
const cardActions = document.querySelector('.card-actions');
 const cardCount = document.querySelector('#card-count');
 const cardTotal = document.querySelector('#card-total');
 const scrollTop = document.querySelector('.scroll-top');

 modeSwitch.addEventListener('change', modeSelection);

 let infinityScrollIsON = false;

const newsApiService = new NewsApiService();
 
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  scrollZoomFactor: false,
});



refs.searchFormEl.addEventListener('submit', onSearch);
refs.inputEl.addEventListener('input', () => (refs.buttonEl.disabled = false));
loadMoreBtn.refs.button.addEventListener('click', fetchImages);

scrollTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});



function onSearch(e) {
    e.preventDefault();
    refs.buttonEl.disabled = true;
  
    newsApiService.searchQuery = e.currentTarget.elements.searchQuery.value;
  
    if (newsApiService.searchQuery === '') {
      Notify.failure('❌Enter text');
      return;
    }
  
    loadMoreBtn.show();
    newsApiService.resetPage();
    clearImagesContainer();
    fetchImages();
  }

  
function fetchImages() {
    loadMoreBtn.disable();
  
    newsApiService.fetchImages().then(({ data }) => {
      newsApiService.totalPage = Math.ceil(data.total / newsApiService.per_page);
      newsApiService.loadedNow += data.hits.length;
  
      if (newsApiService.page === 2) {
        Notify.success(`✅Hooray! We found ${data.total} images.`);
      }
  
      if (newsApiService.totalPage + 1 === newsApiService.page) {
        loadMoreBtn.hide();
      }
  
      if (data.hits.length === 0) {
        Notify.failure(
          '❌Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
  
      Notify.success(`✅Loaded ${newsApiService.loadedNow} images.`);
    
      appendImagesMarkup(data.hits);
      simpleLightbox.refresh();
      loadMoreBtn.enable();

      cardTotal.innerHTML = newsApiService.loadedNow*data.total;
      cardCount.innerHTML = newsApiService.loadedNow*(newsApiService.page-1);

    });
  }
  
  function appendImagesMarkup(images) {
   
    refs.imagesContainerEl.insertAdjacentHTML(
      'beforeend',
      renderGallery(images)
    );
  }
  
  function clearImagesContainer() {
    refs.imagesContainerEl.innerHTML = '';
  }



  // Mode Switcher Infinity
  function modeSelection() {
    if (modeSwitch.checked === true) {
      infinityScrollIsON = true;
  
      window.addEventListener('scroll', infinityScroll);
      Notify.success(`✅Infinite scroll is ON`);
    } else {
      infinityScrollIsON = false;
      window.removeEventListener('scroll', infinityScroll);
      Notify.failure('❌Infinite scroll is OFF' );
    }
     
  }

  function infinityScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
   
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      fetchImages();
    }
  }
  
