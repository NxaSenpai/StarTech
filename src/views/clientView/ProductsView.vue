<template>
  <div class="products-page">
    <Header />

    <div class="top-section">
        <section class="page-header">
          <div class="container">
            <h1 class="page-title">All Products</h1>
            <p class="page-description">
              Browse our complete collection of premium electronics and home appliances
            </p>
          </div>
        </section>

        <section class="filters-section">
          <div class="container">
            <div class="filters-wrapper">
              <div class="search-box">
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="Search products..." 
                  class="search-input"
                />
              </div>
              
              <div class="filter-controls">
                <select v-model="categoryFilter" class="filter-select">
                  <option value="all">All Categories</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>

                <select v-model="statusFilter" class="filter-select">
                  <option value="all">All Products</option>
                  <option value="available">Available Only</option>
                  <option value="unavailable">Out of Stock</option>
                </select>

                <select v-model="sortBy" class="filter-select">
                  <option value="default">Default Sorting</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            <div class="results-info">
              <p>Showing <strong>{{ filteredProducts.length }}</strong> of <strong>{{ products.length }}</strong> products</p>
            </div>
          </div>
        </section>

    </div>
    
    <main class="main-content">
      <section class="products-section">
        <div class="container">
          <div v-if="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading products...</p>
          </div>

          <div v-else-if="error" class="error-state">
            <div class="error-content">
              <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3>Failed to load products</h3>
              <p>{{ error }}</p>
              <button @click="fetchProducts" class="retry-btn">Try Again</button>
            </div>
          </div>

          <div v-else-if="filteredProducts.length === 0" class="empty-state">
            <div class="empty-content">
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          </div>

          <div v-else class="products-grid">
            <div 
              v-for="product in filteredProducts"
              :key="product.id"
              class="product-wrapper"
              :class="{ 'out-of-stock': !product.isAvailable }"
            >
              <!-- Discount Badge (only show if product has promotion) -->
              <div v-if="product.hasPromotion" class="discount-badge">
                -{{ product.discount.toFixed(0) }}%
              </div>
              
              <!-- Out of Stock Badge -->
              <div v-if="!product.isAvailable" class="stock-badge out-of-stock-badge">
                Out of Stock
              </div>
              
              <!-- Low Stock Badge (only if available and low stock) -->
              <div v-else-if="product.inStock < 10" class="stock-badge low-stock-badge">
                Only {{ product.inStock }} left
              </div>

              <ProductCard
                :title="product.name"
                :price="product.displayPrice"
                :oldPrice="product.originalPrice"
                :rating="4.5"
                :reviewCount="128"
                :isOnSale="product.hasPromotion && product.isAvailable"
                :image="product.imageSrc"
                :productId="product.id"
                @add-to-cart="addToCart(product)"
              />
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';
import ProductCard from '@/components/productCard.vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default {
  name: 'ProductsView',
  components: {
    Header,
    Footer,
    ProductCard
  },
  data() {
    return {
      searchQuery: '',
      categoryFilter: 'all',
      sortBy: 'default',
      statusFilter: 'all',
      isLoading: false,
      error: null,
      products: [],
      promotions: [], // Add promotions array
      categories: []
    };
  },
  computed: {
    filteredProducts() {
      let filtered = [...this.products];
      
      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        );
      }
      
      // Filter by category
      if (this.categoryFilter !== 'all') {
        filtered = filtered.filter(product => 
          product.category === this.categoryFilter
        );
      }
      
      // Filter by availability status
      if (this.statusFilter === 'available') {
        filtered = filtered.filter(product => product.inStock > 0);
      } else if (this.statusFilter === 'unavailable') {
        filtered = filtered.filter(product => product.inStock === 0);
      }
      
      // Sort products
      if (this.sortBy === 'price-low') {
        filtered.sort((a, b) => a.displayPrice - b.displayPrice);
      } else if (this.sortBy === 'price-high') {
        filtered.sort((a, b) => b.displayPrice - a.displayPrice);
      } else if (this.sortBy === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.sortBy === 'newest') {
        filtered.sort((a, b) => {
          const dateA = new Date(a.stockAt || 0);
          const dateB = new Date(b.stockAt || 0);
          return dateB - dateA;
        });
      }
      
      return filtered;
    }
  },
  methods: {
    async fetchProducts() {
      this.isLoading = true;
      this.error = null;
      
      try {
        // Fetch products
        const productsResponse = await axios.get(`${API_URL}/products`);
        
        // Fetch active promotions
        const promotionsResponse = await axios.get(`${API_URL}/promotions/active`);
        this.promotions = promotionsResponse.data;
        
        console.log('Active promotions:', this.promotions);
        
        // Map products and apply promotions
        this.products = productsResponse.data.map(product => {
          const productId = product._id;
          
          // Find if this product has an active promotion
          const promotion = this.promotions.find(promo => 
            promo.product_id === productId || promo.productId === productId
          );
          
          let displayPrice = product.price;
          let originalPrice = null;
          let discount = 0;
          let hasPromotion = false;
          
          if (promotion) {
            // Product has a promotion
            originalPrice = product.price;
            displayPrice = promotion.sale_price || promotion.salePrice || product.price;
            discount = promotion.discount || promotion.discountPercentage || 0;
            hasPromotion = true;
            
            console.log(`Product "${product.name}" has promotion:`, {
              originalPrice,
              displayPrice,
              discount
            });
          }
          
          return {
            id: productId,
            name: product.name,
            brand: product.brand,
            category: product.category,
            supplier: product.supplier,
            inStock: product.inStock || 0,
            price: product.price, // Keep original price
            displayPrice: displayPrice, // Price to show (discounted or original)
            originalPrice: originalPrice, // Only set if there's a promotion
            discount: discount,
            hasPromotion: hasPromotion,
            status: product.status,
            imageSrc: product.imageSrc || '/placeholder.png',
            description: product.description || '',
            stockAt: product.stockAt,
            isAvailable: (product.inStock || 0) > 0
          };
        });
        
        // Extract unique categories
        const uniqueCategories = [...new Set(this.products.map(p => p.category))];
        this.categories = uniqueCategories.sort();
        
        console.log('Products loaded:', this.products.length);
        console.log('Products with promotions:', this.products.filter(p => p.hasPromotion).length);
        console.log('Available products:', this.products.filter(p => p.isAvailable).length);
        console.log('Unavailable products:', this.products.filter(p => !p.isAvailable).length);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        this.error = error.response?.data?.message || 'Unable to connect to server. Please try again later.';
      } finally {
        this.isLoading = false;
      }
    },
    
    addToCart(product) {
      // Check if product is available before adding to cart
      if (!product.isAvailable) {
        alert(`Sorry, "${product.name}" is currently out of stock.`);
        return;
      }

      // Get existing cart from localStorage
      let cart = [];
      try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
          cart = JSON.parse(cartData);
        }
      } catch (error) {
        console.error('Error reading cart:', error);
      }
      
      // Check if product already exists in cart
      const existingIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingIndex !== -1) {
        // Check if we can add more
        if (cart[existingIndex].qty >= product.inStock) {
          alert(`Cannot add more. Only ${product.inStock} items available in stock.`);
          return;
        }
        // Increase quantity if already in cart
        cart[existingIndex].qty = (cart[existingIndex].qty || 1) + 1;
        alert(`Increased quantity of "${product.name}" in cart!`);
      } else {
        // Add new product to cart with the display price (discounted or original)
        cart.push({
          id: product.id,
          name: product.name,
          image: product.imageSrc,
          price: product.displayPrice, // Use display price (discounted if available)
          originalPrice: product.originalPrice, // Store original price if there's a discount
          qty: 1,
          maxStock: product.inStock
        });
        alert(`Added "${product.name}" to cart!`);
      }
      
      // Save updated cart to localStorage
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Emit custom event for cart update
        window.dispatchEvent(new CustomEvent('cart-updated', { 
          detail: { itemCount: cart.reduce((sum, item) => sum + item.qty, 0) }
        }));
      } catch (error) {
        console.error('Error saving cart:', error);
        alert('Failed to add item to cart. Please try again.');
      }
    }
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.fetchProducts();
    console.log('ProductsView mounted - fetching from backend');
  }
};
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.main-content {
  width: 100%;
  flex: 1;
  position: relative;
}

.container {
  width: 100%;
  margin: 0 auto;   
  padding: 0 20px;
}

.top-section {
  position: sticky;
  top: 128px;
  z-index: 100;
  background: #f8fafc;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.page-header {
  padding: 20px 0 10px;
  text-align: center;
  background: #f8fafc;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 12px;
}

.page-description {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
}

.filters-section {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 0;
  margin-bottom: 0;
}

.filters-wrapper {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  color: black; 
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-controls {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  color: #475569;
}

.filter-select:hover {
  border-color: #cbd5e1;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.results-info {
  color: #64748b;
  font-size: 14px;
}

.results-info strong {
  color: #1e293b;
  font-weight: 600;
}

.products-section {
  padding: 40px 0 60px;
  background: #f8fafc;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #64748b;
  font-size: 16px;
}

.error-state {
  padding: 80px 20px;
}

.error-content {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.error-content svg {
  color: #ef4444;
  margin-bottom: 24px;
}

.error-content h3 {
  font-size: 1.5rem;
  color: #1e293b;
  margin: 0 0 12px;
}

.error-content p {
  color: #64748b;
  font-size: 1rem;
  margin: 0 0 24px;
}

.retry-btn {
  padding: 12px 32px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.empty-state {
  padding: 80px 20px;
}

.empty-content {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.empty-content h3 {
  font-size: 1.5rem;
  color: #1e293b;
  margin: 0 0 12px;
}

.empty-content p {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

.product-wrapper {
  position: relative;
}

.product-wrapper.out-of-stock {
  opacity: 0.7;
}

.discount-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ef4444;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  z-index: 10;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

.stock-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  z-index: 10;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.out-of-stock-badge {
  background: #ef4444;
  color: white;
}

.low-stock-badge {
  background: #f59e0b;
  color: white;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 28px;
  }
}

@media (max-width: 768px) {
  .top-section {
    top: 100px;
  }
  
  .page-title {
    font-size: 2rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .filters-wrapper {
    flex-direction: column;
  }

  .search-box {
    min-width: 100%;
  }

  .filter-controls {
    width: 100%;
  }

  .filter-select {
    flex: 1;
    min-width: 140px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .top-section {
    top: 100px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }

  .page-header {
    padding: 30px 0 20px;
  }

  .filter-controls {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }
}
</style>