export function renderGallery(results) {

  return results.map((hit) =>
      `<a class="card__link" href="${hit.largeImageURL}"> 
  <div class='card__container'>
      <img class="card__img" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
      <div class="info">
       <p class="info-item"><b>Likes:</b>${hit.likes} </p>
       <p class="info-item"><b>Views:</b>${hit.views}</p>
       <p class="info-item"><b>Comments:</b>${hit.comments}</p>
       <p class="info-item"> <b>Downloads:</b>${hit.downloads}</p>
     </div>
  </div>
</a>`).join("");
  
   
  
};
 