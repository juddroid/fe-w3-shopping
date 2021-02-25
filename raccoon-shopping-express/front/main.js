const url = {
  mileageList: 'http://localhost:3000/api/mileageList',
  mallEventList: 'http://localhost:3000/api/mallEventList',
  hotDealList: 'http://localhost:3000/api/hotDealList',
  shoppingPartner: 'http://localhost:3000/api/shoppingPartner',
};

const REQUEST_SUCESS = 'Request successful';
const REQUEST_FAILED = 'Request failed';

const $mileageEventSlide = document.querySelector('.event--slide');
const $mileageSlidePage = document.querySelector('#mileageSlidePage');
const $prevEventButton = document.querySelector('.slide--button--prev');
const $nextEventButton = document.querySelector('.slide--button--next');

const $mallEventList = document.querySelector('#mallEventList');
const $topMileageSlide = document.querySelector('#topMileageSlide');
const $mallEventSlide = document.querySelector('#mallEventSlide');

class FetchAPI {
  init() {
    this.mileageList();
    this.mallEventList();
    this.hotDealList();
  }
  mileageList = () =>
    fetch(url.mileageList)
      .then((response) => response.json())
      .then((data) => {
        setMileageEventContents(data);
        return data;
      })
      .then((status) => console.log(REQUEST_SUCESS, status.code))
      .catch((error) => console.log(REQUEST_FAILED, error));

  mallEventList = () =>
    fetch(url.mallEventList)
      .then((response) => response.json())
      .then((data) => {
        // getMallEventContentLists(data);
        return data;
      })
      .then((status) => console.log(REQUEST_SUCESS, status.code))
      .catch((error) => console.log(REQUEST_FAILED, error));

  hotDealList = () =>
    fetch(url.hotDealList)
      .then((response) => response.json())
      .then((data) => {
        getHotDealLists(data.hotdealList);
        return data;
      })
      .then((status) => console.log(REQUEST_SUCESS, status.code))
      .catch((error) => console.log(REQUEST_FAILED, error));
}

const fetchAPI = new FetchAPI();
fetchAPI.init();

class EventSlider {
  constructor(target) {
    this.target = target;
  }
  init() {
    if (this.target) this.addEvent();
  }
  addEvent() {
    // 여기에서 this: EventSlider 객체
    // this.target: $mileageSlider

    this.target.addEventListener('mouseover', this.overEventSlider.bind(this));
    this.target.addEventListener('mouseout', this.outEventSlider.bind(this));
    this.target.addEventListener('click', this.clickEventSlider.bind(this));
  }
  overEventSlider(e) {
    if (e.target.classList.contains('adela') || e.target.getAttribute('data-index')) {
      this.pageHover(e);
    }
    $prevEventButton.querySelector('.ico--prev').classList.replace('ico--prev', 'ico--prev__slide--hover');
    $nextEventButton.querySelector('.ico--next').classList.replace('ico--next', 'ico--next__slide--hover');
  }

  outEventSlider() {
    $prevEventButton.querySelector('.ico--prev__slide--hover').classList.replace('ico--prev__slide--hover', 'ico--prev');
    $nextEventButton.querySelector('.ico--next__slide--hover').classList.replace('ico--next__slide--hover', 'ico--next');
  }

  clickPrev() {
    $topMileageSlide.classList.replace('slide', 'slide--click--prev');
    setTimeout(() => {
      $topMileageSlide.insertBefore($topMileageSlide.lastElementChild, $topMileageSlide.firstElementChild);
      $topMileageSlide.classList.replace('slide--click--prev', 'slide');
      this.pagePrev();
    }, 300);
  }
  clickNext() {
    $topMileageSlide.classList.replace('slide', 'slide--click--next');
    setTimeout(() => {
      $topMileageSlide.insertBefore($topMileageSlide.firstElementChild, null);
      $topMileageSlide.classList.replace('slide--click--next', 'slide');
      this.pageNext();
    }, 300);
  }

  clickEventSlider(e) {
    const isClickPrev = () => e.target.classList.contains('slide--button--prev') || e.target.classList.contains('ico--prev__slide--hover');
    const isClickNext = () => e.target.classList.contains('slide--button--next') || e.target.classList.contains('ico--next__slide--hover');

    if (isClickPrev()) {
      this.clickPrev();
    }
    if (isClickNext()) {
      this.clickNext();
    }
  }

  pagePrev() {
    $mileageSlidePage.insertBefore($mileageSlidePage.firstElementChild, null);
  }

  pageNext() {
    $mileageSlidePage.insertBefore($mileageSlidePage.lastElementChild, $mileageSlidePage.firstElementChild);
  }

  pageHoverPrev() {
    $topMileageSlide.insertBefore($topMileageSlide.lastElementChild, $topMileageSlide.firstElementChild);
    this.pagePrev();
  }

  pageHoverNext() {
    $topMileageSlide.insertBefore($topMileageSlide.firstElementChild, null);
    this.pageNext();
  }

  pageHover(e) {
    if (e.target.classList.contains('first')) return;
    if (e.target.getAttribute('data-index') === '1') {
      this.pageHoverNext();
    }
    if (e.target.getAttribute('data-index') === '2') {
      this.pageHoverPrev();
    }
  }
}

const eventSliderListener = new EventSlider($mileageEventSlide);
eventSliderListener.init();

// slide 내부 동적으로 그려보기

function setMileageEventContents(contents) {
  $topMileageSlide.insertAdjacentHTML('afterbegin', getMileageEventContents(contents));
}

function getMileageEventContents(jsonData) {
  const imgurlArr = jsonData.mileageList.map((el) => el.imgurl);
  const linkurlArr = jsonData.mileageList.map((el) => el.linkurl);

  let panelDiv = ``;
  for (let i = 0; i < imgurlArr.length; i++) {
    panelDiv += `
    <div class="panel">
    <a href="${linkurlArr[i]}" class="link--event"
      ><img src="${imgurlArr[i]}" width="485" height="340" class="img_g" alt=""
    /></a>
    </div>`;
  }

  return panelDiv;
}

function getMallEventContents(jsonData) {
  return `
<div class="panel" aria-hidden="true">
<ul class="list--item">
</ul>
</div>
`;
}

function getMallEventContentLists(jsonData) {
  console.log(jsonData.mallEventList[0]);
  // foreach / reduce
  const imgurl = jsonData.mallEventList.map((el) => el.imgurl);
  const linkurl = jsonData.mallEventList.map((el) => el.linkurl);
  const text1 = jsonData.mallEventList.map((el) => el.text1);
  const text2 = jsonData.mallEventList.map((el) => el.text2);

  let lists = ``;
  for (let i = 0; i < imgurl.list; i++) {}
  return `
  <li class="goods">
  <a href="" class="link--product"
    ><span class="info--thumb"
      ><img
        src="//shop1.daumcdn.net/thumb/S318x318/?fname=http%3A%2F%2Fshop1.daumcdn.net%2Fshophow%2Fp%2FF11929626306.jpg%3Fut%3D20210114041340&amp;scode=talkgift"
        width="200"
        height="200"
        class="imgage--top"
        alt="안전을 생각한다면, 창문 잠금장치" /></span
    ><strong class="info--title">안전을 생각한다면, 창문 잠금장치</strong><span class="info--txt">침입은 물론 낙하사고 예방해요</span
    ><span class="ico--background2 ico--theme">테마</span></a
  >
</li>
  `;
}

class HotDealSection {
  draw() {}
  getHotDealLists() {}
}

const $hotDealWrapper = document.querySelector('#hot-deal__wrapper');

function getHotDealLists(data) {
  return getHotDealTitle(data);
}

function getHotDealTitle(data) {
  return $hotDealWrapper.querySelector('.section--hot-deal').insertAdjacentHTML(
    'afterbegin',
    `
    <div class="title__hot-deal"><h3 class="title--txt">품절주의! 역대급 핫딜</h3></div>
      ${getHotDealContents(data)}
    </div>
`
  );
}

function getHotDealContents(data) {
  return `
  <div class="contents--item">
    <ul class="list--item _GL">
    ${getHotDealItems(data)}
    </ul>
  </div>
  `;
}

function getHotDealItems(data) {
  let items = data.reduce((lists, list) => {
    let percent = '%';
    if (list.discount === undefined) {
      list.discount = '';
      percent = '';
    }
    if (list.maxPrice === undefined) {
      list.maxPrice = '';
    }

    const { contentseq, linkUrl, imageUrl, title, minPrice, discount, maxPrice } = list;

    lists += `
    <li class=${contentseq}>
      <a href=${linkUrl} class="link--product _GC_">
        <span class="hot-deal--thumb">
          <img src=${imageUrl} class="image-group" alt="">
        </span>
        <span class="screen-out">제품명</span>
          <strong class="info--title">${title}</strong>
        <span class="detail--price">
          <span class="info--discount">
            <span class="screen-out">할인가</span>
            <span class="txt--discount">${minPrice}<span class="txt--unit">원</span></span>
            <span class="screen-out">할인율</span>
            <span class="txt--percent">${discount}<span class="txt--unit">${percent}</span>
          </span>
        </span>
        <span class="screen-out">정가</span>
        <span class="txt--price">${maxPrice}<span class="screen-out">원</span></span></span>
      </a>
    </li>`;
    return lists;
  }, '');
  return items;
}
