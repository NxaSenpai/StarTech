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
                  <option value="kitchen">Kitchen Appliances</option>
                  <option value="pc">PCs & Laptops</option>
                  <option value="refrigerator">Refrigerator</option>
                  <option value="smart">Smart Home</option>
                  <option value="audio">Audio & Video</option>
                </select>

                <select v-model="sortBy" class="filter-select">
                  <option value="default">Default Sorting</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                  <option value="newest">Newest First</option>
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
          <div v-if="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading products...</p>
          </div>

          <div v-else-if="filteredProducts.length === 0" class="empty-state">
            <div class="empty-content">
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          </div>

          <div v-else class="products-grid">
            <ProductCard
              v-for="product in filteredProducts"
              :key="product.id"
              :title="product.title"
              :price="product.price"
              :oldPrice="product.oldPrice"
              :rating="product.rating"
              :reviewCount="product.reviews"
              :isOnSale="product.sale"
              :image="product.img"
              :productId="product.id"
              @add-to-cart="addToCart(product)"
            />
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
      isLoading: false,
      products: [
        { 
          id: 1, 
          title: 'Multigroomer All-in-One Trimmer Series 5000, 23 Piece Mens Grooming Kit', 
          price: 44.00, 
          oldPrice: 69.00, 
          rating: 4.0, 
          reviews: 128, 
          sale: true, 
          img: '/smart_wifi.png',
          category: 'smart'
        },
        { 
          id: 2, 
          title: 'Wireless Bluetooth Headphones – Noise Cancelling', 
          price: 89.99, 
          oldPrice: 129.99, 
          rating: 4.5, 
          reviews: 342, 
          sale: true, 
          img: '/wirelessheadphone.png',
          category: 'audio'
        },
        { 
          id: 3, 
          title: 'Smart LED TV 55″ 4K UHD', 
          price: 599.00, 
          oldPrice: 799.00, 
          rating: 4.8, 
          reviews: 87, 
          sale: true, 
          img: '/categories/2_audio.png',
          category: 'audio'
        },
        { 
          id: 4, 
          title: 'Portable Air Conditioner 12000 BTU', 
          price: 349.00, 
          oldPrice: 499.00, 
          rating: 4.3, 
          reviews: 201, 
          sale: true, 
          img: '/categories/1_AC.png',
          category: 'smart'
        },
        { 
          id: 5, 
          title: 'Gaming Laptop RTX 4070 16GB RAM', 
          price: 1299.00, 
          oldPrice: 1599.00, 
          rating: 4.9, 
          reviews: 523, 
          sale: true, 
          img: '/categories/6_pc.png',
          category: 'pc'
        },
        { 
          id: 6, 
          title: 'Smart Watch Series 8 GPS + Cellular', 
          price: 399.00, 
          rating: 4.7, 
          reviews: 892, 
          sale: false, 
          img: '/categories/3_gadget.png',
          category: 'smart'
        },
        { 
          id: 7, 
          title: 'Coffee Maker Automatic Espresso', 
          price: 179.00, 
          oldPrice: 249.00, 
          rating: 4.6, 
          reviews: 176, 
          sale: true, 
          img: '/categories/5_oven.png',
          category: 'kitchen'
        },
        { 
          id: 8, 
          title: 'Robot Vacuum Cleaner with Mop', 
          price: 299.00, 
          oldPrice: 399.00, 
          rating: 4.4, 
          reviews: 412, 
          sale: true, 
          img: '/categories/4_wash.png',
          category: 'kitchen'
        },
        { 
          id: 9, 
          title: 'French Door Refrigerator 25 cu ft', 
          price: 1899.00, 
          oldPrice: 2199.00, 
          rating: 4.7, 
          reviews: 234, 
          sale: true, 
          img: '/categories/7_fridge.png',
          category: 'refrigerator'
        },
        { 
          id: 10, 
          title: 'Microwave Oven 1.5 cu ft Stainless Steel', 
          price: 199.00, 
          rating: 4.5, 
          reviews: 156, 
          sale: false, 
          img: '/categories/5_oven.png',
          category: 'kitchen'
        },
        { 
          id: 11, 
          title: 'Smart Home Security Camera System', 
          price: 249.00, 
          oldPrice: 349.00, 
          rating: 4.6, 
          reviews: 287, 
          sale: true, 
          img: '/categories/8_smart.png',
          category: 'smart'
        },
        { 
          id: 12, 
          title: 'Laptop Stand Adjustable Aluminum', 
          price: 39.99, 
          rating: 4.8, 
          reviews: 567, 
          sale: false, 
          img: '/categories/6_pc.png',
          category: 'pc'
        }
      ]
    };
  },
  computed: {
    filteredProducts() {
      let filtered = this.products;
      if (this.searchQuery) {
        filtered = filtered.filter(product =>
          product.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      if (this.categoryFilter !== 'all') {
        filtered = filtered.filter(product => 
          product.category === this.categoryFilter
        );
      }
      if (this.sortBy === 'price-low') {
        filtered = [...filtered].sort((a, b) => a.price - b.price);
      } else if (this.sortBy === 'price-high') {
        filtered = [...filtered].sort((a, b) => b.price - a.price);
      } else if (this.sortBy === 'rating') {
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
      } else if (this.sortBy === 'newest') {
        filtered = [...filtered].reverse();
      }
      return filtered;
    }
  },
  methods: {
    addToCart(product) {
      console.log('Adding to cart:', product);
      alert(`Added "${product.title}" to cart!`);
    }
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('ProductsView mounted');
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
  flex: 1;
  position: relative;
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