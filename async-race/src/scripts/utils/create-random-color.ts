export default function createRandomColor(): string {
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
  let randomColor = '#';
  for (let i = 0; i < 6; i += 1) {
    const value = arr[Math.floor(Math.random() * 16)];
    randomColor += value;
  }
  return randomColor;
}
