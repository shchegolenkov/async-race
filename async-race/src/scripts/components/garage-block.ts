import createElement from '../utils/create-element';
import EventEmitter from '../utils/event-emitter';
import GarageItem from './garage-item';
import { Car } from '../types/types';

export default class GarageBlock extends EventEmitter {
  private header: HTMLHeadingElement;

  private page: HTMLParagraphElement;

  private garageItems: HTMLElement;

  constructor() {
    super();

    this.header = createElement('h2', 'Garage (0)');
    this.page = createElement('p', 'Page #1', 'garage-page-text');
    this.garageItems = createElement('div', '', 'garage-items');
  }

  public render(): HTMLElement {
    const garageBlock = createElement('div', '', 'garage-block');
    garageBlock.append(this.header, this.page, this.garageItems);

    return garageBlock;
  }

  public renderCars(cars: Car[]): void {
    this.garageItems.innerHTML = '';
    cars.forEach(async (car: Car) => {
      const garageItem = new GarageItem(car);
      this.garageItems.appendChild(garageItem.render());
    });
  }

  public updateCounters(carsCount: number): void {
    this.header.textContent = `Garage (${carsCount})`;
  }

  public updatePageCounter(page: number): void {
    this.page.textContent = `Page #${page}`;
  }

  public raceCars(cars: Car[]): void {
    cars.forEach(async (car: Car) => {
      this.emit('start-car', car.id.toString());
    });
  }

  public showWinner(name: string, time: string): void {
    const winBlock = createElement('div', '', 'win-message-block');
    const winMessage = createElement(
      'span',
      `${name} won at ${(+time / 1000).toFixed(2)} seconds!`,
      'win-message-text'
    );
    winBlock.appendChild(winMessage);
    this.garageItems.appendChild(winBlock);
    setTimeout(() => {
      this.garageItems.removeChild(winBlock);
      this.emit('race-finished');
    }, 4100);
  }
}
