<script>
import { ref, onMounted } from 'vue';
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';
import ProductCard from '@/components/productCard.vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default {
  name: 'EventView',
  components: {
    Header,
    Footer,
    ProductCard
  },
  data() {
    return {
      products: [],
      promotions: [],
      isLoading: false,
      error: null
    };
  },
  computed: {
    todaysProducts() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      return this.products.filter(product => {
        if (!product.stockAt) return false;
        
        const productDate = new Date(product.stockAt);
        productDate.setHours(0, 0, 0, 0);
        
        // Only show products added today
        return productDate >= today && productDate < tomorrow;
      });
    }
  },
  methods: {
    async fetchTodaysProducts() {
      this.isLoading = true;
      this.error = null;
      
      try {
        // Fetch all products
        const productsResponse = await axios.get(`${API_URL}/products`);
        
        // Fetch active promotions
        const promotionsResponse = await axios.get(`${API_URL}/promotions/active`);
        this.promotions = promotionsResponse.data;
        
        console.log('All products loaded:', productsResponse.data.length);
        console.log('Active promotions:', this.promotions.length);
        
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
        
        console.log('Today\'s products:', this.todaysProducts.length);
        console.log('Products with promotions today:', 
          this.todaysProducts.filter(p => p.hasPromotion).length);
        
      } catch (error) {
        console.error('Failed to fetch products:', error);
        this.error = 'Failed to load today\'s arrivals. Please try again.';
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
    this.fetchTodaysProducts();
    console.log('EventView mounted - loading today\'s arrivals');
  }
};
</script>

<template>
  <div class="event-layout">
    <Header />

    <main class="event-main">
      <section class="event-hero">
        <div class="hero-bg">
          <div class="hero-content">
            <h1>Today's Arrivals !!</h1>
            <p>Discover the latest gadgets & electronics at StarTech</p>
          </div>
        </div>
      </section>

      <section class="products-section">
        <div class="container">
          <!-- Loading State -->
          <div v-if="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading today's arrivals...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <div class="error-content">
              <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3>Failed to load products</h3>
              <p>{{ error }}</p>
              <button @click="fetchTodaysProducts" class="retry-btn">Try Again</button>
            </div>
          </div>

          <!-- Empty State - No products today -->
          <div v-else-if="todaysProducts.length === 0" class="empty-state">
            <div class="empty-content">
              <h3>No New Arrivals Today</h3>
              <p>Check back tomorrow for new products!</p>
              <router-link to="/products" class="browse-btn">Browse All Products</router-link>
            </div>
          </div>

          <!-- Products Grid with Discount Badges -->
          <div v-else class="products-grid">
            <div 
              v-for="product in todaysProducts"
              :key="product.id"
              class="product-wrapper"
              :class="{ 'out-of-stock': !product.isAvailable }"
            >
              <!-- Discount Badge (only show if product has promotion) -->
              <div v-if="product.hasPromotion" class="discount-badge">
                -{{ product.discount.toFixed(0) }}% OFF
              </div>
              
              <!-- New Badge -->
              <div class="new-badge">NEW TODAY</div>
              
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

<style scoped>
.event-layout {
  min-height: 100vh;
  background: #f8fbff;
}

.event-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.event-hero {
  margin-bottom: 60px;
  margin-top: 40px;
}

.hero-bg {
  background: linear-gradient(135deg, #aeccec 0%, #d0deee 100%);
  border-radius: 16px;
  padding: 100px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 900;
  color: #0056b3;
  margin-bottom: 16px;
}

.hero-content p {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0;
}

.products-section {
  margin-bottom: 100px;
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
  max-width: 500px;
  margin: 0 auto;
}

.empty-content svg {
  color: #cbd5e1;
  margin-bottom: 24px;
}

.empty-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px;
}

.empty-content p {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0 0 32px;
}

.browse-btn {
  display: inline-block;
  padding: 14px 32px;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s;
}

.browse-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 40px;
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

.new-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #10b981;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  z-index: 10;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.stock-badge {
  position: absolute;
  top: 52px;
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

@media (max-width: 992px) {
  .hero-content h1 {
    font-size: 2.8rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 30px;
  }
}

@media (max-width: 640px) {
  .hero-bg {
    padding: 60px 20px;
  }
  
  .hero-content h1 {
    font-size: 2.2rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
}
</style>