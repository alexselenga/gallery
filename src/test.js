import {Gallery} from "./gallery.js";

const photos = [
  {
    id: 1,
    src: 'img/1.jpg'
  },
  {
    id: 2,
    src: 'img/2.jpg'
  },
  {
    id: 3,
    src: 'img/3.jpg'
  },
  {
    id: 4,
    src: 'img/4.jpg'
  },
  {
    id: 5,
    src: 'img/5.jpg'
  },
  {
    id: 6,
    src: 'img/6.jpg'
  },
  {
    id: 7,
    src: 'img/7.jpg'
  },
  {
    id: 8,
    src: 'img/8.jpg'
  },
  {
    id: 9,
    src: 'img/9.jpg'
  },
];

document.body.addEventListener('galleryupdate', event => console.log(event.detail)); //Поддерживает события ()

const gallery = new Gallery({
  photos,
  container: document.querySelector('#gallery'),
  size: 5, //Кол-во видимых фотографий. Можно не указывать. Тогда ширину компонента можно отдельно указать. По умолчанию undefined;
  current: '2', //id текущей фотографии. По умолчанию 1.
  // itemSize: 160, //Размер фотографий. По умолчанию 100.
});

// gallery.remove(); //Удалить компонент
