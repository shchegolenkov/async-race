import GaragePage from './pages/garage-page';
import WinnersPage from './pages/winners-page';
import GarageApi from './api/garage-api';
import WinnersApi from './api/winners-api';
import EventEmitter from './utils/event-emitter';
import createRandomColor from './utils/create-random-color';
import createRandomName from './utils/create-random-name';
import { Car, Winner, WinnersRequest } from './types/types';

export default class Controller extends EventEmitter {
  private garagePage: GaragePage;

  private winnersPage: WinnersPage;

  constructor(garagePage: GaragePage, winnersPage: WinnersPage) {
    super();

    this.garagePage = garagePage;
    this.winnersPage = winnersPage;

    this.initGarage();
    this.getWinnersData(this.winnersPage.getWinnersPageState());
    this.initListeners();
  }

  private initGarage(): void {
    this.getCarsCount();
    this.getCars(1);
  }

  private initListeners(): void {
    this.on('get-winners', (page, limit, sort, order): void => {
      this.getWinners(page, limit, sort, order);
    });

    this.on('get-cars', (page): void => {
      this.getCars(+page);
    });

    this.on('create-car', (name, color): void => {
      this.createCar(name, color);
    });

    this.on('delete-car', (id): void => {
      this.deleteCar(id);
    });

    this.on('update-car', (name, color, id): void => {
      this.updateCar(name, color, +id);
    });

    this.on('generate-cars', (): void => {
      this.generateCars();
    });

    this.on('winners-updated', (): void => {
      this.getWinnersData(this.winnersPage.getWinnersPageState());
    });
  }

  private async getCarsCount(): Promise<void> {
    const response: string | null = await GarageApi.getCarsCount();
    if (response) this.garagePage.updateCounters(+response);
  }

  private async getCars(page: number): Promise<void> {
    const response: Car[] | null = await GarageApi.getCars(page);
    if (response) this.garagePage.renderCars(response);
  }

  private getWinnersData(winnersPageState: WinnersRequest): void {
    const { page, limit, sort, order } = winnersPageState;
    this.getWinnersCount();
    this.getWinners(page.toString(), limit.toString(), sort, order);
  }

  private async getWinnersCount(): Promise<void> {
    const response: string | null = await WinnersApi.getWinnersCount();
    if (response) this.winnersPage.updateCounters(+response);
  }

  private async getWinners(page = '1', limit = '10', sort = 'time', order = 'ASC'): Promise<void> {
    const response = await WinnersApi.getWinners(+page, +limit, sort, order);
    let count = 0;
    this.winnersPage.clearWinnnersTable();
    response.forEach(async (winner: Winner) => {
      const car = await GarageApi.getCar(winner.id);
      this.winnersPage.renderWinnerRow((count += 1), car.color, car.name, winner.wins, winner.time);
    });
  }

  private async createCar(name: string, color: string): Promise<void> {
    const response: Car = await GarageApi.createCar(name, color);
    if (response) {
      this.getCarsCount();
      if (this.garagePage.getGaragePageState().isLastGaragePage && this.garagePage.getGaragePageState().carsOnPage < 7)
        this.getCars(this.garagePage.getGaragePage());
    }
  }

  private async deleteCar(id: string): Promise<void> {
    const response: Car = await GarageApi.deleteCar(+id);
    if (response) {
      this.getCarsCount();
      this.getCars(this.garagePage.getGaragePage());
      this.garagePage.setPageButtonsState();
      await WinnersApi.deleteWinner(+id);
      this.getWinnersData(this.winnersPage.getWinnersPageState());
    }
  }

  private async updateCar(name: string, color: string, id: number): Promise<void> {
    const car = { name, color, id };
    const response: Car = await GarageApi.updateCar(car);
    if (response) {
      this.getCars(this.garagePage.getGaragePage());
      this.getWinnersData(this.winnersPage.getWinnersPageState());
    }
  }

  private async generateCars(): Promise<void> {
    const cars: {
      name: string;
      color: string;
    }[] = [];
    for (let i = 1; i <= 100; i += 1) {
      cars.push({ name: createRandomName(), color: createRandomColor() });
    }
    await Promise.all(cars.map(async (car) => GarageApi.createCar(car.name, car.color)));
    this.emit('cars-generated');
    this.getCarsCount();
    if (this.garagePage.getGaragePageState().isLastGaragePage && this.garagePage.getGaragePageState().carsOnPage < 7) {
      this.getCars(this.garagePage.getGaragePage());
    }
  }
}
