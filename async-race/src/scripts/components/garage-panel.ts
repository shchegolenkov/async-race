import createElement from '../utils/create-element';
import createInput from '../utils/create-input';
import EventEmitter from '../utils/event-emitter';

export default class GaragePanel extends EventEmitter {
  private inputCarName: HTMLInputElement;

  private inputCarColor: HTMLInputElement;

  private buttonCreateCar: HTMLButtonElement;

  private inputSelectedCarName: HTMLInputElement;

  private inputSelectedCarColor: HTMLInputElement;

  private buttonUpdateCar: HTMLButtonElement;

  private buttonRace: HTMLButtonElement;

  private buttonReset: HTMLButtonElement;

  private buttonGenerateCars: HTMLButtonElement;

  private selectedId: string;

  constructor() {
    super();
    this.inputCarName = createInput({
      type: 'text',
      class: 'input',
      placeholder: 'Input car name',
      maxlength: '25',
      required: 'true',
    });
    this.inputCarColor = createInput({
      type: 'color',
      class: 'input--color',
    });
    this.buttonCreateCar = createElement('button', 'Create', 'button', 'button--create');
    this.inputSelectedCarName = createInput({
      type: 'text',
      class: 'input',
      placeholder: 'Select a car',
      maxlength: '40',
      required: 'true',
      disabled: 'true',
    });
    this.inputSelectedCarColor = createInput({
      type: 'color',
      class: 'input--color',
      disabled: 'true',
    });
    this.buttonUpdateCar = createElement('button', 'Update', 'button', 'button--update');
    this.buttonRace = createElement('button', 'Race', 'button', 'button--race');
    this.buttonReset = createElement('button', 'Reset', 'button', 'button--reset');
    this.buttonGenerateCars = createElement('button', 'Generage cars', 'button', 'button--generate');
    this.selectedId = '';

    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.on('select-car', (id, name, color) => this.fillSelected(id, name, color));
    this.on('cars-generated', () => {
      this.buttonGenerateCars.disabled = false;
    });
    this.on('single-race-start', () => {
      this.buttonRace.disabled = true;
      this.buttonUpdateCar.disabled = true;
      this.inputCarName.disabled = true;
      this.inputCarColor.disabled = true;
      this.buttonCreateCar.disabled = true;
      this.buttonGenerateCars.disabled = true;
    });
    this.on('single-race-started', () => {
      this.buttonReset.disabled = false;
    });
  }

  public render(): HTMLElement {
    const controlBlock = createElement('div', '', 'control-block');

    this.buttonUpdateCar.disabled = true;
    this.buttonReset.disabled = true;

    controlBlock.append(
      this.inputCarName,
      this.inputCarColor,
      this.buttonCreateCar,
      this.inputSelectedCarName,
      this.inputSelectedCarColor,
      this.buttonUpdateCar,
      this.buttonRace,
      this.buttonReset,
      this.buttonGenerateCars
    );

    this.addCarButtonsListeners();
    this.addRaceButtonsListeners();

    return controlBlock;
  }

  private fillSelected(id: string, name: string, color: string): void {
    this.selectedId = id;
    this.inputSelectedCarName.disabled = false;
    this.inputSelectedCarColor.disabled = false;
    this.buttonUpdateCar.disabled = false;
    this.inputSelectedCarName.value = name;
    this.inputSelectedCarColor.value = color;
  }

  public unlockPanel(): void {
    this.buttonRace.disabled = false;
    this.buttonGenerateCars.disabled = false;
    this.inputCarName.disabled = false;
    this.inputCarColor.disabled = false;
    this.buttonCreateCar.disabled = false;
    if (this.inputSelectedCarName.value) {
      this.inputSelectedCarName.disabled = false;
      this.inputSelectedCarColor.disabled = false;
      this.buttonUpdateCar.disabled = false;
    }
  }

  private lockRaceButton(): void {
    this.buttonRace.disabled = true;
  }

  public lockResetButton(): void {
    this.buttonReset.disabled = true;
  }

  private addCarButtonsListeners(): void {
    this.buttonCreateCar.addEventListener('click', () => {
      if (!this.inputCarName.value) {
        this.inputCarName.classList.add('input--required');
        setTimeout(() => {
          this.inputCarName.classList.remove('input--required');
        }, 2000);
        return;
      }
      const name = this.inputCarName.value;
      const color = this.inputCarColor.value;
      this.emit('create-car', name, color);
      this.inputCarName.value = '';
    });

    this.buttonUpdateCar.addEventListener('click', () => {
      if (!this.inputSelectedCarName.value) {
        this.inputSelectedCarName.classList.add('input--required');
        setTimeout(() => {
          this.inputSelectedCarName.classList.remove('input--required');
        }, 2000);
        return;
      }
      const name = this.inputSelectedCarName.value;
      const color = this.inputSelectedCarColor.value;
      this.emit('update-car', name, color, this.selectedId);
      this.inputSelectedCarName.value = '';
      this.inputSelectedCarName.disabled = true;
      this.inputSelectedCarColor.disabled = true;
      this.buttonUpdateCar.disabled = true;
    });

    this.buttonGenerateCars.addEventListener('click', () => {
      this.buttonGenerateCars.disabled = true;
      this.emit('generate-cars');
    });
  }

  private addRaceButtonsListeners(): void {
    this.buttonRace.addEventListener('click', () => {
      this.buttonRace.disabled = true;
      this.buttonUpdateCar.disabled = true;
      this.inputCarName.disabled = true;
      this.inputCarColor.disabled = true;
      this.buttonCreateCar.disabled = true;
      this.buttonGenerateCars.disabled = true;
      this.inputSelectedCarName.disabled = true;
      this.inputSelectedCarColor.disabled = true;
      setTimeout(() => {
        this.buttonReset.disabled = false;
      }, 2000);
      this.emit('start-race');
    });

    this.buttonReset.addEventListener('click', () => {
      this.buttonReset.disabled = true;
      this.emit('reset-race');
    });
  }
}
