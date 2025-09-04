import { Product } from 'src/modules/products/domain/entities/product.entity';

export const SEED_PRODUCTS: Partial<
  Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
>[] = [
  // Vegetables 🥕
  {
    name: 'Organic Carrots',
    description: 'A 2 lb bag of fresh, crunchy organic carrots.',
    price: 3.5,
    category: 'Vegetables',
    stock: 850,
  },
  {
    name: 'Heirloom Tomatoes',
    description:
      'A colorful mix of vine-ripened heirloom tomatoes. (Priced per lb)',
    price: 4.25,
    category: 'Vegetables',
    stock: 150,
  },
  {
    name: 'Russet Potatoes',
    description:
      'A 10 lb bag of versatile russet potatoes, perfect for mashing or frying.',
    price: 5.99,
    category: 'Vegetables',
    stock: 1200,
  },
  // Fruits 🍓
  {
    name: 'Gala Apples',
    description: 'Crisp and sweet red Gala apples. (Priced per lb)',
    price: 2.99,
    category: 'Fruits',
    stock: 1500,
  },
  {
    name: 'Bananas',
    description: 'A bunch of ripe, potassium-rich bananas.',
    price: 1.75,
    category: 'Fruits',
    stock: 900,
  },
  {
    name: 'Oranges',
    description: 'Seedless navel oranges, full of Vitamin C. (3 lb bag)',
    price: 4.5,
    category: 'Fruits',
    stock: 600,
  },
  // Grains 🌾
  {
    name: 'Long Grain White Rice',
    description: 'A 5 lb bag of versatile long grain white rice.',
    price: 8.99,
    category: 'Grains',
    stock: 450,
  },
  {
    name: 'Rolled Oats',
    description:
      'Old-fashioned rolled oats for a hearty breakfast. (42 oz container)',
    price: 6.5,
    category: 'Grains',
    stock: 300,
  },
  {
    name: 'Hard Red Winter Wheat',
    description: 'High-protein wheat grain for milling flour. (50 lb bag)',
    price: 35.0,
    category: 'Grains',
    stock: 120,
  },
  // Livestock 🐄
  {
    name: 'Dairy Cow (Holstein Heifer)',
    description: 'A young, healthy Holstein heifer ready for breeding.',
    price: 1800.0,
    category: 'Livestock',
    stock: 15,
  },
  {
    name: 'Laying Hens (Set of 4)',
    description: 'A set of four pullets ready to start laying eggs.',
    price: 100.0,
    category: 'Livestock',
    stock: 40,
  },
  {
    name: 'Angus Bull',
    description: 'A prime breeding Angus bull with strong genetics.',
    price: 4500.0,
    category: 'Livestock',
    stock: 5,
  },
  // Dairy 🥛
  {
    name: 'Whole Milk',
    description: 'One gallon of fresh, pasteurized Grade A whole milk.',
    price: 4.75,
    category: 'Dairy',
    stock: 350,
  },
  {
    name: 'Sharp Cheddar Cheese',
    description:
      'A 2 lb block of aged sharp cheddar cheese made from local milk.',
    price: 12.5,
    category: 'Dairy',
    stock: 200,
  },
  {
    name: 'Grade AA Large Eggs',
    description: 'A carton of two dozen large, farm-fresh Grade AA eggs.',
    price: 7.25,
    category: 'Dairy',
    stock: 400,
  },
  // Herbs 🌿
  {
    name: 'Fresh Basil',
    description: 'A fragrant bunch of fresh sweet basil.',
    price: 2.99,
    category: 'Herbs',
    stock: 180,
  },
  {
    name: 'Cilantro Bundle',
    description: 'A fresh, aromatic bundle of cilantro.',
    price: 1.99,
    category: 'Herbs',
    stock: 250,
  },
  {
    name: 'Rosemary Plant',
    description: 'A potted rosemary plant for your garden or kitchen.',
    price: 6.0,
    category: 'Herbs',
    stock: 90,
  },
  // Seeds 🌱
  {
    name: 'Corn Seeds',
    description: 'A 50 lb bag of high-yield hybrid corn seeds for planting.',
    price: 150.0,
    category: 'Seeds',
    stock: 75,
  },
  {
    name: 'Sunflower Seeds',
    description: 'Packet of mammoth sunflower seeds for planting.',
    price: 3.99,
    category: 'Seeds',
    stock: 500,
  },
  {
    name: 'Wildflower Seed Mix',
    description:
      'A 1 lb bag of mixed wildflower seeds for attracting pollinators.',
    price: 25.0,
    category: 'Seeds',
    stock: 110,
  },
  // Equipment 🚜
  {
    name: 'Heavy-Duty Shovel',
    description: 'A durable, steel-head shovel with a hardwood handle.',
    price: 29.99,
    category: 'Equipment',
    stock: 85,
  },
  {
    name: '5-Gallon Bucket',
    description: 'A multi-purpose, food-grade 5-gallon utility bucket.',
    price: 5.5,
    category: 'Equipment',
    stock: 600,
  },
  {
    name: 'Compact Utility Tractor',
    description: 'A 25HP compact tractor for small farm and landscaping tasks.',
    price: 15500.0,
    category: 'Equipment',
    stock: 3,
  },
  {
    name: 'Irrigation Drip Line',
    description: '100-foot roll of drip line for efficient watering.',
    price: 45.0,
    category: 'Equipment',
    stock: 130,
  },
] as const;
