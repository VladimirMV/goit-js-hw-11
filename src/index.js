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
 

 let infinityScrollIsON = false;
let currentPage = 1;
 let imagesLeft = 0;
 let totalCards = 0;

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
      console.log(data.hits);
      appendImagesMarkup(data.hits);
      simpleLightbox.refresh();
  
      loadMoreBtn.enable();
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

  function modeSelection() {
    if (modeSwitch.checked === true) {
      infinityScrollIsON = true;
  
      window.addEventListener('scroll', infinityScroll);
      Notiflix.Notify.info('Infinite scroll is ON', { position: 'left-bottom' });
    } else {
      infinityScrollIsON = false;
  
      window.removeEventListener('scroll', infinityScroll);
      Notiflix.Notify.info('Infinite scroll is OFF', { position: 'left-bottom' });
    }
    checkMode();
  }

  function checkMode() {
    if (infinityScrollIsON) {
      loadMoreBtn.style.display = 'none';
      document.querySelector('.load-more').style.color = '#094067';
      document.querySelector('.infinite-scroll').style.color = '#ef4565';
    } else {
      if (totalCards !== 0) loadMoreBtn.style.display = 'block';
      document.querySelector('.load-more').style.color = '#ef4565';
      document.querySelector('.infinite-scroll').style.color = '#094067';
    }
  }

  function infinityScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  
    if (totalCards == 0) return;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      loadMore();
    }
  }
 
  // Event Listeners (done indirectly because of need to modify some values before callbacks)
 searchIcon.addEventListener('click', newSearch);
 searchBar.addEventListener('change', newSearch);
 loadMoreBtn.addEventListener('click', loadMore);
 modeSwitch.addEventListener('change', modeSelection);
 scrollTop.addEventListener('click', () => {
   window.scrollTo(0, 0);
 });

 // Hide "Load More..." button on default
 loadMoreBtn.style.display = 'none';
 modeSwitch.checked = false;
 modeSelection();

