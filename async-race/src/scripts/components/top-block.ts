import createElement from '../utils/create-element';
import EventEmitter from '../utils/event-emitter';

export default class TopBlock extends EventEmitter {
  private buttonGarage: HTMLButtonElement;

  private buttonWinners: HTMLButtonElement;

  constructor() {
    super();
    this.buttonGarage = createElement('button', 'Garage', 'button', 'button--active', 'button--garage');
    this.buttonWinners = createElement('button', 'Winners', 'button', 'button--garage');
    this.addListeners();
  }

  private addListeners(): void {
    this.buttonWinners.addEventListener('click', () => {
      this.buttonGarage.classList.remove('button--active');
      this.buttonWinners.classList.add('button--active');
      this.emit('to-winners-page');
    });

    this.buttonGarage.addEventListener('click', () => {
      this.buttonWinners.classList.remove('button--active');
      this.buttonGarage.classList.add('button--active');
      this.emit('to-garage-page');
    });
  }

  public render(): HTMLElement {
    const navBlock = createElement('div', '', 'top-block');

    const header = createElement('h1', 'Async Race 🏁');
    navBlock.appendChild(header);

    const nav = createElement('nav', '', 'nav');
    nav.append(this.buttonGarage, this.buttonWinners);
    navBlock.appendChild(nav);

    return navBlock;
  }
}
