export default function createInputElement(attributes: Record<string, string>): HTMLInputElement {
  const inputElement = document.createElement('input');

  Object.entries(attributes).forEach(([key, value]) => {
    inputElement.setAttribute(key, value);
  });

  return inputElement;
}
