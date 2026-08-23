export type Product = {
  name: string;
  description: string;
  price: number;
  emoji: string;
  startingAt?: boolean;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  emoji: string;
  products: Product[];
};

const snackProducts: Product[] = [
  { name: 'X-Burguer', description: 'Pão, hambúrguer artesanal, queijo e molho especial da casa.', price: 22.9, emoji: '🍔' },
  { name: 'X-Salada', description: 'Pão, hambúrguer, queijo, alface, tomate e maionese temperada.', price: 24.9, emoji: '🥪' },
  { name: 'X-Bacon', description: 'Pão, hambúrguer artesanal, queijo, bacon crocante e molho especial.', price: 27.9, emoji: '🥓' },
  { name: 'X-Tudo', description: 'Pão, hambúrguer, queijo, bacon, ovo, presunto, salada e molho da casa.', price: 32.9, emoji: '🍔' },
];

const portionProducts: Product[] = [
  { name: 'Batata frita', description: 'Porção de batatas fritas crocantes com molho da casa.', price: 18.9, emoji: '🍟' },
  { name: 'Iscas de peixe', description: 'Iscas de peixe empanadas, acompanhadas de limão e molho especial.', price: 34.9, emoji: '🐟' },
  { name: 'Frango a passarinho', description: 'Pedaços de frango temperados, fritos e finalizados com alho.', price: 31.9, emoji: '🍗' },
  { name: 'Calabresa defumada', description: 'Calabresa defumada grelhada com cebola e acompanhamento de pão.', price: 28.9, emoji: '🥘' },
];

const beverageProducts: Product[] = [
  { name: 'Coca-Cola', description: 'Refrigerante Coca-Cola gelado em lata de 350 ml.', price: 6, emoji: '🥤' },
  { name: 'Coca-Cola Zero', description: 'Refrigerante Coca-Cola Zero gelado em lata de 350 ml.', price: 6, emoji: '🥤' },
  { name: 'Pepsi', description: 'Refrigerante Pepsi gelado em lata de 350 ml.', price: 6, emoji: '🥤' },
  { name: 'Guaraná', description: 'Refrigerante de guaraná gelado em lata de 350 ml.', price: 6, emoji: '🧉' },
  { name: 'Fanta Uva', description: 'Refrigerante Fanta Uva gelado em lata de 350 ml.', price: 6, emoji: '🍇' },
  { name: 'Fanta Laranja', description: 'Refrigerante Fanta Laranja gelado em lata de 350 ml.', price: 6, emoji: '🍊' },
];

const lowestPortionPrice = Math.min(...portionProducts.map((product) => product.price));
const lowestBeveragePrice = Math.min(...beverageProducts.map((product) => product.price));

const comboProducts: Product[] = snackProducts.map((snack) => ({
  name: `Combo ${snack.name}`,
  description: `${snack.name}, uma porção à escolha e uma bebida à escolha.`,
  price: snack.price + lowestPortionPrice + lowestBeveragePrice,
  emoji: snack.emoji,
  startingAt: true,
}));

export const categories: Category[] = [
  {
    slug: 'lanches',
    name: 'Lanches',
    description: 'Hambúrgueres preparados na hora',
    emoji: '🍔',
    products: snackProducts,
  },
  {
    slug: 'porcoes',
    name: 'Porções',
    description: 'Petiscos para dividir ou aproveitar sozinho',
    emoji: '🍟',
    products: portionProducts,
  },
  {
    slug: 'bebidas',
    name: 'Bebidas',
    description: 'Opções geladas para acompanhar',
    emoji: '🥤',
    products: beverageProducts,
  },
  {
    slug: 'combos',
    name: 'Combos',
    description: 'Seu lanche completo com economia',
    emoji: '🥡',
    products: comboProducts,
  },
];

export function findCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}
