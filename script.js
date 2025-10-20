document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const searchInput = document.getElementById('search-input');
    const cartCount = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const productModal = document.getElementById('product-modal');
    const addModal = document.getElementById('add-modal');
    const addForm = document.getElementById('add-form');
    const addNewBtn = document.getElementById('add-new-btn');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const clearCartBtn = document.getElementById('clear-cart');
    const scrollToTop = document.getElementById('scroll-to-top');

    let products = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const API_BASE = 'http://localhost:3000/jewelries'; // json-server base

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Fetch products
    async function fetchProducts() {
        try {
            const response = await fetch(API_BASE);
            if (!response.ok) throw new Error('Failed to fetch');
            products = await response.json();
            renderProducts(products);
            updateCart();
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Error loading products. Check server.');
        }
    }

    // Render product cards
    function renderProducts(items) {
        productGrid.innerHTML = '';
        items.forEach(item => {
            if (!item.id || !item.title || !item.price) return;
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <h4>${item.title}</h4>
                <p>KSH ${parseFloat(item.price).toFixed(2)}</p>
                <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
                <button class="view-details" data-id="${item.id}">View Details</button>
            `;
            productGrid.appendChild(card);
        });

        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => addToCart(e.target.dataset.id));
        });

        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', (e) => viewDetails(e.target.dataset.id));
        });
    }

    // Search filter
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = products.filter(item => item.title.toLowerCase().includes(query));
        renderProducts(filtered);
    });

    // Add to cart
    window.addToCart = function(id) {
        id = parseInt(id);
        const item = products.find(p => parseInt(p.id) === id);
        if (!item) {
            alert("Product not found. Try refreshing the page.");
            return;
        }

        const cartItem = cart.find(c => c.id === item.id);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({
                id: item.id,
                title: item.title,
                price: parseFloat(item.price),
                quantity: 1
            });
        }

        updateCart();
    };

    // Updated Cart Display with Subtotal, VAT, and Total
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartItems.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span>${item.title} (x${item.quantity})</span>
                <span>KSH ${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-btn" data-id="${item.id}"
                    style="background-color:red;color:white;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;">
                    Remove
                </button>
            `;
            cartItems.appendChild(div);
            subtotal += item.price * item.quantity;
        });

        const vat = subtotal * 0.16;
        const total = subtotal + vat;

        cartTotal.innerHTML = `
            <p>Subtotal: <strong>KSH ${subtotal.toFixed(2)}</strong></p>
            <p>VAT (16%): <strong>KSH ${vat.toFixed(2)}</strong></p>
            <p><strong>Total: KSH ${total.toFixed(2)}</strong></p>
        `;

        // Remove button (event delegation)
        cartItems.onclick = function(e) {
            const btn = e.target.closest('.remove-btn');
            if (!btn) return;
            const id = parseInt(btn.getAttribute('data-id'));
            if (!isNaN(id)) removeFromCart(id);
        };
    }

    // Completely remove an item (regardless of quantity)
    function removeFromCart(id) {
        const numericId = parseInt(id);
        if (isNaN(numericId)) return;
        cart = cart.filter(c => parseInt(c.id) !== numericId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    // Clear all items
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        updateCart();
    });

    // View product details
    window.viewDetails = async function(id) {
        id = parseInt(id);
        const item = products.find(p => parseInt(p.id) === id) || await fetchOne(id);
        const detailContent = document.getElementById('product-detail');
        detailContent.innerHTML = `
            <div class="product-detail-content">
                <img src="${item.image}" alt="${item.title}">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <p>Price: KSH ${item.price.toFixed(2)}</p>
                <p>Category: ${item.category} | Stock: ${item.stock}</p>
                <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
                <div class="cart-buttons">
                    <button id="edit-btn">Edit</button>
                    <button id="delete-btn">Delete</button>
                </div>
                <div id="edit-form-container"></div>
            </div>
        `;
        productModal.style.display = 'block';

        document.querySelector('.add-to-cart').addEventListener('click', () => addToCart(item.id));
        document.getElementById('edit-btn').addEventListener('click', () => showEditForm(item));
        document.getElementById('delete-btn').addEventListener('click', () => deleteItem(id));
    };

    async function fetchOne(id) {
        const response = await fetch(`${API_BASE}/${id}`);
        return await response.json();
    }

    // Edit product
    function showEditForm(item) {
        const container = document.getElementById('edit-form-container');
        container.innerHTML = `
            <form class="edit-form" data-id="${item.id}">
                <input type="text" value="${item.title}" id="edit-title">
                <textarea id="edit-description">${item.description}</textarea>
                <input type="number" value="${item.price}" id="edit-price">
                <input type="text" value="${item.image}" id="edit-image">
                <input type="text" value="${item.category}" id="edit-category">
                <input type="number" value="${item.stock}" id="edit-stock">
                <button type="submit">Save Changes</button>
            </form>
        `;
        container.querySelector('.edit-form').addEventListener('submit', handleUpdate);
    }

    async function handleUpdate(e) {
        e.preventDefault();
        const form = e.target;
        const id = form.dataset.id;
        const updatedData = {
            title: form.querySelector('#edit-title').value,
            description: form.querySelector('#edit-description').value,
            price: parseFloat(form.querySelector('#edit-price').value),
            image: form.querySelector('#edit-image').value,
            category: form.querySelector('#edit-category').value,
            stock: parseInt(form.querySelector('#edit-stock').value)
        };
        try {
            const response = await fetch(`${API_BASE}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) throw new Error('Update failed');
            alert('Item updated!');
            productModal.style.display = 'none';
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert('Update error');
        }
    }

    // Delete item
    async function deleteItem(id) {
        if (!confirm('Delete this item?')) return;
        try {
            const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Delete failed');
            alert('Item deleted!');
            productModal.style.display = 'none';
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert('Delete error');
        }
    }

    // Add new product
    addNewBtn.addEventListener('click', () => addModal.style.display = 'block');
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newItem = {
            title: document.getElementById('new-title').value,
            description: document.getElementById('new-description').value,
            price: parseFloat(document.getElementById('new-price').value),
            image: document.getElementById('new-image').value,
            category: document.getElementById('new-category').value,
            stock: parseInt(document.getElementById('new-stock').value)
        };
        try {
            const response = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            if (!response.ok) throw new Error('Add failed');
            alert('New item added!');
            addModal.style.display = 'none';
            addForm.reset();
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert('Add error');
        }
    });

    // Close modals
    document.querySelectorAll('.close').forEach(close => {
        close.addEventListener('click', () => {
            cartModal.style.display = 'none';
            productModal.style.display = 'none';
            addModal.style.display = 'none';
        });
    });

    // Open cart
    document.querySelector('.cart-link').addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'block';
        updateCart();
    });

    // Scroll-to-top
    window.addEventListener('scroll', () => {
        scrollToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    scrollToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Initialize
    fetchProducts();
});