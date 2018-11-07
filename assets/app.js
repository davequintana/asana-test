

// wait for the document to load and be ready to handle js
window.onload = function() {
  getHTML();
  console.log('before');
  (function() {
    init();
  })();
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
  console.log('setup listeners');
}