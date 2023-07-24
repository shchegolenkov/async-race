import createCarImage from '../utils/create-car-image';
import createElement from '../utils/create-element';
import EventEmitter from '../utils/event-emitter';
import EngineApi from '../api/engine-api';
import { Car } from '../types/types';

export default class GarageItem extends EventEmitter {
  private car: Car;

  private selectButton: HTMLButtonElement;

  private removeButton: HTMLButtonElement;

  private name: HTMLSpanElement;

  private startButton: HTMLButtonElement;

  private stopButton: HTMLButtonElement;

  private roadBlock: HTMLElement;

  private carBlock: HTMLElement;

  private carImg: string;

  private animationFrameId: number;

  private time: number;

  private isSingleRaceActive: boolean;

  constructor(car: Car) {
    super();
    this.car = car;

    this.selectButton = createElement('button', 'Select', 'button-car', 'button-car--manage');
    this.removeButton = createElement('button', 'Remove', 'button-car', 'button-car--manage');
    this.name = createElement('span', `${car.name}`, 'car-name');

    this.startButton = createElement('button', 'Start', 'button-car', 'button-car--control');
    this.stopButton = createElement('button', 'Stop', 'button-car', 'button-car--control');

    this.roadBlock = createElement('div', '', 'road');
    this.carBlock = createElement('div', '', 'car-block');
    this.carImg = createCarImage(car.color);

    this.time = 0;
    this.animationFrameId = 0;
    this.isSingleRaceActive = false;
  }

  public render(): HTMLElement {
    const garageItem = createElement('div', '', 'garage-item');
    const carTopBlock = createElement('div', '', 'car-top-block');
    carTopBlock.append(this.selectButton, this.removeButton, this.name);

    this.carBlock.insertAdjacentHTML('afterbegin', this.carImg);

    const carControlBlock = createElement('div', '', 'car-control-block');
    this.stopButton.disabled = true;
    carControlBlock.append(this.startButton, this.stopButton);
    const finishlineElement = `<svg xmlns="http://www.w3.org/2000/svg" class="finish-line" viewBox="0 0 10 50" width="10" height="50">
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
    this.roadBlock.append(carControlBlock, this.carBlock);
    this.roadBlock.insertAdjacentHTML('beforeend', finishlineElement);

    garageItem.append(carTopBlock, this.roadBlock);

    this.addEventListeners();

    return garageItem;
  }

  private addEventListeners(): void {
    this.removeButton.addEventListener('click', () => {
      this.emit('delete-car', this.car.id.toString());
    });

    this.selectButton.addEventListener('click', () => {
      this.emit('select-car', this.car.id.toString(), this.car.name.toString(), this.car.color.toString());
    });

    this.startButton.addEventListener('click', () => {
      this.isSingleRaceActive = true;
      this.startCar();
      this.emit('single-race-start', this.car.id.toString());
    });

    this.stopButton.addEventListener('click', () => {
      this.stopCar();
      this.emit('single-race-stop', this.car.id.toString());
    });
  }

  private animateForward(time: number): void {
    const width = this.roadBlock.getBoundingClientRect().right - this.carBlock.getBoundingClientRect().right - 8;
    const timing = (timeFraction: number): number => timeFraction;
    this.time = time;

    const start = performance.now();
    const draw = (progress: number): void => {
      this.carBlock.style.transform = `translateX(${progress * width}px)`;
    };

    const animate = (duration: number): void => {
      let timeFraction = (duration - start) / time;
      if (timeFraction > 1) timeFraction = 1;
      const progress = timing(timeFraction);
      draw(progress);
      if (timeFraction < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      }
      if (timeFraction === 1) {
        this.emit('car-finished', this.car.id.toString(), this.car.name, (time / 1000).toFixed(2).toString());
      }
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }

  private stopAnimation(): void {
    cancelAnimationFrame(this.animationFrameId);
  }

  public async startCar(): Promise<void> {
    this.startButton.disabled = true;
    this.selectButton.disabled = true;
    this.removeButton.disabled = true;
    const response = await EngineApi.startStopEngine(this.car.id, 'started');
    if (response) {
      if (this.isSingleRaceActive) {
        this.stopButton.disabled = false;
        this.emit('single-race-started', this.car.id.toString());
      }
      const time = response.distance / response.velocity;
      this.animateForward(time);
      const driveMode: boolean = await EngineApi.switchDrive(this.car.id);
      if (!driveMode) this.stopAnimation();
    }
  }

  public async stopCar(): Promise<void> {
    const response = await EngineApi.startStopEngine(this.car.id, 'stopped');
    if (response) {
      this.stopAnimation();
      this.carBlock.style.transform = `translateX(0px)`;
      if (this.isSingleRaceActive) {
        this.emit('single-race-stopped', this.car.id.toString());
        this.isSingleRaceActive = false;
        this.disableCarRaceButtons(false);
      }
    }
  }

  public disableCarEditButtons(state: boolean): void {
    this.selectButton.disabled = state;
    this.removeButton.disabled = state;
  }

  public disableCarRaceButtons(state: boolean): void {
    this.startButton.disabled = state;
    this.stopButton.disabled = !state;
  }
}
