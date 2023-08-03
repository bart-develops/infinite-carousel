const slider = document.querySelector('.slider')
const carousel = document.querySelector('.slider-window')

// carousel settings
const settings = document.querySelector('.settings')
const autoscroll = document.querySelector('#autoscroll')
let skipScroll = false;
const carouselIndicators = document.querySelector('#carousel-indicators')
const indicatorsContainer = document.querySelector('.carousel-indicators')
var slideIndex = 1;
var prevSlideIndex = 1;
var didTransitionFinish = true;

function getPresets() {

  autoscroll.checked = window.localStorage.getItem('autoscroll') === 'true' ? true : false
  carouselIndicators.checked = window.localStorage.getItem('carouselIndicators') === 'true' ? true : false
  carouselIndicators.checked && indicatorsContainer.setAttribute('data-active', '')
}
getPresets()

settings.addEventListener('change', ({ target }) => {
  switch (target.id.toString()) {
    case 'autoscroll':
      window.localStorage.setItem('autoscroll', autoscroll.checked)
      break;
    case 'carousel-indicators':
      window.localStorage.setItem('carouselIndicators', carouselIndicators.checked)
      indicatorsContainer.toggleAttribute('data-active')
      break;
  }
})


const slideCount = slider.childElementCount

const prev = document.querySelector('.prev')
const next = document.querySelector('.next')

var direction = -1;

const scrollNext = () => {
  if (!didTransitionFinish) return;
  if (slideIndex === slideCount)
    slideIndex = 1;
  else slideIndex++

  if (direction === 1) {
    slider.prepend(slider.lastElementChild);
    carousel.style.justifyContent = 'flex-start'
    direction = -1;
  }
  slider.style.transform = `translate(-${100 / slideCount}%)`
}
const scrollPrev = () => {
  if (!didTransitionFinish) return;
  if (slideIndex === 1)
    slideIndex = slideCount;
  else slideIndex--


  if (direction === -1) {
    slider.appendChild(slider.firstElementChild)
    direction = 1;
  }
  carousel.style.justifyContent = 'flex-end'
  slider.style.transform = `translate(${100 / slideCount}%)`
}

prev.addEventListener('click', () => {
  skipScroll = true
  scrollPrev()
})
next.addEventListener('click', () => {
  skipScroll = true
  scrollNext()

})

slider.addEventListener('transitionend', () => {
  if (direction === -1)
    slider.appendChild(slider.firstElementChild)
  else if (direction === 1)
    slider.prepend(slider.lastElementChild)

  slider.style.transition = 'none'
  slider.style.transform = 'translate(0)'
  setTimeout(() => {
    slider.style.transition = 'transform 0.3s'
    prevSlideIndex = slideIndex
    didTransitionFinish = true
  });

})

// autoscroll
const autoscrollTimer = setInterval(() => {
  if (skipScroll) {
    skipScroll = false
    return
  }

  if (autoscroll.checked) {
    scrollNext()
  } else {
    clearInterval(autoscrollTimer)
  }
}, 5000);

// carousel indicators
slider.addEventListener('transitionstart', () => {
  if (!didTransitionFinish)
    return;
  indicatorsContainer.children[prevSlideIndex - 1].classList.remove('current')
  indicatorsContainer.children[slideIndex - 1].classList.add('current')
  didTransitionFinish = false;
})