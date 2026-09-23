import { Link, useParams } from 'react-router-dom';
import { ProductList } from '../components/menu/ProductList';
import { categories, findCategory } from '../data/menu';
import { usePageMetadata } from '../hooks/usePageMetadata';

export function CategoryPage() {
  const { slug = '' } = useParams();
  const category = findCategory(slug);
  const description = category
    ? `${category.description}. Veja as opções e monte seu pedido online.`
    : 'A página solicitada não foi encontrada.';

  usePageMetadata({
    title: category?.name ?? 'Página não encontrada',
    description,
    path: category ? `/categoria/${category.slug}` : window.location.pathname,
    index: Boolean(category),
  });

  if (!category) {
    return (
      <main className="page-shell summary-page" id="main-content" tabIndex="-1">
        <section className="empty-cart">
          <span className="empty-cart__icon" aria-hidden="true">🔎</span>
          <h1>Categoria não encontrada</h1>
          <p>Essa opção não faz parte do cardápio.</p>
          <Link className="primary-link" to="/">Voltar ao início</Link>
        </section>
      </main>
    );
  }

  const portionOptions = findCategory('porcoes')?.products ?? [];
  const beverageOptions = findCategory('bebidas')?.products ?? [];

  return (
    <main className="page-shell" id="main-content" tabIndex="-1">
      <Link className="back-link" to="/">
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
            to={`/categoria/${item.slug}`}
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
