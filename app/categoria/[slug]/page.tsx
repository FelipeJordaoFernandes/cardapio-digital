import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductList } from '../../components/product-list';
import { categories, findCategory } from '../../data/menu';

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

  const portionOptions = findCategory('porcoes')?.products ?? [];
  const beverageOptions = findCategory('bebidas')?.products ?? [];

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

      <ProductList
        category={category}
        portionOptions={portionOptions}
        beverageOptions={beverageOptions}
      />
    </main>
  );
}
