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
      { name: 'X-Burger', description: 'Pão, hambúrguer artesanal, queijo, alface, tomate e molho da casa.', price: 22.9, emoji: '🍔' },
      { name: 'X-Bacon', description: 'Hambúrguer artesanal, queijo, bacon crocante e molho especial.', price: 27.9, emoji: '🥓' },
      { name: 'X-Salada', description: 'Pão, hambúrguer, queijo, salada fresca e maionese temperada.', price: 24.9, emoji: '🥪' },
    ],
  },
  {
    slug: 'porcoes',
    name: 'Porções',
    description: 'Petiscos para dividir ou aproveitar sozinho',
    emoji: '🍟',
    products: [
      { name: 'Batata frita', description: 'Porção de batatas fritas crocantes com molho da casa.', price: 18.9, emoji: '🍟' },
      { name: 'Onion rings', description: 'Anéis de cebola empanados, dourados e crocantes.', price: 21.9, emoji: '🧅' },
      { name: 'Calabresa acebolada', description: 'Calabresa grelhada com cebola e acompanhamento de pão.', price: 28.9, emoji: '🥘' },
    ],
  },
  {
    slug: 'bebidas',
    name: 'Bebidas',
    description: 'Opções geladas para acompanhar',
    emoji: '🥤',
    products: [
      { name: 'Refrigerante lata', description: 'Escolha o sabor disponível no momento do pedido.', price: 6, emoji: '🥤' },
      { name: 'Suco natural', description: 'Suco preparado na hora. Consulte os sabores disponíveis.', price: 9, emoji: '🍊' },
      { name: 'Água mineral', description: 'Garrafa de água mineral sem gás, 500 ml.', price: 4, emoji: '💧' },
    ],
  },
  {
    slug: 'combos',
    name: 'Combos',
    description: 'Seu lanche completo com economia',
    emoji: '🥡',
    products: [
      { name: 'Combo Clássico', description: 'X-Burger, batata frita individual e refrigerante lata.', price: 34.9, emoji: '🍔' },
      { name: 'Combo Bacon', description: 'X-Bacon, batata frita individual e refrigerante lata.', price: 39.9, emoji: '🍟' },
      { name: 'Combo Duplo', description: 'Dois X-Burgers, porção média de fritas e dois refrigerantes.', price: 64.9, emoji: '🥡' },
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
