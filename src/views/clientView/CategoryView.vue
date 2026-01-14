<script>
import Footer from '@/components/footer.vue';
import Header from '@/components/header.vue';
import ProductCard from '@/components/productCard.vue';

export default {
  name: 'HomeAppliances',
  components: {
    Header,
    Footer,
    ProductCard
  },
  data() {
    return {
      minPrice: 44,
      maxPrice: 349,
      selectedCategory: 'all',
      sortBy: 'default',
      isLoading: false,
      searchQuery: '',
      
      categories: [
        { name: 'Kitchen appliances', slug: 'kitchen' },
        { name: 'PCs & laptop', slug: 'pc' },
        { name: 'Refrigerator', slug: 'refrigerator' },
        { name: 'Smart home', slug: 'smart' }
      ],
      
      products: [
        {
          id: 1,
          name: '18 lbs Combination Washer Dryer, Sanitize, Allergen, Winterize, Vented Dry - 2021 Model, White',
          price: 309.00,
          originalPrice: 329.00,
          category: 'kitchen',
          sale: true,
          rating: 4,
          reviews: 128,
          img: '/pdetail/aba.png'
        },
        {
          id: 2,
          name: 'Compact Pulsator Washer for Clothes, 9 Cubic ft. Tub, White, BPAB10WH',
          price: 259.00,
          originalPrice: 319.00,
          category: 'kitchen',
          sale: true,
          rating: 4,
          reviews: 95,
          img: '/pdetail/aba.png'
        },
        {
          id: 3,
          name: 'Full-Automatic Compact Washer with Wheels, 1.6 cu. ft, 11 lbs capacity with 8 Wash Programs, Washer',
          price: 279.00,
          originalPrice: 309.00,
          category: 'kitchen',
          sale: true,
          rating: 4,
          reviews: 210,
          img: '/pdetail/aba.png'
        },
        {
          id: 4,
          name: 'Multigroomer All-In-One Trimmer Series 9000, 23 Piece Mens Grooming Kit',
          price: 64.00,
          originalPrice: 149.00,
          category: 'smart',
          sale: true,
          rating: 5,
          reviews: 342,
          img: '/pdetail/aba.png'
        },
        {
          id: 5,
          name: 'Small Space Heat Pump Dryer with Sensor Dry, 12 Preset Machine Cycles, 40 Minute Express Drying',
          price: 349.00,
          originalPrice: null,
          category: 'kitchen',
          sale: false,
          rating: 4,
          reviews: 156,
          img: '/pdetail/aba.png'
        }
      ]
    };
  },
  
  computed: {
    filteredProducts() {
      let filtered = this.products.filter(product => {
        const priceInRange = product.price >= this.minPrice && product.price <= this.maxPrice;
        const categoryMatch = this.selectedCategory === 'all' || product.category === this.selectedCategory;
        const searchMatch = this.searchQuery === '' || 
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        return priceInRange && categoryMatch && searchMatch;
      });

      if (this.sortBy === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (this.sortBy === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (this.sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      return filtered;
    }
  },
  
  methods: {
    viewProduct(productId) {
      this.$router.push(`/pdetails/${productId}`);
    },
    addToCart(product) {
      console.log('Adding to cart:', product);
      alert(`Added "${product.name}" to cart!`);
    }
  },
  
  mounted() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log("HomeAppliances component loaded");
  }
};
</script>

<template>
  <div class="category-page">
    <Header />
    
    <div class="top-section">
      <section class="page-header">
        <div class="container">
          <h1 class="page-title">Browse Category</h1>
        </div>
      </section>

      <section class="filters-section">
        <div class="container">
          <div class="filters-wrapper">
            <div class="search-box">
              <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search products..." 
                class="search-input"
              />
            </div>
            
            <div class="filter-controls">
              <select v-model="selectedCategory" class="filter-select">
                <option value="all">All Categories</option>
                <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">
                  {{ cat.name }}
                </option>
              </select>

              <select v-model="sortBy" class="filter-select">
                <option value="default">Default Sorting</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>

          <div class="results-info">
            <p>Showing <strong>{{ filteredProducts.length }}</strong> products</p>
          </div>
        </div>
      </section>
    </div>

    <main class="main-content">
      <section class="products-section">
        <div class="container">
          <div class="content-grid">
            <!-- Sidebar -->
            <aside class="sidebar">
              <div class="filter-card">
                <h3 class="filter-title">Categories</h3>
                <ul class="category-list">
                  <li 
                    :class="{ active: selectedCategory === 'all' }"
                    @click="selectedCategory = 'all'"
                  >
                    <span class="category-name">All Categories</span>
                    <span class="category-count">{{ products.length }}</span>
                  </li>
                  <li 
                    v-for="cat in categories" 
                    :key="cat.slug"
                    :class="{ active: selectedCategory === cat.slug }"
                    @click="selectedCategory = cat.slug"
                  >
                    <span class="category-name">{{ cat.name }}</span>
                    <span class="category-count">
                      {{ products.filter(p => p.category === cat.slug).length }}
                    </span>
                  </li>
                </ul>
              </div>

              <div class="filter-card">
                <h3 class="filter-title">Filter by Price</h3>
                <div class="price-inputs">
                  <div class="input-group">
                    <label>Min. Price</label>
                    <input 
                      type="number" 
                      v-model.number="minPrice" 
                      placeholder="$44"
                      class="price-input"
                    >
                  </div>
                  <div class="input-group">
                    <label>Max. Price</label>
                    <input 
                      type="number" 
                      v-model.number="maxPrice" 
                      placeholder="$349"
                      class="price-input"
                    >
                  </div>
                </div>
                <div class="price-range">
                  <span class="price-value">${{ minPrice }}</span>
                  <span class="price-separator">-</span>
                  <span class="price-value">${{ maxPrice }}</span>
                </div>
              </div>
            </aside>

            <!-- Products Grid -->
            <div class="products-area">
              <div v-if="isLoading" class="loading-state">
                <div class="spinner"></div>
                <p>Loading products...</p>
              </div>

              <div v-else-if="filteredProducts.length === 0" class="empty-state">
                <div class="empty-content">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search criteria</p>
                </div>
              </div>

              <div v-else class="products-grid">
                <ProductCard
                  v-for="product in filteredProducts"
                  :key="product.id"
                  :title="product.name"
                  :price="product.price"
                  :oldPrice="product.originalPrice"
                  :rating="product.rating"
                  :reviewCount="product.reviews"
                  :isOnSale="product.sale"
                  :image="product.img"
                  :productId="product.id"
                  @add-to-cart="addToCart(product)"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.category-page {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1400px;
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
  padding: 40px 0 20px;
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
  max-width: 600px;
  margin: 0 auto;
}

.filters-section {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 0;
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
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.search-input {
  width: 100%;
  color: black;
  padding: 12px 16px 12px 48px;
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
  flex-wrap: wrap;
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

.main-content {
  flex: 1;
  padding: 40px 0 60px;
}

.content-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  align-items: start;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 220px;
}

.filter-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.filter-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
  color: #64748b;
  font-weight: 500;
}

.category-list li:hover {
  background: #f8fafc;
  color: #3b82f6;
}

.category-list li.active {
  background: #3b82f6;
  color: white;
  font-weight: 600;
}

.category-name {
  flex: 1;
}

.category-count {
  background: rgba(0, 0, 0, 0.1);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.category-list li.active .category-count {
  background: rgba(255, 255, 255, 0.2);
}

.price-inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
}

.price-input {
  padding: 10px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  color: #1e293b;
}

.price-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.price-range {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-weight: 600;
  color: #1e293b;
}

.price-value {
  color: #3b82f6;
  font-size: 1.125rem;
}

.price-separator {
  color: #cbd5e1;
}

.products-area {
  min-height: 400px;
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

.empty-state {
  padding: 80px 20px;
}

.empty-content {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.empty-content svg {
  color: #cbd5e1;
  margin-bottom: 24px;
}

.empty-content h3 {
  font-size: 1.5rem;
  color: #1e293b;
  margin: 0 0 12px;
  font-weight: 700;
}

.empty-content p {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

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

  .sidebar {
    grid-template-columns: 1fr;
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