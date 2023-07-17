export default function createElement<T extends keyof HTMLElementTagNameMap>(
  type: T,
  textContent: string,
  ...classes: string[]
): HTMLElementTagNameMap[T] {
  const element = document.createElement(type);
  element.textContent = textContent;

  if (classes.length > 0) {
    element.classList.add(...classes);
  }

  return element;
}
