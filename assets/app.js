

// wait for the document to load and be ready to handle js
window.onload = function() {
  getHTML();
  setTimeout(function() {
    init();
  }, 400);
};

// Using xmlhttprequest to pull in the html snippet
// would rather build a react app/component but this is 
// almost the same thing that react is doing.
function getHTML() {
  let tag, file;
  // get all tags and see if the element has my custom att
  // of x-include-html and then load in the response to innerHTML
  tag = document.getElementsByTagName('*');

  for (let i = 0; i < tag.length; i++) {
    let item = tag[i];
    file = item.getAttribute('x-include-html');
    if (file) runRequest(item, file);
  }
}

function runRequest(item, file) {
  let  req = new XMLHttpRequest(file);
  req.onreadystatechange = processHTML;
  req.open('GET', file, true);
  req.send();

  function processHTML() {
    if (this.readyState == 4) {
      if (this.status == 200) { item.innerHTML = this.responseText; }
      if (this.status == 404) { item.innerHTML = 'Page not found.'; }
      item.removeAttribute('x-include-html');
    }
  }

}

function init() {
  let dogData = '/assets/data/dogs.json';
  let loadMore = document.getElementById('loadMore');
  let thumbs = document.getElementById('thumbs');
  let closeMe = document.getElementById('closeMe');
  let loader = document.getElementById('loader');

  loadMore.addEventListener('click', loadMoreDogs);
  thumbs.addEventListener('click', launchViewer);
  closeMe.addEventListener('click', closeViewer);
  
  loadMore.style.display = 'none';
  loader.style.display = 'block';

  // using setTimeout to simulate latency
  setTimeout(function() {
    getData(dogData);
    loader.style.display = 'none';
    loadMore.style.display = 'block';
  }, 1000);
  
}

function getData(src) {
  let req = new XMLHttpRequest(src);
  req.responseType = 'json';
  req.onreadystatechange = processResponse;
  req.open('GET', src, true);
  req.send();
}

function processResponse() {
  if (this.readyState == 4) {
    if (this.status == 200) {
      populateData(this.response);
    }
  }
}

function populateData(data) {
  let _data = data.dogs;
  let thumbs = document.getElementById('thumbs');

  _data.forEach((item, idx) => {
    let li = document.createElement('li');
    let a = document.createElement('a');
    let img = document.createElement('img');

    a.href = `/assets/images/raw/${idx+1}.jpeg`;
    img.src = item.image;

    li.appendChild(a).appendChild(img);
    thumbs.appendChild(li);
  });
}

function loadMoreDogs() {
  let src = '/assets/data/dogs.json';
  let loader = document.getElementById('loader');
  let loadMore = document.getElementById('loadMore');

  loadMore.style.display = 'none';
  loader.style.display = 'block';
  // using setTimeout to simulate latency
  setTimeout(function() {
    getData(src);
    loader.style.display = 'none';
    loadMore.style.display = 'block';
  }, 1000);
}

function launchViewer(event) {
  let thumbnail = event.target.closest('a');
  if (!thumbnail) return;

  showLargeImage(thumbnail.href, thumbnail.title);
  showThumbnail(thumbnail.href, thumbnail.title);

  event.preventDefault();
}

function showLargeImage() {
  document.body.classList.add('overlay');
}

function showThumbnail(href, title) {
  let largeImg = document.getElementById('largeImg');
  largeImg.src = href;
  largeImg.alt = title;
}

function closeViewer(event) {
  let button = event.target.closest('i');
  if (!button) return;

  document.body.classList.remove('overlay');
  event.preventDefault();
}