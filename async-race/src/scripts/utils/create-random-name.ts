import carBrands from '../data/car-brands';
import carModels from '../data/car-models';

export default function createRandomName(): string {
  const randomBrand: number = Math.floor(Math.random() * carBrands.length);
  const randomModel: number = Math.floor(Math.random() * carModels.length);
  return `${carBrands[randomBrand]} ${carModels[randomModel]}`;
}
