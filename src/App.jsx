import { useEffect, useMemo, useState } from 'react';
import {
  BadgePercent,
  Baby,
  Bike,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  HeartPulse,
  MapPin,
  Minus,
  PackageCheck,
  Pill,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Trash2,
  UserRound,
} from 'lucide-react';
import { categories, getPharmacy, pharmacies, products } from './data/mockData';
import { getProductsForCategory } from './lib/catalog';
import { addToCart, getCartSummary, getDeliveryTotal, removeFromCart, updateCartQuantity } from './lib/cart';

const iconMap = { Pill, Sparkles, HeartPulse, Baby, BadgePercent };
const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const getCategoryLabel = (categoryId) => categories.find((category) => category.id === categoryId)?.label ?? 'Produtos';

function Header({ accountName, activePage, cartCount, onNavigate, query, setQuery, selectedCategory, setSelectedCategory }) {
  const logoSrc = `${import.meta.env.BASE_URL}logo-transparent.png`;
  const tabs = [
    { page: 'home', label: 'Início' },
    { page: 'catalog', label: 'Medicamentos', category: 'medicamentos' },
    { page: 'catalog', label: 'Cuidados pessoais', category: 'cuidados' },
    { page: 'catalog', label: 'Ofertas', category: 'ofertas' },
  ];

  return (
    <header className="site-header">
      <div className="topbar">
        <button className="brand" onClick={() => onNavigate('home')} type="button" aria-label="Ir para início">
          <span className="brand-mark" aria-hidden="true">
            <img src={logoSrc} alt="" />
          </span>
        </button>

        <label className="search-box">
          <Search size={18} aria-hidden="true" />
          <input
            aria-label="Buscar produtos e remédios"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => onNavigate('catalog')}
            placeholder="O que você precisa?"
          />
        </label>

        <div className="header-actions">
          <button type="button" className="icon-action" aria-label="Entrar na conta" onClick={() => onNavigate('account')}>
            <UserRound size={19} />
            <span>{accountName || 'Entrar'}</span>
          </button>
          <button type="button" className="icon-action cart-pill" aria-label={`Abrir carrinho com ${cartCount} itens`} onClick={() => onNavigate('cart')}>
            <ShoppingCart size={19} />
            <span>Carrinho</span>
            <strong>{cartCount}</strong>
          </button>
        </div>
      </div>

      <nav className="nav-tabs" aria-label="Navegação principal">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={activePage === tab.page && (!tab.category || tab.category === selectedCategory) ? 'active' : ''}
            onClick={() => {
              if (tab.category) setSelectedCategory(tab.category);
              onNavigate(tab.page);
            }}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

function CategoryRail({ selectedCategory, setSelectedCategory }) {
  return (
    <aside className="category-rail" aria-label="Categorias">
      <h2>Categorias</h2>
      {categories.map((category) => {
        const Icon = iconMap[category.icon];
        return (
          <button
            key={category.id}
            type="button"
            className={selectedCategory === category.id ? 'selected' : ''}
            onClick={() => setSelectedCategory(category.id)}
          >
            <Icon size={18} />
            {category.label}
          </button>
        );
      })}
    </aside>
  );
}

function ProductCard({ product, onAdd, onOpen }) {
  const pharmacy = getPharmacy(product.pharmacyId);

  return (
    <article className="product-card">
      <button className="product-visual" type="button" aria-label={`Ver detalhes de ${product.name}`} onClick={() => onOpen(product)}>
        <img src={`${import.meta.env.BASE_URL}${product.image}`} alt="" />
        <span>{product.tag}</span>
      </button>
      <div className="product-copy">
        <p>{product.brand}</p>
        <h3>{product.name}</h3>
        <small>{pharmacy.name} • {pharmacy.deliveryTime}</small>
      </div>
      <div className="price-row">
        <div>
          <strong>{formatCurrency(product.price)}</strong>
          <del>{formatCurrency(product.oldPrice)}</del>
        </div>
        <button type="button" aria-label={`Adicionar ${product.name} ao carrinho`} onClick={() => onAdd(product)}>
          Adicionar
        </button>
      </div>
    </article>
  );
}

function HomePage({ featuredProducts, onAdd, onOpen, onNavigate }) {

  return (
    <main className="page-shell home-page">
      <section className="home-content">
        <div className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow"><Bike size={16} /> entrega expressa</span>
            <h1>Remédio, cuidado e farmácia chegando sem você sair de casa.</h1>
            <p>Compare preços, escolha a farmácia mais rápida e acompanhe tudo em um fluxo simples.</p>
            <button type="button" onClick={() => onNavigate('catalog')}>
              Buscar produtos <ChevronRight size={18} />
            </button>
          </div>
          <div className="hero-card" aria-label="Fluxo de entrega rápida">
            <div className="dispatch-card">
              <span><MapPin size={16} /> Sua região</span>
              <strong>Separação prioritária</strong>
              <p>Farmácias próximas recebem o pedido com rota de entrega rápida.</p>
            </div>
            <div className="route-line" />
          </div>
        </div>

        <section className="section-head">
          <div>
            <p>Mais vendidos</p>
            <h2>Prontos para entrega hoje</h2>
          </div>
          <button type="button" onClick={() => onNavigate('catalog')}>Ver todos</button>
        </section>

        <div className="product-grid compact">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} onOpen={onOpen} />
          ))}
        </div>

        <section className="pharmacy-strip">
          {pharmacies.map((pharmacy) => (
            <article key={pharmacy.id}>
              <div><PackageCheck size={20} /></div>
              <h3>{pharmacy.name}</h3>
              <p>{pharmacy.distance} • {pharmacy.deliveryTime}</p>
              <span><Star size={14} /> {pharmacy.rating}</span>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

function CatalogPage({ filteredProducts, selectedCategory, setSelectedCategory, onAdd, onOpen, sortBy, setSortBy, fastOnly, setFastOnly, query, setQuery }) {
  const categoryLabel = getCategoryLabel(selectedCategory);
  const resetFilters = () => {
    setQuery('');
    setFastOnly(false);
    setSelectedCategory('medicamentos');
  };

  return (
    <main className="page-shell catalog-layout">
      <aside className="filters-panel">
        <h2>Filtros</h2>
        <CategoryRail selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <div className="filter-block">
          <h3>Faixa de preço</h3>
          <div className="range-line" aria-hidden="true"><span /></div>
          <p>R$ 0 até R$ 100</p>
        </div>
        <div className="filter-block">
          <h3>Entrega</h3>
          <label><input type="checkbox" checked={fastOnly} onChange={(event) => setFastOnly(event.target.checked)} /> Até 35 min</label>
          <p className="helper-copy">Frete aparece no carrinho por farmácia escolhida.</p>
        </div>
        <button className="filter-reset" type="button" onClick={resetFilters}>Limpar filtros</button>
      </aside>

      <section className="catalog-content">
        <div className="breadcrumb">Início <ChevronRight size={14} /> {categoryLabel}</div>
        <div className="section-head">
          <div>
            <p>Produtos e farmácias</p>
            <h1>{categoryLabel}</h1>
          </div>
          <select aria-label="Ordenar produtos" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="delivery">Entrega mais rápida</option>
            <option value="price">Menor preço</option>
            <option value="rating">Melhor avaliação</option>
          </select>
        </div>
        {filteredProducts.length ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={onAdd} onOpen={onOpen} />
            ))}
          </div>
        ) : (
          <div className="empty-state catalog-empty">
            <Search size={38} />
            <h2>Nenhum produto encontrado</h2>
            <p>{query ? `Não encontramos "${query}" com os filtros atuais.` : 'Remova filtros ou escolha outra categoria.'}</p>
            <button type="button" onClick={resetFilters}>Ver medicamentos</button>
          </div>
        )}
      </section>
    </main>
  );
}

function ProductDetail({ product, onAdd, onBack }) {
  const [quantity, setQuantity] = useState(1);
  const pharmacy = getPharmacy(product.pharmacyId);

  return (
    <main className="page-shell detail-page">
      <button className="text-link" type="button" onClick={onBack}>Voltar para produtos</button>
      <section className="detail-card">
        <div className="detail-media">
          <Pill size={82} />
          <div className="thumb-row"><span /><span /><span /><span /></div>
        </div>
        <div className="detail-info">
          <p className="breadcrumb">{getCategoryLabel(product.category)} <ChevronRight size={14} /> {product.name}</p>
          <h1>{product.name}</h1>
          <p className="brand-line">{product.brand}</p>
          <p>{product.description}</p>
          <strong className="detail-price">{formatCurrency(product.price)}</strong>
          <div className="quantity-control">
            <span>Quantidade</span>
            <button type="button" aria-label="Diminuir quantidade" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
            <strong>{quantity}</strong>
            <button type="button" aria-label="Aumentar quantidade" onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
          </div>
          <button className="primary-action" type="button" onClick={() => onAdd(product, quantity)}>
            Adicionar ao carrinho
          </button>
          <div className="delivery-note"><Bike size={18} /> {pharmacy.name} entrega em {pharmacy.deliveryTime}</div>
        </div>
      </section>
    </main>
  );
}

function CartPage({ cart, summary, onNavigate, onQuantity, onRemove }) {
  const pharmaciesInCart = new Set(cart.map((item) => item.pharmacyId)).size;

  return (
    <main className="page-shell cart-layout">
      <section>
        <h1>Carrinho de compras</h1>
        {cart.length > 0 && (
          <p className="cart-context">
            {pharmaciesInCart > 1
              ? `${pharmaciesInCart} farmácias no pedido. O frete é somado por farmácia.`
              : 'Pedido concentrado em uma farmácia para entrega mais simples.'}
          </p>
        )}
        <div className="cart-list">
          {cart.length === 0 ? (
            <div className="empty-state">
              <ShoppingCart size={38} />
              <h2>Seu carrinho está vazio</h2>
              <p>Adicione remédios e itens de cuidado para continuar.</p>
              <button type="button" onClick={() => onNavigate('catalog')}>Buscar produtos</button>
            </div>
          ) : (
            cart.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-thumb"><Pill size={22} /></div>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
                <strong>{formatCurrency(item.price)}</strong>
                <div className="quantity-control small">
                  <button type="button" aria-label={`Diminuir quantidade de ${item.name}`} onClick={() => onQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                  <span>{item.quantity}</span>
                  <button type="button" aria-label={`Aumentar quantidade de ${item.name}`} onClick={() => onQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                </div>
                <strong>{formatCurrency(item.price * item.quantity)}</strong>
                <button className="trash" type="button" aria-label={`Remover ${item.name}`} onClick={() => onRemove(item.id)}><Trash2 size={17} /></button>
              </article>
            ))
          )}
        </div>
        <div className="trust-row">
          <span><Bike /> Entrega rápida</span>
          <span><ShieldCheck /> Pagamento seguro</span>
          <span><CheckCircle2 /> Produtos originais</span>
        </div>
      </section>
      <OrderSummary summary={summary} disabled={cart.length === 0} buttonLabel="Finalizar compra" onClick={() => onNavigate('checkout')} />
    </main>
  );
}

function CheckoutPage({ cart, summary, deliveryMethod, setDeliveryMethod }) {
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (orderPlaced) {
    return (
      <main className="page-shell">
        <section className="success-panel">
          <CheckCircle2 size={52} />
          <p>Pedido confirmado</p>
          <h1>Sua farmácia já recebeu a solicitação.</h1>
          <span>Resumo: {summary.itemCount} itens, total {formatCurrency(summary.total)}.</span>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell checkout-layout">
      <section className="checkout-form">
        <h1>Finalizar compra</h1>
        <fieldset>
          <legend>1. Endereço de entrega</legend>
          <div className="form-grid">
            <label>CEP<input placeholder="00000-000" /></label>
            <label>Endereço<input placeholder="Rua, número, complemento" /></label>
            <label>Bairro<input placeholder="Centro" /></label>
            <label>Cidade / Estado<input placeholder="São Paulo / SP" /></label>
          </div>
        </fieldset>
        <fieldset>
          <legend>2. Forma de entrega</legend>
          <label className="radio-card"><input type="radio" name="delivery" checked={deliveryMethod === 'fast'} onChange={() => setDeliveryMethod('fast')} /> Entrega rápida <small>Receba em até 2h</small><span>{formatCurrency(summary.delivery)}</span></label>
          <label className="radio-card"><input type="radio" name="delivery" checked={deliveryMethod === 'scheduled'} onChange={() => setDeliveryMethod('scheduled')} /> Entrega agendada <small>Escolha uma janela</small><span>{formatCurrency(0)}</span></label>
        </fieldset>
        <fieldset>
          <legend>3. Pagamento</legend>
          <label className="radio-card"><input type="radio" name="payment" defaultChecked /> <CreditCard size={17} /> Cartão de crédito</label>
          <label className="radio-card"><input type="radio" name="payment" /> Pix</label>
          <label className="radio-card"><input type="radio" name="payment" /> Boleto bancário</label>
        </fieldset>
      </section>
      <OrderSummary summary={summary} disabled={cart.length === 0} buttonLabel="Confirmar pedido" onClick={() => setOrderPlaced(true)} />
    </main>
  );
}

function OrderSummary({ summary, disabled, buttonLabel, onClick }) {
  return (
    <aside className="summary-card">
      <h2>Resumo do pedido</h2>
      <div><span>Itens</span><strong>{summary.itemCount}</strong></div>
      <div><span>Subtotal</span><strong>{formatCurrency(summary.subtotal)}</strong></div>
      <div><span>Entrega</span><strong>{formatCurrency(summary.delivery)}</strong></div>
      <div className="total"><span>Total</span><strong>{formatCurrency(summary.total)}</strong></div>
      <button type="button" disabled={disabled} onClick={onClick}>{buttonLabel}</button>
    </aside>
  );
}

function AccountPage({ authMode, accountName, setAuthMode, onSubmit }) {
  const isLogin = authMode === 'login';

  return (
    <main className="page-shell account-page">
      <section className="auth-card" aria-labelledby="account-title">
        <div className="auth-intro">
          <span>Minha conta</span>
          <h1 id="account-title">{isLogin ? 'Entrar na conta' : 'Criar conta'}</h1>
          <p>{isLogin ? 'Acesse para acompanhar pedidos e acelerar seu checkout.' : 'Cadastre-se para salvar seus dados e receber ofertas da farmácia.'}</p>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Escolha entre entrar ou criar conta">
          <button type="button" className={isLogin ? 'active' : ''} onClick={() => setAuthMode('login')}>Entrar</button>
          <button type="button" className={!isLogin ? 'active' : ''} onClick={() => setAuthMode('register')}>Criar conta</button>
        </div>

        <form className="auth-form" onSubmit={(event) => onSubmit(event, authMode)}>
          {!isLogin && (
            <label>
              Nome completo
              <input name="name" type="text" autoComplete="name" placeholder="Maria Silva" required={!isLogin} />
            </label>
          )}
          <label>
            E-mail
            <input name="email" type="email" autoComplete="email" placeholder="voce@email.com" required />
          </label>
          {!isLogin && (
            <label>
              Telefone
              <input name="phone" type="tel" autoComplete="tel" placeholder="(11) 99999-9999" required={!isLogin} />
            </label>
          )}
          <label>
            Senha
            <input name="password" type="password" autoComplete={isLogin ? 'current-password' : 'new-password'} placeholder="Digite sua senha" required />
          </label>
          <button type="submit">{isLogin ? 'Entrar' : 'Criar conta'}</button>
        </form>
      </section>
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('medicamentos');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [sortBy, setSortBy] = useState('delivery');
  const [fastOnly, setFastOnly] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('fast');
  const [authMode, setAuthMode] = useState('login');
  const [accountName, setAccountName] = useState('');

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesCategory = getProductsForCategory(products, selectedCategory).some((item) => item.id === product.id);
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery = !normalizedQuery || `${product.name} ${product.brand}`.toLowerCase().includes(normalizedQuery);
      const pharmacy = getPharmacy(product.pharmacyId);
      const deliveryMinutes = Number(pharmacy.deliveryTime.split('-')[0]);
      return matchesCategory && matchesQuery && (!fastOnly || deliveryMinutes <= 35);
    });

    return result.sort((first, second) => {
      if (sortBy === 'price') return first.price - second.price;
      if (sortBy === 'rating') return getPharmacy(second.pharmacyId).rating - getPharmacy(first.pharmacyId).rating;
      return Number(getPharmacy(first.pharmacyId).deliveryTime.split('-')[0]) - Number(getPharmacy(second.pharmacyId).deliveryTime.split('-')[0]);
    });
  }, [fastOnly, query, selectedCategory, sortBy]);

  const deliveryFeesByPharmacy = Object.fromEntries(pharmacies.map((pharmacy) => [pharmacy.id, pharmacy.deliveryFee]));
  const delivery = cart.length && deliveryMethod === 'fast' ? getDeliveryTotal(cart, deliveryFeesByPharmacy) : 0;
  const summary = getCartSummary(cart, delivery);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [page]);

  const addProduct = (product, quantity = 1) => {
    setCart((currentCart) => addToCart(currentCart, product, quantity));
    setPage('cart');
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setPage('detail');
  };

  const submitAccount = (event, mode) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || 'cliente@email.com');
    const name = mode === 'register' ? String(form.get('name') || 'Cliente') : email.split('@')[0];
    setAccountName(name.trim() || 'Cliente');
    setPage('home');
  };

  return (
    <div>
      <Header accountName={accountName} activePage={page} cartCount={summary.itemCount} onNavigate={setPage} query={query} setQuery={setQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      {page === 'home' && (
        <HomePage
          featuredProducts={products}
          onAdd={addProduct}
          onOpen={openProduct}
          onNavigate={setPage}
        />
      )}
      {page === 'catalog' && (
        <CatalogPage
          filteredProducts={filteredProducts}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onAdd={addProduct}
          onOpen={openProduct}
          sortBy={sortBy}
          setSortBy={setSortBy}
          fastOnly={fastOnly}
          setFastOnly={setFastOnly}
          query={query}
          setQuery={setQuery}
        />
      )}
      {page === 'detail' && selectedProduct && <ProductDetail product={selectedProduct} onAdd={addProduct} onBack={() => setPage('catalog')} />}
      {page === 'cart' && (
        <CartPage
          cart={cart}
          summary={summary}
          onNavigate={setPage}
          onQuantity={(id, quantity) => setCart((currentCart) => updateCartQuantity(currentCart, id, quantity))}
          onRemove={(id) => setCart((currentCart) => removeFromCart(currentCart, id))}
        />
      )}
      {page === 'checkout' && <CheckoutPage cart={cart} summary={summary} deliveryMethod={deliveryMethod} setDeliveryMethod={setDeliveryMethod} />}
      {page === 'account' && <AccountPage authMode={authMode} accountName={accountName} setAuthMode={setAuthMode} onSubmit={submitAccount} />}
    </div>
  );
}
