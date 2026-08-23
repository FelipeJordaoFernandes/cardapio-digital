export type Product = {
  name: string;
  description: string;
  price: number;
  emoji: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  emoji: string;
  products: Product[];
};

export const categories: Category[] = [
  {
    slug: 'lanches',
    name: 'Lanches',
    description: 'Hambúrgueres preparados na hora',
    emoji: '🍔',
    products: [
      { name: 'X-Burguer', description: 'Pão, hambúrguer artesanal, queijo e molho especial da casa.', price: 22.9, emoji: '🍔' },
      { name: 'X-Salada', description: 'Pão, hambúrguer, queijo, alface, tomate e maionese temperada.', price: 24.9, emoji: '🥪' },
      { name: 'X-Bacon', description: 'Pão, hambúrguer artesanal, queijo, bacon crocante e molho especial.', price: 27.9, emoji: '🥓' },
      { name: 'X-Tudo', description: 'Pão, hambúrguer, queijo, bacon, ovo, presunto, salada e molho da casa.', price: 32.9, emoji: '🍔' },
    ],
  },
  {
    slug: 'porcoes',
    name: 'Porções',
    description: 'Petiscos para dividir ou aproveitar sozinho',
    emoji: '🍟',
    products: [
      { name: 'Batata frita', description: 'Porção de batatas fritas crocantes com molho da casa.', price: 18.9, emoji: '🍟' },
      { name: 'Iscas de peixe', description: 'Iscas de peixe empanadas, acompanhadas de limão e molho especial.', price: 34.9, emoji: '🐟' },
      { name: 'Frango a passarinho', description: 'Pedaços de frango temperados, fritos e finalizados com alho.', price: 31.9, emoji: '🍗' },
      { name: 'Calabresa defumada', description: 'Calabresa defumada grelhada com cebola e acompanhamento de pão.', price: 28.9, emoji: '🥘' },
    ],
  },
  {
    slug: 'bebidas',
    name: 'Bebidas',
    description: 'Opções geladas para acompanhar',
    emoji: '🥤',
    products: [
      { name: 'Coca-Cola', description: 'Refrigerante Coca-Cola gelado em lata de 350 ml.', price: 6, emoji: '🥤' },
      { name: 'Pepsi', description: 'Refrigerante Pepsi gelado em lata de 350 ml.', price: 6, emoji: '🥤' },
      { name: 'Guaraná', description: 'Refrigerante de guaraná gelado em lata de 350 ml.', price: 6, emoji: '🧉' },
      { name: 'Fanta', description: 'Refrigerante Fanta gelado em lata de 350 ml.', price: 6, emoji: '🍊' },
    ],
  },
  {
    slug: 'combos',
    name: 'Combos',
    description: 'Seu lanche completo com economia',
    emoji: '🥡',
    products: [
      { name: 'Combo Burguer', description: 'X-Burguer, porção individual de batata frita e Coca-Cola.', price: 38.9, emoji: '🍔' },
      { name: 'Combo Salada', description: 'X-Salada, porção individual de calabresa defumada e Guaraná.', price: 43.9, emoji: '🥪' },
      { name: 'Combo Bacon', description: 'X-Bacon, porção individual de frango a passarinho e Pepsi.', price: 47.9, emoji: '🥓' },
      { name: 'Combo Tudo', description: 'X-Tudo, porção individual de iscas de peixe e Fanta.', price: 52.9, emoji: '🥡' },
    ],
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
