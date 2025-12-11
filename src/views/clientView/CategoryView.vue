<script>
import Footer from '@/components/footer.vue';
import Header from '@/components/header.vue'
export default {
  name: 'HomeAppliances',
  components:{
    Header,
    Footer
  },
  data() {
    return {
      minPrice: 44,
      maxPrice: 349,
      selectedCategory: 'all',
      sortBy: 'default',
      
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
          rating: 4
        },
        {
          id: 2,
          name: 'Compact Pulsator Washer for Clothes, 9 Cubic ft. Tub, White, BPAB10WH',
          price: 259.00,
          originalPrice: 319.00,
          category: 'kitchen',
          sale: true,
          rating: 4
        },
        {
          id: 3,
          name: 'Full-Automatic Compact Washer with Wheels, 1.6 cu. ft, 11 lbs capacity with 8 Wash Programs, Washer',
          price: 279.00,
          originalPrice: 309.00,
          category: 'kitchen',
          sale: true,
          rating: 4
        },
        {
          id: 4,
          name: 'Multigroomer All-In-One Trimmer Series 9000, 23 Piece Mens Grooming Kit',
          price: 64.00,
          originalPrice: 149.00,
          category: 'smart',
          sale: true,
          rating: 5
        },
        {
          id: 5,
          name: 'Small Space Heat Pump Dryer with Sensor Dry, 12 Preset Machine Cycles, 40 Minute Express Drying',
          price: 349.00,
          originalPrice: null,
          category: 'kitchen',
          sale: false,
          rating: 4
        }
      ]
    };
  },
  
  computed: {
    filteredProducts() {
      let filtered = this.products.filter(product => {
        const priceInRange = product.price >= this.minPrice && product.price <= this.maxPrice;
        const categoryMatch = this.selectedCategory === 'all' || product.category === this.selectedCategory;
        return priceInRange && categoryMatch;
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
    renderStars(rating) {
      return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    }
  },
  
  mounted() {
    console.log("HomeAppliances component loaded");
  }
};
</script>

<template>
<Header/>
  <div class="page-container">
    <div class="container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="categories-section">
          <h3>Categories</h3>
          <ul class="category-list">
            <li 
              :class="{ active: selectedCategory === 'all' }"
              @click="selectedCategory = 'all'"
            >
              All Categories
            </li>
            <li 
              v-for="cat in categories" 
              :key="cat.slug"
              :class="{ active: selectedCategory === cat.slug }"
              @click="selectedCategory = cat.slug"
            >
              {{ cat.name }}
            </li>
          </ul>
        </div>

        <div class="price-filter-section">
          <h3>Filter by price</h3>
          <div class="price-inputs">
            <div class="input-group">
              <input type="number" v-model.number="minPrice" placeholder="$44">
              <label>Min. Price</label>
            </div>
            <div class="input-group">
              <input type="number" v-model.number="maxPrice" placeholder="$349">
              <label>Max. Price</label>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <div class="header-section">
          <h1>Home appliances</h1>
          <p class="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris turpis velit, 
            iaculis vel risus non, convallis rhoncus ligula. Vestibulum ante ipsum primis in 
            faucibus orci luctus et ultrices posuere, malesuada eequat et, placerat quam. 
            In hac habitasse platea dictumst. Sed bibendum porttitor sem, at sollicitudin 
            orci placerat nec.
          </p>
        </div>

        <div class="products-header">
          <p class="result-count">Showing all {{ filteredProducts.length }} results</p>
          <div class="sort-section">
            <select v-model="sortBy" class="sort-select">
              <option value="default">Default sorting</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>

        <div class="products-grid">
          <div 
            v-for="product in filteredProducts" 
            :key="product.id" 
            class="product-card"
          >
            <div class="product-badge" v-if="product.sale">Sale!</div>
            
            <div class="product-image">
              <img src="/pdetail/aba.png" alt="">
            </div>

            <div class="product-info">
              <div class="product-rating">
                <span class="stars">{{ renderStars(product.rating) }}</span>
              </div>
              
              <h3 class="product-title">{{ product.name }}</h3>
              
              <div class="product-price">
                <span class="original-price" v-if="product.originalPrice">
                  ${{ product.originalPrice.toFixed(2) }}
                </span>
                <span class="current-price">${{ product.price.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
<Footer/>
</template>
<style scoped>
.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #f5f7fa;
}

.container {
  display: flex;
  gap: 30px;
}

/* Sidebar Styles */
.sidebar {
  width: 250px;
  flex-shrink: 0;
}

.categories-section,
.price-filter-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.sidebar h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1a1a1a;
}

.category-list {
  list-style: none;
}

.category-list li {
  padding: 10px 12px;
  margin-bottom: 6px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  color: #555;
}

.category-list li:hover {
  background: #f0f4f8;
  color: #0066cc;
}

.category-list li.active {
  background: #0066cc;
  color: white;
  font-weight: 500;
}

.price-inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.input-group input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.input-group input:focus {
  outline: none;
  border-color: #0066cc;
}

/* Main Content Styles */
.main-content {
  flex: 1;
}

.header-section h1 {
  font-size: 2.5rem;
  color: #0066cc;
  margin-bottom: 16px;
  font-weight: 600;
}

.description {
  color: #666;
  line-height: 1.7;
  margin-bottom: 32px;
  max-width: 800px;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.result-count {
  color: #666;
  font-size: 0.95rem;
}

.sort-select {
  padding: 8px 32px 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.2s;
}

.sort-select:focus {
  outline: none;
  border-color: #0066cc;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 28px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  position: relative;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.product-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ff4444;
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  z-index: 10;
}

.product-image {
  background: #f8f9fa;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e5e7eb;
}

.image-placeholder {
  font-size: 80px;
  opacity: 0.5;
}

.product-info {
  padding: 20px;
}

.product-rating {
  margin-bottom: 10px;
}

.stars {
  font-size: 0.9rem;
  color: #fbbf24;
}

.product-title {
  font-size: 1rem;
  color: #1a1a1a;
  margin-bottom: 14px;
  line-height: 1.4;
  min-height: 60px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 12px;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 0.95rem;
}

.current-price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0066cc;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .page-container {
    padding: 20px 12px;
  }

  .header-section h1 {
    font-size: 2rem;
  }

  .products-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }

  .sidebar {
    grid-template-columns: 1fr;
  }
}
</style>