import GaragePanel from '../components/garage-panel';
import GarageBlock from '../components/garage-block';
import createElement from '../utils/create-element';
import EventEmitter from '../utils/event-emitter';
import { Car, GaragePageState, Winner } from '../types/types';
import WinnersApi from '../api/winners-api';

export default class GaragePage extends EventEmitter {
  private garagePanel: GaragePanel;

  private garageBlock: GarageBlock;

  private garagePage: HTMLElement;

  private buttonPrevPageGarage: HTMLButtonElement;

  private buttonNextPageGarage: HTMLButtonElement;

  private carsCount: number;

  private currentGaragePage: number;

  private carsOnPage: Car[];

  private isRaceActive: boolean;

  private currentWinnerId: number;

  private singleStartedCars: Set<string>;

  constructor() {
    super();
    this.garagePage = createElement('div', '', 'garage-page');
    this.garagePanel = new GaragePanel();
    this.garageBlock = new GarageBlock();
    this.buttonPrevPageGarage = createElement('button', 'Prev', 'button', 'button--prev-garage');
    this.buttonNextPageGarage = createElement('button', 'Next', 'button', 'button--next-garage');

    this.carsCount = 0;
    this.currentGaragePage = 1;
    this.isRaceActive = false;
    this.currentWinnerId = 0;
    this.carsOnPage = [];
    this.singleStartedCars = new Set();

    this.addPageListeners();
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.on('to-winners-page', () => this.hide());
    this.on('to-garage-page', () => this.show());
    this.on('start-race', () => this.startRace());
    this.on('reset-race', () => this.resetRace());
    this.on('car-finished', (id, name, time) => this.getRaceWinner(id, name, time));
    this.on('all-cars-stopped', () => {
      this.garagePanel.unlockPanel();
      this.setPageButtonsState();
    });
    this.on('single-race-start', (id) => {
      this.singleStartedCars.add(id);
      this.disableStatePageButtons();
      this.garageBlock.disableCarsEditButtons(true);
    });
    this.on('single-race-stopped', (id) => {
      this.singleStartedCars.delete(id);
      if (!this.singleStartedCars.size) {
        this.garagePanel.unlockPanel();
        this.garagePanel.lockResetButton();
        this.garageBlock.disableCarsEditButtons(false);
        this.setPageButtonsState();
      }
    });
  }

  public render(): HTMLElement {
    const navBlock = createElement('div', '', 'nav-block');
    this.buttonPrevPageGarage.disabled = true;
    this.buttonNextPageGarage.disabled = true;
    navBlock.append(this.buttonPrevPageGarage, this.buttonNextPageGarage);

    this.garagePage.append(this.garagePanel.render(), this.garageBlock.render(), navBlock);
    return this.garagePage;
  }

  public getGaragePageState(): GaragePageState {
    const garagePageState = {
      carsOnPage: this.carsOnPage.length,
      currentGaragePage: this.currentGaragePage,
      isLastGaragePage: this.currentGaragePage >= this.getGaragePagesCount(),
    };
    return garagePageState;
  }

  private show(): void {
    this.garagePage.classList.remove('page--disabled');
  }

  private hide(): void {
    this.garagePage.classList.add('page--disabled');
  }

  private getGaragePagesCount(): number {
    return Math.ceil(this.carsCount / 7);
  }

  public updateCounters(carsCount: number): void {
    this.carsCount = carsCount;
    this.garageBlock.updateCounters(carsCount);
    this.setPageButtonsState();
  }

  public renderCars(cars: Car[]): void {
    this.garageBlock.renderCars(cars);
    this.carsOnPage = cars;
  }

  public getGaragePage(): number {
    return this.currentGaragePage;
  }

  private addPageListeners(): void {
    this.buttonPrevPageGarage.addEventListener('click', () => {
      this.currentGaragePage -= 1;
      this.updatePageNumber(this.currentGaragePage);
    });

    this.buttonNextPageGarage.addEventListener('click', () => {
      this.currentGaragePage += 1;
      this.updatePageNumber(this.currentGaragePage);
    });
  }

  private updatePageNumber(page: number): void {
    this.garageBlock.updatePageCounter(this.currentGaragePage);
    this.setPageButtonsState();
    this.emit('get-cars', page.toString());
  }

  public setPageButtonsState(): void {
    this.buttonPrevPageGarage.disabled = this.currentGaragePage === 1;
    this.buttonNextPageGarage.disabled = this.currentGaragePage >= this.getGaragePagesCount();
  }

  private disableStatePageButtons(): void {
    this.buttonPrevPageGarage.disabled = true;
    this.buttonNextPageGarage.disabled = true;
  }

  private startRace(): void {
    this.isRaceActive = true;
    this.disableStatePageButtons();
    this.garageBlock.raceCars();
  }

  private resetRace(): void {
    this.isRaceActive = false;
    this.currentWinnerId = 0;
    this.garageBlock.stopRaceCars();
  }

  private getRaceWinner(id: string, name: string, time: string): void {
    if (this.isRaceActive && this.currentWinnerId === 0) {
      this.currentWinnerId = +id;
      this.garageBlock.showWinner(name, time);
      this.writeWinner(+id, +time);
    }
  }

  private async writeWinner(id: number, time: number): Promise<void> {
    const response: Winner | null = await WinnersApi.getWinner(id);
    if (response) {
      if (response.time > time) {
        await WinnersApi.updateWinner({
          id,
          wins: response.wins + 1,
          time,
        });
      } else if (response.time <= time) {
        await WinnersApi.updateWinner({
          id,
          wins: response.wins + 1,
          time: response.time,
        });
      }
    } else {
      await WinnersApi.createWinner({
        id,
        wins: 1,
        time,
      });
    }
    this.emit('winners-updated');
  }
}
