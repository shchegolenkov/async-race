import { Car } from '../types/types';

export default class GarageApi {
  private static baseUrl = 'http://localhost:3000/garage';

  public static async getCars(page: number): Promise<Car[]> {
    const response = await fetch(`${this.baseUrl}?_page=${page}&_limit=7`);
    const result = await response.json();
    return result;
  }

  public static async getCar(id: number): Promise<Car> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    const result = await response.json();
    return result;
  }

  public static async createCar(name: string, color: string): Promise<Car> {
    const newCarRequest = { name, color };
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(newCarRequest),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    const result = await response.json();
    return result;
  }

  public static async deleteCar(id: number): Promise<Car> {
    const response = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
    const result = await response.json();
    return result;
  }

  public static async updateCar(car: Car): Promise<Car> {
    const response = await fetch(`${this.baseUrl}/${car.id}`, {
      method: 'PUT',
      body: JSON.stringify(car),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    const result = await response.json();
    return result;
  }

  public static async getCarsCount(): Promise<string | null> {
    const response = await fetch(`${this.baseUrl}?_limit=7`);
    await response.json();
    return response.headers.get('X-Total-Count');
  }
}
