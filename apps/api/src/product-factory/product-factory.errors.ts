export class ProductFactoryInvariantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductFactoryInvariantError';
  }
}