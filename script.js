// Dados dos Produtos
const products = [
    {
        id: 1,
        name: "Ração Premium para Cães",
        price: 89.90,
        category: "cachorro",
        description: "Ração completa e balanceada para cães adultos",
        image: ""
    },
    {
        id: 2,
        name: "Ração para Gatos Filhotes",
        price: 65.00,
        category: "gato",
        description: "Nutrição especial para gatos até 12 meses",
        image: ""
    },
    {
        id: 3,
        name: "Brinquedo Interativo",
        price: 35.90,
        category: "acessorio",
        description: "Brinquedo que estimula a inteligência do pet",
        image: ""
    },
    {
        id: 4,
        name: "Cama Ortopédica Pet",
        price: 149.90,
        category: "cachorro",
        description: "Conforto e apoio para todas as idades",
        image: ""
    },
    {
        id: 5,
        name: "Coleira Ajustável",
        price: 29.90,
        category: "acessorio",
        description: "Resistente e confortável para passeios",
        image: ""
    },
    {
        id: 6,
        name: "Arranhador para Gatos",
        price: 79.90,
        category: "gato",
        description: "Protege seus móveis e diverte seu gato",
        image: ""
    },
    {
        id: 7,
        name: "Comedouro Automático",
        price: 199.90,
        category: "acessorio",
        description: "Programa até 4 refeições por dia",
        image: ""
    },
    {
        id: 8,
        name: "Shampoo Pet Hipoalergênico",
        price: 24.90,
        category: "cachorro",
        description: "Suave e seguro para pele sensível",
        image: ""
    },
    {
        id: 9,
        name: "Ração para Pássaros",
        price: 18.90,
        category: "passaro",
        description: "Mistura nutritiva com sementes selecionadas",
        image: ""
    },
    {
        id: 10,
        name: "Casinha para Cachorros",
        price: 299.90,
        category: "cachorro",
        description: "Resistente e impermeável",
        image: ""
    },
    {
        id: 11,
        name: "Caixa de Areia para Gatos",
        price: 45.90,
        category: "gato",
        description: "Com sistema anti-odor",
        image: ""
    },
    {
        id: 12,
        name: "Guia Retrátil 5m",
        price: 54.90,
        category: "acessorio",
        description: "Liberdade com segurança nos passeios",
        image: ""
    }
];

// Estado da aplicação
let cart = [];
let currentCategory = 'todos';
let filteredProducts = [...products];

// Ícones para categorias
const categoryIcons = {
    cachorro: 'fa-dog',
    gato: 'fa-cat',
    passaro: 'fa-dove',
    acessorio: 'fa-bone'
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    setupEventListeners();
    loadCart();
});

// Renderizar produtos
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #7f8c8d;">Nenhum produto encontrado</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <i class="fas ${categoryIcons[product.category] || 'fa-paw'}"></i>
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Obter nome da categoria
function getCategoryName(category) {
    const names = {
        cachorro: 'Cachorro',
        gato: 'Gato',
        passaro: 'Pássaro',
        acessorio: 'Acessório'
    };
    return names[category] || 'Geral';
}

// Filtrar por categoria
function filterByCategory(category) {
    currentCategory = category;
    
    // Atualizar botões ativos
    document.querySelectorAll('.category-card').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });

    // Filtrar produtos
    if (category === 'todos') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(p => p.category === category);
    }

    renderProducts();
}

// Buscar produtos
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = currentCategory === 'todos' || product.category === currentCategory;
        return matchesSearch && matchesCategory;
    });

    renderProducts();
}

// Adicionar ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    saveCart();
    showNotification('Produto adicionado ao carrinho!');
}

// Remover do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
    renderCart();
}

// Atualizar UI do carrinho
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Renderizar carrinho
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
        cartTotal.textContent = 'R$ 0,00';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')} x ${item.quantity}</div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Salvar carrinho no localStorage
function saveCart() {
    localStorage.setItem('orbitaPetCart', JSON.stringify(cart));
}

// Carregar carrinho do localStorage
function loadCart() {
    const savedCart = localStorage.getItem('orbitaPetCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Limpar carrinho
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Deseja realmente limpar o carrinho?')) {
        cart = [];
        updateCartUI();
        saveCart();
        renderCart();
        showNotification('Carrinho limpo!');
    }
}

// Finalizar pedido
function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const items = cart.map(item => `${item.quantity}x ${item.name}`).join('\n');
    
    const message = `Olá! Gostaria de fazer um pedido:\n\n${items}\n\nTotal: R$ ${total.toFixed(2).replace('.', ',')}`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
}

// Mostrar notificação
function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: var(--shadow);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Configurar event listeners
function setupEventListeners() {
    // Menu mobile
    const menuToggle = document.getElementById('menuToggle');
    const navMobile = document.getElementById('navMobile');
    
    menuToggle.addEventListener('click', () => {
        navMobile.classList.toggle('active');
    });

    // Fechar menu ao clicar em link
    document.querySelectorAll('.nav-mobile .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMobile.classList.remove('active');
        });
    });

    // Busca
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        searchProducts(e.target.value);
    });

    // Categorias
    document.querySelectorAll('.category-card').forEach(btn => {
        btn.addEventListener('click', () => {
            filterByCategory(btn.dataset.category);
        });
    });

    // Carrinho
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
        renderCart();
    });

    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    // Botões do carrinho
    document.getElementById('clearCart').addEventListener('click', clearCart);
    document.getElementById('checkout').addEventListener('click', checkout);

    // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animação de scroll para links ativos
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

