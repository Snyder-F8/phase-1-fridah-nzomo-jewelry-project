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

    // CRUD: Read (Fetch all)
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

    // Render products (uses forEach)
    function renderProducts(items) {
        productGrid.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <h4>${item.title}</h4>
                <p>$${item.price.toFixed(2)}</p>
                <button onclick="addToCart(${item.id})">Add to Cart</button>
                <button class="view-details" onclick="viewDetails(${item.id})">View Details</button>
            `;
            productGrid.appendChild(card);
        });
    }

    // Search (uses filter)
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = products.filter(item => item.title.toLowerCase().includes(query));
        renderProducts(filtered);
    });

    // Cart: Add
    window.addToCart = function(id) {
        const item = products.find(p => p.id === id);
        const cartItem = cart.find(c => c.id === id);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCart();
    };

    // Cart: Update display (uses reduce and forEach)
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span>${item.title} (x${item.quantity})</span>
                <span>$${ (item.price * item.quantity).toFixed(2) }</span>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            `;
            cartItems.appendChild(div);
            total += item.price * item.quantity;
        });
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }

    // Cart: Remove item
    window.removeFromCart = function(id) {
        cart = cart.filter(c => c.id !== id);
        updateCart();
    };

    // Clear cart
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        updateCart();
    });

    // CRUD: View Details (Read one, with Edit/Delete)
    window.viewDetails = async function(id) {
        const item = products.find(p => p.id === id) || await fetchOne(id);
        const detailContent = document.getElementById('product-detail');
        detailContent.innerHTML = `
            <div class="product-detail-content">
                <img src="${item.image}" alt="${item.title}">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <p>Price: $${item.price.toFixed(2)}</p>
                <p>Category: ${item.category} | Stock: ${item.stock}</p>
                <button onclick="addToCart(${item.id})">Add to Cart</button>
                <div class="cart-buttons">
                    <button id="edit-btn">Edit</button>
                    <button id="delete-btn">Delete</button>
                </div>
                <div id="edit-form-container"></div>
            </div>
        `;
        productModal.style.display = 'block';

        // Edit button -> Show form (Update prep)
        document.getElementById('edit-btn').addEventListener('click', () => showEditForm(item));

        // Delete button (CRUD: Delete)
        document.getElementById('delete-btn').addEventListener('click', () => deleteItem(id));
    };

    // Helper: Fetch one item
    async function fetchOne(id) {
        const response = await fetch(`${API_BASE}/${id}`);
        return await response.json();
    }

    // Show Edit Form (CRUD: Update)
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

    // CRUD: Update
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
            fetchProducts(); // Refresh list
        } catch (error) {
            console.error(error);
            alert('Update error');
        }
    }

    // CRUD: Delete
    async function deleteItem(id) {
        if (!confirm('Delete this item?')) return;
        try {
            const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Delete failed');
            alert('Item deleted!');
            productModal.style.display = 'none';
            fetchProducts(); // Refresh
        } catch (error) {
            console.error(error);
            alert('Delete error');
        }
    }

    // CRUD: Create (Add New)
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
            fetchProducts(); // Refresh
        } catch (error) {
            console.error(error);
            alert('Add error');
        }
    });

    // Modal closes (all modals)
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

    // Scroll to top
    window.addEventListener('scroll', () => {
        scrollToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    scrollToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Initial load
    fetchProducts();
});