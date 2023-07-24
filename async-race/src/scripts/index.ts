import '../styles/global.css';
import App from './app';

window.onload = (): void => {
  const app = new App();
  app.render();
};
