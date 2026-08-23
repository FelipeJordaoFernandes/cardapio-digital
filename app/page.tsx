import Link from 'next/link';
import { categories } from './data/menu';

export default function Home() {
  return (
    <main className="page-shell" id="main-content" tabIndex={-1}>
      <section className="hero" aria-labelledby="page-title">
        <span className="eyebrow">Cardápio digital</span>
        <h1 id="page-title">O que você quer pedir hoje?</h1>
        <p>Escolha uma categoria para ver nossas opções.</p>
      </section>

      <section className="category-section" aria-labelledby="categories-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Nosso menu</span>
            <h2 id="categories-title">Categorias</h2>
          </div>
          <span className="category-count">{categories.length} opções</span>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              className={`category-card category-card--${category.slug}`}
              href={`/categoria/${category.slug}`}
              key={category.slug}
            >
              <span className="category-card__content">
                <span className="category-card__label">Ver opções</span>
                <strong>{category.name}</strong>
                <span className="category-card__description">
                  {category.description}
                </span>
              </span>
              <span className="category-card__visual" aria-hidden="true">
                <span>{category.emoji}</span>
              </span>
              <span className="category-card__arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
