import createElement from '../utils/create-element';
import EventEmitter from '../utils/event-emitter';
import GarageItem from './garage-item';
import { Car } from '../types/types';

export default class GarageBlock extends EventEmitter {
  private header: HTMLHeadingElement;

  private page: HTMLParagraphElement;

  private garageItems: HTMLElement;

  public garageItemsOnPage: GarageItem[];

  constructor() {
    super();

    this.header = createElement('h2', 'Garage (0)');
    this.page = createElement('p', 'Page #1', 'garage-page-text');
    this.garageItems = createElement('div', '', 'garage-items');
    this.garageItemsOnPage = [];
  }

  public render(): HTMLElement {
    const garageBlock = createElement('div', '', 'garage-block');
    garageBlock.append(this.header, this.page, this.garageItems);

    return garageBlock;
  }

  public renderCars(cars: Car[]): void {
    this.garageItems.innerHTML = '';
    this.garageItemsOnPage = [];
    cars.forEach(async (car: Car) => {
      const garageItem = new GarageItem(car);
      this.garageItems.appendChild(garageItem.render());
      this.garageItemsOnPage.push(garageItem);
    });
  }

  public updateCounters(carsCount: number): void {
    this.header.textContent = `Garage (${carsCount})`;
  }

  public updatePageCounter(page: number): void {
    this.page.textContent = `Page #${page}`;
  }

  public raceCars(): void {
    this.garageItemsOnPage.forEach(async (garageItem) => {
      await garageItem.startCar();
    });
  }

  public disableCarsEditButtons(state: boolean): void {
    this.garageItemsOnPage.forEach((garageItem) => {
      garageItem.disableCarEditButtons(state);
    });
  }

  private disableCarsRaceButtons(state: boolean): void {
    this.garageItemsOnPage.forEach((garageItem) => {
      garageItem.disableCarRaceButtons(state);
    });
  }

  public async stopRaceCars(): Promise<void> {
    const promises = this.garageItemsOnPage.map(async (garageItem) => {
      await garageItem.stopCar();
    });
    await Promise.all(promises);
    this.disableCarsEditButtons(false);
    this.disableCarsRaceButtons(false);
    this.emit('all-cars-stopped');
  }

  public showWinner(name: string, time: string): void {
    const winBlock = createElement('div', '', 'win-message-block');
    const winMessage = createElement('span', `${name} won at ${time} seconds!`, 'win-message-text');
    winBlock.appendChild(winMessage);
    this.garageItems.appendChild(winBlock);
    setTimeout(() => {
      if (this.garageItems.contains(winBlock)) this.garageItems.removeChild(winBlock);
    }, 4100);
  }
}
