import { Winner } from '../types/types';

export default class WinnersApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:3000/winners';
  }

  public async getWinners(page: number, sort: string, order: string): Promise<Winner[]> {
    const response = await fetch(`${this.baseUrl}?_page=${page}&_limit=${10}&_sort=${sort}&_order=${order}`);
    const result = await response.json();
    return result;
  }

  public async getWinner(id: number): Promise<Winner | null> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) return null;
    const result = await response.json();
    return result;
  }

  public async createWinner(winner: Winner): Promise<Winner> {
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

  public async deleteWinner(id: number): Promise<Winner> {
    const response = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
    const result = await response.json();
    return result;
  }

  public async updateWinner(winner: Winner): Promise<Winner> {
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

  public async getWinnersCount(): Promise<string | null> {
    const response = await fetch(`${this.baseUrl}?_limit=10`);
    await response.json();
    return response.headers.get('X-Total-Count');
  }
}
