import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, findCategory, formatPrice } from '../../data/menu';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = findCategory(slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="page-shell">
      <Link className="back-link" href="/">
        <span aria-hidden="true">←</span> Voltar ao menu
      </Link>

      <section className="category-header" aria-labelledby="category-title">
        <div>
          <span className="eyebrow">Categoria</span>
          <h1 id="category-title">{category.name}</h1>
          <p>{category.description}</p>
        </div>
        <span className="category-header__emoji" aria-hidden="true">
          {category.emoji}
        </span>
      </section>

      <nav className="category-nav" aria-label="Categorias do cardápio">
        {categories.map((item) => (
          <Link
            className={`category-pill ${item.slug === category.slug ? 'category-pill--active' : ''}`}
            href={`/categoria/${item.slug}`}
            key={item.slug}
            aria-current={item.slug === category.slug ? 'page' : undefined}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <section className="product-list" aria-label={`Produtos de ${category.name}`}>
        {category.products.map((product) => (
          <article className="product-card" key={product.name}>
            <div className="product-card__content">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <strong>{formatPrice(product.price)}</strong>
            </div>
            <div className="product-card__visual" aria-hidden="true">
              <span>{product.emoji}</span>
              <span className="product-card__add">+</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
