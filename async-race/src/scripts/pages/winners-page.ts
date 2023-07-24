import { WinnersRequest } from '../types/types';
import createCarImage from '../utils/create-car-image';
import createElement from '../utils/create-element';
import EventEmitter from '../utils/event-emitter';

export default class WinnersPage extends EventEmitter {
  private winnersPage: HTMLElement;

  private header: HTMLHeadingElement;

  private page: HTMLParagraphElement;

  private buttonWinsSort: HTMLButtonElement;

  private buttonTimeSort: HTMLButtonElement;

  private tbody: HTMLElement;

  private buttonPrevPageWinners: HTMLButtonElement;

  private buttonNextPageWinners: HTMLButtonElement;

  private currentWinnersPage: number;

  private winnersCount: number;

  private winnersSort: 'time' | 'id' | 'wins';

  private winnersOrder: 'ASC' | 'DESC';

  private winnersPagelimit: number;

  constructor() {
    super();

    this.winnersPage = createElement('div', '', 'winners-page', 'page--disabled');

    this.header = createElement('h2', 'Winners (0)');
    this.page = createElement('p', 'Page #1', 'winners-page-text');

    this.buttonWinsSort = createElement('button', 'Wins', 'button-sort', 'button-sort--wins');
    this.buttonTimeSort = createElement('button', 'Best time (sec) ↑', 'button-sort', 'button-sort--time');
    this.tbody = createElement('tbody', '');

    this.buttonPrevPageWinners = createElement('button', 'Prev', 'button');
    this.buttonNextPageWinners = createElement('button', 'Next', 'button');

    this.winnersCount = 0;
    this.winnersPagelimit = 10;
    this.currentWinnersPage = 1;
    this.winnersSort = 'time';
    this.winnersOrder = 'ASC';

    this.on('to-winners-page', () => this.show());
    this.on('to-garage-page', () => this.hide());
  }

  private renderTable(): HTMLTableElement {
    const table = createElement('table', '', 'winners-table');
    const thead = createElement('thead', '', 'winners-table-head');
    const theadRow = createElement('tr', '');
    const tableColNum = createElement('th', '#');
    const tableColCarIcon = createElement('th', 'Car');
    const tableColCarName = createElement('th', 'Name');
    const tableColWins = createElement('th', '');
    tableColWins.appendChild(this.buttonWinsSort);
    const tableColTime = createElement('th', '');
    tableColTime.appendChild(this.buttonTimeSort);
    theadRow.append(tableColNum, tableColCarIcon, tableColCarName, tableColWins, tableColTime);
    thead.appendChild(theadRow);
    table.append(thead, this.tbody);

    return table;
  }

  public render(): HTMLElement {
    const navBlock = createElement('div', '', 'nav-block');
    this.buttonPrevPageWinners.disabled = true;
    this.buttonNextPageWinners.disabled = true;
    navBlock.append(this.buttonPrevPageWinners, this.buttonNextPageWinners);

    this.winnersPage.append(this.header, this.page, this.renderTable(), navBlock);
    this.addPageListeners();
    this.addSortListeners();

    return this.winnersPage;
  }

  private setPageButtonsState(): void {
    this.buttonPrevPageWinners.disabled = this.currentWinnersPage === 1;
    if (this.winnersCount === 0 || this.currentWinnersPage === this.getWinnersPagesCount()) {
      this.buttonNextPageWinners.disabled = true;
    } else {
      this.buttonNextPageWinners.disabled = false;
    }
  }

  private show(): void {
    this.winnersPage.classList.remove('page--disabled');
  }

  private hide(): void {
    this.winnersPage.classList.add('page--disabled');
  }

  private addPageListeners(): void {
    this.buttonPrevPageWinners.addEventListener('click', () => {
      this.currentWinnersPage -= 1;
      this.setPageButtonsState();
      this.page.textContent = `Page #${this.currentWinnersPage}`;
      this.emit(
        'get-winners',
        this.currentWinnersPage.toString(),
        this.winnersPagelimit.toString(),
        this.winnersSort,
        this.winnersOrder
      );
    });

    this.buttonNextPageWinners.addEventListener('click', () => {
      this.currentWinnersPage += 1;
      this.setPageButtonsState();
      this.page.textContent = `Page #${this.currentWinnersPage}`;
      this.emit(
        'get-winners',
        this.currentWinnersPage.toString(),
        this.winnersPagelimit.toString(),
        this.winnersSort,
        this.winnersOrder
      );
    });
  }

  private addSortListeners(): void {
    this.buttonWinsSort.addEventListener('click', () => {
      this.winnersSort = 'wins';
      this.buttonTimeSort.textContent = 'Best time (sec)';
      if (this.winnersOrder === 'ASC') {
        this.winnersOrder = 'DESC';
        this.buttonWinsSort.textContent = 'Wins ↓';
      } else {
        this.winnersOrder = 'ASC';
        this.buttonWinsSort.textContent = 'Wins ↑';
      }
      this.emit(
        'get-winners',
        this.currentWinnersPage.toString(),
        this.winnersPagelimit.toString(),
        this.winnersSort,
        this.winnersOrder
      );
    });

    this.buttonTimeSort.addEventListener('click', () => {
      this.winnersSort = 'time';
      this.buttonWinsSort.textContent = 'Wins';
      if (this.winnersOrder === 'ASC') {
        this.winnersOrder = 'DESC';
        this.buttonTimeSort.textContent = 'Best time (sec) ↓';
      } else {
        this.winnersOrder = 'ASC';
        this.buttonTimeSort.textContent = 'Best time (sec) ↑';
      }
      this.emit(
        'get-winners',
        this.currentWinnersPage.toString(),
        this.winnersPagelimit.toString(),
        this.winnersSort,
        this.winnersOrder
      );
    });
  }

  public updateCounters(winnersCount: number): void {
    this.winnersCount = winnersCount;
    this.header.textContent = `Winners (${winnersCount})`;
    this.setPageButtonsState();
  }

  public clearWinnnersTable(): void {
    this.tbody.innerHTML = '';
  }

  private getWinnersPagesCount(): number {
    return Math.ceil(this.winnersCount / 10);
  }

  public getWinnersPageState(): WinnersRequest {
    const winnersPageState = {
      page: this.currentWinnersPage,
      limit: this.winnersPagelimit,
      sort: this.winnersSort,
      order: this.winnersOrder,
    };
    return winnersPageState;
  }

  public renderWinnerRow(num: number, color: string, name: string, wins: number, time: number): void {
    const numCell = createElement('td', `${num}`);
    const imgCell = createElement('td', '');
    imgCell.insertAdjacentHTML('afterbegin', createCarImage(color));
    const nameCell = createElement('td', `${name}`);
    const winsCell = createElement('td', `${wins}`);
    const timeCell = createElement('td', `${time}`);
    const winnerRow = createElement('tr', '');
    winnerRow.append(numCell, imgCell, nameCell, winsCell, timeCell);

    this.tbody.appendChild(winnerRow);
  }
}
