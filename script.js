const apiKey = '563492ad6f91700001000001d99561518cc5451b8fec7d19e8dc6a0b';
const pageStart = getRandomInRange(1, 100);
const urlStart = `https://api.pexels.com/v1/curated?page=${pageStart}?per_page=12`;

let textRequest = '';
let urlUser;
let urlPrev = '';
let urlNext = '';
let request = false;

const stringInput = document.getElementById('search');
const btnSearchClear = document.querySelector('.search-clear');
const btnPrev = document.querySelector('.prev-page');
const btnNext = document.querySelector('.next-page');
const checkBox = document.getElementById('check-box');
const gallery = document.querySelector('.gallery-container');

stringInput.addEventListener('input', getText, false);
stringInput.addEventListener('change', getText, false);
stringInput.addEventListener('keydown', isEnter, false);
btnSearchClear.addEventListener('click', getSearhClear, false);
btnPrev.addEventListener('click', getPrevPage, false);
btnNext.addEventListener('click', getNextPage, false);
checkBox.addEventListener('click', containImg, false);

getData(urlStart);

async function getData(url) {
    const res = await fetch(url, {headers: {Authorization: `${apiKey}`}});
    const data = await res.json();
    const quantityImgAll = data.photos.length;
    const quantityImg = (quantityImgAll - 12 >= 0) ? 12 : quantityImgAll;

    if (quantityImg < 12) clearGallery(quantityImg);
    
    if (request && data.prev_page != undefined) {
        urlPrev = data.prev_page;
        btnPrev.classList.add('active');                
    } else btnPrev.classList.remove('active');
    
    if (request && data.next_page != undefined) {        
        urlNext = data.next_page;
        btnNext.classList.add('active');        
    } else btnNext.classList.remove('active');
        
    let curDiv,
        srcImg,
        altImg;    
    for (let i = 0; i < quantityImg; i++) {
        srcImg = data.photos[i].src.medium ?? '';        
        altImg = data.photos[i].alt;
        curDiv = document.getElementById(`${i}`);        
        curDiv.innerHTML = `<img class="image" src=${srcImg} alt=${altImg}>`
    }      
}

function clearGallery(index) {
    let curDiv;
    const addWord = (index >= 1) ? 'больше' : '';    
    for (let i = index; i < 12; i++) {        
        curDiv = document.getElementById(`${i}`);        
        curDiv.innerHTML = `<img class="image" src="" alt="_ На тему: '${textRequest}' - изображений ${addWord} нет!">`;
    }    
}

function getText () {    
    textRequest = stringInput.value;    
    if (textRequest === '' && btnSearchClear.classList.contains('clear-it')) {
        btnSearchClear.classList.remove('clear-it');
        btnSearchClear.classList.add('search-it');
        getClear ()        
    }
}

function getSearhClear () {
    switch(true) {
        case(btnSearchClear.classList.contains('search-it')) : getImage();
        break;
        case(btnSearchClear.classList.contains('clear-it')) : getClear();
        break;
    }

}

function getClear () {    
    stringInput.value = '';
    urlPrev = '';
    urlNext = '';
    textRequest = stringInput.value;
    btnPrev.classList.remove('active');
    btnNext.classList.remove('active');
    btnSearchClear.classList.remove('clear-it');
    btnSearchClear.classList.add('search-it');    
}

function getImage() {    
    if (textRequest !== '') {
        request = true;
        urlUser = `https://api.pexels.com/v1/search?query=${textRequest}&per_page=12`;
        btnSearchClear.classList.remove('search-it');
        btnSearchClear.classList.add('clear-it');
        getData(urlUser);
    } 
}

function isEnter (event) {
    if (event.keyCode === 13) {        
        getImage();
    }    
}

function getPrevPage () {    
    getData(urlPrev);
    urlPrev = '';    
}

function getNextPage () {    
    getData(urlNext);
    urlNext = '';  
}

function containImg () {    
    if (checkBox.checked) gallery.classList.add('containStyle');
    else gallery.classList.remove('containStyle');
}

function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 
