# Atelier Jewels — Exquisite Jewelry Collection  

Atelier Jewels is a **fully functional jewelry e-commerce web application** built using **HTML, CSS, and JavaScript**.  
It features dynamic product rendering, cart management, product CRUD operations (Create, Read, Update, Delete), and seamless integration with a **JSON Server** backend for data persistence.  

This project demonstrates front-end and basic REST API integration skills in a clean, modern, and user-friendly design.  

---

## Features  

###  Shop Functionality  
- Displays a beautiful, responsive jewelry collection fetched from a JSON Server.  
- Allows users to **add items to the cart**, **view details**, **update**, and **delete products**.  

###  Cart Management  
- Persistent cart data saved in `localStorage`.  
- Dynamic calculation of **subtotal**, **VAT (16%)**, and **total price**.  
- Ability to **remove individual items** or **clear the entire cart**.  

###  Product Management (Admin CRUD)  
- Add new jewelry items using a modal form.  
- Edit or delete existing items directly from the product detail modal.  
- Updates are reflected instantly through API calls.  

###  Search & Filter  
- Real-time search bar for filtering jewelry items by title.  

###  Smooth Navigation  
- Smooth scrolling for navigation links.  
- Scroll-to-top button for improved user experience.  

###  Testimonials & About Section  
- Static sections highlighting customer reviews and brand story.  

---

##  Technologies Used  

| Technology | Purpose |
|-------------|----------|
| **HTML5** | Page structure and content |
| **CSS3** | Styling and responsive design |
| **JavaScript (ES6)** | Interactivity and dynamic DOM manipulation |
| **JSON Server** | Mock REST API for CRUD operations |
| **LocalStorage** | Persistent cart data across sessions |
| **Google Fonts (Playfair Display, Lato)** | Elegant typography |

---

##  Project Setup  

### 1. Clone the Repository  
```bash
git clone <repository-url>
cd atelier-jewels
```

### 2. Install JSON-Server (for backend):
```bash
npm install -g json-server
```

### 3. Create a db.json File: Create a db.json file in the project root with the following structure:
```json
{
  "jewelries": [
    {
      "id": 1,
      "title": "Emerald Elegance Necklace",
      "description": "A stunning necklace with emerald gemstones.",
      "price": 10000.00,
      "image": "https://example.com/emerald-necklace.jpg",
      "category": "necklace",
      "stock": 10
    }
    // Add more products as needed
  ]
}
```

### 4. Start JSON-Server:
```bash
json-server --watch db.json --port 3000
```

### 5. Verify API Connection
- Ensure that your script.js uses the same API endpoint:
```javascript
const API_BASE = 'http://localhost:3000/jewelries';
```

### 6. Launch the Frontend
- Open the index.html file directly in your browser or run a live server:
```bash
npx live-server
```

## Folder Structure
```plain
atelier-jewels/
├── index.html       # Main HTML file
├── style.css        # CSS styles
├── script.js        # JavaScript logic
├── db.json          # JSON-Server data
└── README.md        # This file
```

## Key Functionalities
- Fetch Products
Fetches data from http://localhost:3000/jewelries and dynamically generates product cards.
- Add to Cart
Adds products to a persistent cart saved in localStorage.
- Edit & Delete Products
Uses PATCH and DELETE requests to update the JSON server.
- Add New Jewelry
Sends a POST request to add new items through the modal form.
- Search
Filters displayed jewelry by title in real-time.

## API Endpoints.

| Method     | Endpoint         | Description                 |
| ---------- | ---------------- | --------------------------- |
| **GET**    | `/jewelries`     | Fetch all jewelry items     |
| **GET**    | `/jewelries/:id` | Fetch a single jewelry item |
| **POST**   | `/jewelries`     | Add a new jewelry item      |
| **PATCH**  | `/jewelries/:id` | Update jewelry details      |
| **DELETE** | `/jewelries/:id` | Delete a jewelry item       |

## Usage
- Browsing Products: View the product catalog in the "Shop" section. Use the search bar to filter items by title.
- Adding to Cart: Click "Add to Cart" on a product card to add it to the cart. View cart details via the "Cart" link in the header.
- Viewing Details: Click "View Details" to see product information, including description, category, and stock.
- Managing Products: Click "Add New Jewelry" in the header to add a new product. In the product details modal, use "Edit" or "Delete" to modify or remove products.
- Cart Calculations: The cart displays subtotal, VAT (16%), and total. Items can be removed individually or cleared entirely.

## Future Enhancements
- Integrate a real backend (Node.js + Express or Python Flask).
- Add authentication for admin access.
- Include image uploads instead of URL inputs.
- Implement payment gateway simulation.

## Author

Fridah Nzomo.
Software Developer & Data Scientist
💼 Passionate about building elegant, data-driven web solutions.


## License

This project is open-source and available under the MIT License.




