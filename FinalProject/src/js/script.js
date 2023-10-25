const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');
const navCart = document.querySelector('.navCart');
const removeButton = document.querySelector('.remove-x');
const scrollElement = document.querySelector('.scroll');
const contentRow = document.querySelector('.content-row');
const pageX = 30;
let width = window.innerWidth;
let widthSize = 920;
 
const url = './src/data/db.json';
const responsiveDesign = () => {
    if (width < widthSize) {
        hamburger.classList.add('active');
        navbar.classList.add('active');
        navCart.classList.remove('activeCart');
    } else {
        hamburger.classList.add('activeCart');
        navCart.classList.add('activeCart');
        navbar.classList.remove('active');


    }
};

const removeNavbar = () => {
    removeButton.addEventListener('click', () => {
        if (width < widthSize) {
            hamburger.classList.remove('active');
            navbar.classList.remove('active');

        } else {
            hamburger.classList.remove('activeCa');
            navCart.classList.remove('activeCart');
        }
    })
}

hamburger.addEventListener('click', responsiveDesign);
const scrollAnimation = () => {
    const pageOffset = window.pageYOffset;

    if (pageOffset > pageX) {
        scrollElement.classList.add('active');
    } else {
        scrollElement.classList.remove('active');
    }
};

const scrollbar = () => {
    window.addEventListener('scroll', scrollAnimation);

    scrollElement.addEventListener('click', () => {
        window.scrollTo(0, 0);
    });
};

const navbarFetchImage = async () => {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data && data.image) {
        data.image.forEach(element => {
            contentRow.innerHTML += `
     <a href="${element.imageUrl}"  target="_blank" class="content-link">
     <img  class="content-img" src="${element.image}" alt="">
    </a>
     `
        });
    } else {
        console.log("No navbar fetch data found in the data.")
    }
}

document.addEventListener('DOMContentLoaded', () => {

    navbarFetchImage();
    removeNavbar();
    
    scrollbar();
})