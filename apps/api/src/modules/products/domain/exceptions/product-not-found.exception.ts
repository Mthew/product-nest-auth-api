export class ProductNotFoundException extends Error {
  constructor(id?: string) {
    super(id ? `Product with ID "${id}" not found.` : 'Product not found.');
    this.name = 'ProductNotFoundException';
  }
}
