import { Winner } from '../types/types';

export default class WinnersApi {
  private static baseUrl = 'http://localhost:3000/winners';

  public static async getWinners(page: number, limit: number, sort: string, order: string): Promise<Winner[]> {
    const response = await fetch(`${this.baseUrl}?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`);
    const result = await response.json();
    return result;
  }

  public static async getWinner(id: number): Promise<Winner | null> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) return null;
    const result = await response.json();
    return result;
  }

  public static async createWinner(winner: Winner): Promise<Winner> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(winner),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    const result = await response.json();
    return result;
  }

  public static async deleteWinner(id: number): Promise<Winner> {
    const response = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
    const result = await response.json();
    return result;
  }

  public static async updateWinner(winner: Winner): Promise<Winner> {
    const response = await fetch(`${this.baseUrl}/${winner.id}`, {
      method: 'PUT',
      body: JSON.stringify(winner),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    const result = await response.json();
    return result;
  }

  public static async getWinnersCount(): Promise<string | null> {
    const response = await fetch(`${this.baseUrl}?_limit=10`);
    await response.json();
    return response.headers.get('X-Total-Count');
  }
}
