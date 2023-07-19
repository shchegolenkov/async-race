import createCarImage from '../utils/create-car-image';
import createElement from '../utils/create-element';
import EventEmitter from '../utils/event-emitter';
import { Car } from '../types/types';

export default class GarageItem extends EventEmitter {
  private car: Car;

  private selectButton: HTMLButtonElement;

  private removeButton: HTMLButtonElement;

  private name: HTMLSpanElement;

  private startButton: HTMLButtonElement;

  private stopButton: HTMLButtonElement;

  private carImg: string;

  constructor(car: Car) {
    super();
    this.car = car;

    this.selectButton = createElement('button', 'Select', 'button-car', 'button-car--manage');
    this.removeButton = createElement('button', 'Remove', 'button-car', 'button-car--manage');
    this.name = createElement('span', `${car.name}`, 'car-name');

    this.startButton = createElement('button', 'Start', 'button-car', 'button-car--control');
    this.stopButton = createElement('button', 'Stop', 'button-car', 'button-car--control');

    this.carImg = createCarImage(car.color);
  }

  public render(): HTMLElement {
    const garageItem = createElement('div', '', 'garage-item');
    const carTopBlock = createElement('div', '', 'car-top-block');
    carTopBlock.append(this.selectButton, this.removeButton, this.name);

    const roadBlock = createElement('div', '', 'road');
    const carControlBlock = createElement('div', '', 'car-control-block');
    this.stopButton.disabled = true;
    carControlBlock.append(this.startButton, this.stopButton);
    const finishlineElement = `<svg xmlns="http://www.w3.org/2000/svg" class="finish-line" viewBox="0 0 15 50" width="20" height="50">
              <path d="M0 0h5v5H0z" />
              <path fill="#ededed" d="M5 0h5v5H5zM0 5h5v5H0z" />
              <path d="M5 5h5v5H5zM0 10h5v5H0z" />
              <path fill="#ededed" d="M5 10h5v5H5zM0 15h5v5H0z" />
              <path d="M5 15h5v5H5zM0 20h5v5H0z" />
              <path fill="#ededed" d="M5 20h5v5H5zM0 25h5v5H0z" />
              <path d="M5 25h5v5H5zM0 30h5v5H0z" />
              <path fill="#ededed" d="M5 30h5v5H5zM0 35h5v5H0z" />
              <path d="M5 35h5v5H5zM0 40h5v5H0z" />
              <path fill="#ededed" d="M5 40h5v5H5zM0 45h5v5H0z" />
              <path d="M5 45h5v5H5z" />
            </svg>`;
    roadBlock.append(carControlBlock);
    roadBlock.insertAdjacentHTML('beforeend', this.carImg);
    roadBlock.insertAdjacentHTML('beforeend', finishlineElement);

    garageItem.append(carTopBlock, roadBlock);

    this.addListeners();

    return garageItem;
  }

  private addListeners(): void {
    this.removeButton.addEventListener('click', () => {
      this.emit('delete-car', this.car.id.toString());
    });

    this.selectButton.addEventListener('click', () => {
      this.emit('select-car', this.car.id.toString(), this.car.name.toString(), this.car.color.toString());
    });
  }
}
