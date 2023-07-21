import { EngineResponse } from '../types/types';

export default class EngineApi {
  private static baseUrl = 'http://localhost:3000/engine';

  public static async startStopEngine(id: number, status: 'started' | 'stopped'): Promise<EngineResponse> {
    const response = await fetch(`${this.baseUrl}?id=${id}&status=${status}`, {
      method: 'PATCH',
    });
    const result = await response.json();
    return result;
  }

  public static async switchDrive(id: number): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}?id=${id}&status=drive`, {
      method: 'PATCH',
    });
    if (response.status === 500) return false;
    if (response.status === 404 || response.status === 429) return true;
    const result = await response.json();
    return result.string;
  }
}
