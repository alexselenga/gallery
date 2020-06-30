export class Gallery {
  //photos - массив из картинок {'id' => 1, 'src' => 'img/1.jpg', ...}.
  //size - количество видимых картинок. Если undefined, то по размеру самого компонента.
  //current - Id текущей картинки.
  //itemSize - размер картинки по высоте и ширине.
  constructor({ photos, container, size = undefined, current = 1, itemSize = 100 }) {
    this.photos = photos;
    this.currentId = current;
    this.containerDiv = container;

    container.innerHTML = `
      <div class="gallery" tabindex="0">
        <div class="gallery__ctrl-left">
          <div>&lt;</div>
        </div>
        <div class="gallery__items">
        </div>
        <div class="gallery__ctrl-right">
            <div>&gt;</div>
        </div>
      </div>
    `;

    const itemsDiv = container.querySelector('.gallery__items');
    //Можно использовать window.devicePixelRatio. Но ведь метатег viewport уже прописан в index.html.
    if (size !== undefined) itemsDiv.style.width = (itemSize + 4) * size + 'px';

    for (let photo of photos) {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('gallery__item');
      itemDiv.dataset.id = photo.id;
      const spinnerDiv = document.createElement('div');
      spinnerDiv.classList.add('gallery__spinner');
      const imgDiv = document.createElement('img');
      imgDiv.src = photo.src;
      imgDiv.style.width = itemSize + 'px';
      imgDiv.style.height = itemSize + 'px';
      imgDiv.onload = () => itemDiv.querySelector('.gallery__spinner').remove();
      itemDiv.append(spinnerDiv);
      itemDiv.append(imgDiv);
      itemsDiv.append(itemDiv);
    }

    const galleryDiv = container.querySelector('.gallery');
    galleryDiv.addEventListener('mousedown', this._onClickItem.bind(this));
    galleryDiv.addEventListener('keydown', this._onKeyDown.bind(this));
    galleryDiv.addEventListener('selectstart', event => event.preventDefault());
    galleryDiv.addEventListener('dragstart', event => event.preventDefault());
    this.updateComponent();
  }

  _timerId = undefined;

  updateComponent() { //Обновить компонент
    if (this._timerId) clearTimeout(this._timerId);
    const itemsDiv = this.containerDiv.querySelector('.gallery__items');
    const oldItemDiv = itemsDiv.querySelector('.gallery__item_selected');
    if (oldItemDiv) oldItemDiv.classList.remove('gallery__item_selected');
    const itemDiv = itemsDiv.querySelector(`.gallery__item[data-id="${this.currentId}"]`);
    itemDiv.classList.add('gallery__item_selected');

    const divLeft = this.containerDiv.querySelector('.gallery__ctrl-left');
    let oldScrollLeft = itemsDiv.scrollLeft;
    itemsDiv.scrollLeft = 0;
    const leftRect = divLeft.getBoundingClientRect();
    const itemsRect = itemsDiv.getBoundingClientRect();
    const itemRect = itemDiv.getBoundingClientRect();
    const newScrollLeft = itemRect.left - leftRect.left - leftRect.width - itemsRect.width / 2 + itemRect.width / 2;
    let counter = 12;
    const step = (newScrollLeft - oldScrollLeft) / counter;
    itemsDiv.scrollLeft = oldScrollLeft;

    this._timerId = setInterval(() => {
      itemsDiv.scrollLeft = oldScrollLeft += step;
      if (--counter) return;
      clearTimeout(this._timerId);
      this._timerId = undefined;
      itemsDiv.scrollLeft = newScrollLeft;
    },200 / counter); // 200/12 = 60fps

    const iPhoto = this._findPhotoIndex(this.currentId);

    const galleryUpdateEvent = new CustomEvent('galleryupdate', {
      bubbles: true,
      detail: this.photos[iPhoto]
    });

    setTimeout(() => itemsDiv.parentElement.dispatchEvent(galleryUpdateEvent));
  }

  remove() { //Удалить компонент
    if (this._timerId) clearTimeout(this._timerId);
    this.containerDiv.innerHTML = '';
    this.photos = undefined;
    this.containerDiv = undefined;
  }

  toLeftItem() { //Выбор левой картинки
    const _currentId = this._getLeftId();
    if (_currentId !== undefined) this.currentId = _currentId;
    this.updateComponent();
  }

  toRightItem() { //Выбор правой картинки
    const _currentId = this._getRightId();
    if (_currentId !== undefined) this.currentId = _currentId;
    this.updateComponent();
  }

  _onClickItem(event) {
    const itemDiv = event.target.closest('.gallery__item');
    if (itemDiv) this.currentId = +itemDiv.dataset.id;
    if (event.target.closest('.gallery__ctrl-left')) this.toLeftItem();
    if (event.target.closest('.gallery__ctrl-right')) this.toRightItem();
    this.updateComponent();
  }

  _onKeyDown(event) {
    if (event.key === "ArrowLeft") this.toLeftItem();
    if (event.key === "ArrowRight") this.toRightItem();
  }

  _getLeftId() {
    const curPhotoIndex = this._findPhotoIndex(this.currentId);
    return curPhotoIndex > 0 ? this.photos[curPhotoIndex - 1].id : undefined;
  }

  _getRightId() {
    const curPhotoIndex = this._findPhotoIndex(this.currentId);
    return curPhotoIndex < this.photos.length - 1 ? this.photos[curPhotoIndex + 1].id : undefined;
  }

  _findPhotoIndex(photoId) {
    return this.photos.findIndex(item => item.id == photoId);
  }
}
