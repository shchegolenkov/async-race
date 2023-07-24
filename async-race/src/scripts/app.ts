import TopBlock from './components/top-block';
import GaragePage from './pages/garage-page';
import WinnersPage from './pages/winners-page';
import Controller from './controller';

export default class App {
  private topBlock: TopBlock;

  private garagePage: GaragePage;

  private winnersPage: WinnersPage;

  private controller: Controller;

  constructor() {
    this.topBlock = new TopBlock();
    this.garagePage = new GaragePage();
    this.winnersPage = new WinnersPage();
    this.controller = new Controller(this.garagePage, this.winnersPage);
  }

  public render(): void {
    document.body.append(this.topBlock.render(), this.garagePage.render(), this.winnersPage.render());
  }
}
