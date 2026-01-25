<script>
import Footer from '@/components/footer.vue';
import Header from '@/components/header.vue';
import ProductCard from '@/components/productCard.vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default {
  name: 'ProductDetails',
  components: {
    Header,
    Footer,
    ProductCard
  },
  data() {
    return {
      quantity: 1,
      selectedImage: 0,
      product: null,
      isLoading: true,
      error: null,
      relatedProducts: [],
      isInWishlist: false,
      checkingWishlist: false,
      isInCart: false,
      cartQuantity: 0
    };
  },
  computed: {
    images() {
      if (!this.product?.imageSrc) return ['/placeholder.png'];
      return [this.product.imageSrc];
    },
    displayPrice() {
      if (!this.product) return 0;
      return this.product.price || 0;
    },
    originalPrice() {
      if (!this.product) return null;
      if (this.product.discount > 0 && this.product.originalPrice) {
        return this.product.originalPrice;
      }
      return null;
    },
    discountPercentage() {
      if (!this.product || !this.originalPrice) return 0;
      return Math.round(((this.originalPrice - this.displayPrice) / this.originalPrice) * 100);
    }
  },
  watch: {
    '$route.params.id': {
      async handler(newId, oldId) {
        if (newId && newId !== oldId) {
          this.quantity = 1;
          this.selectedImage = 0;
          this.product = null;
          this.error = null;
          this.isInWishlist = false;
          this.checkingWishlist = false;
          this.isInCart = false;
          this.cartQuantity = 0;
          
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          
          await this.fetchProductDetails();
          await this.fetchRelatedProducts();
          await this.checkIfInWishlist();
          this.checkIfInCart();
        }
      },
      immediate: false
    }
  },
  async mounted() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    await this.fetchProductDetails();
    await this.fetchRelatedProducts();
    await this.checkIfInWishlist();
    this.checkIfInCart();
    
    window.addEventListener('cart-updated', this.checkIfInCart);
  },
  beforeUnmount() {
    window.removeEventListener('cart-updated', this.checkIfInCart);
  },
  methods: {
    getImageUrl(imageSrc) {
      if (!imageSrc) return '/placeholder.png';
      if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) return imageSrc;
      if (imageSrc.startsWith('/uploads/')) return `${API_URL}${imageSrc}`;
      if (!imageSrc.startsWith('/')) return `${API_URL}/uploads/${imageSrc}`;
      return imageSrc;
    },
    
    async fetchProductDetails() {
      const productId = this.$route.params.id;
      
      if (!productId) {
        this.error = 'Product ID not provided';
        this.isLoading = false;
        return;
      }

      try {
        this.isLoading = true;
        
        const productResponse = await axios.get(`${API_URL}/products`);
        const products = productResponse.data;
        
        this.product = products.find(p => p._id === productId);
        
        if (!this.product) {
          this.error = 'Product not found';
          return;
        }

        const promotionsResponse = await axios.get(`${API_URL}/promotions/active`);
        const promotions = promotionsResponse.data;
        
        const promotion = promotions.find(promo => 
          promo.product_id === productId || promo.productId === productId
        );
        
        if (promotion) {
          this.product.originalPrice = this.product.price;
          this.product.price = promotion.sale_price || promotion.salePrice || this.product.price;
          this.product.discount = promotion.discount || promotion.discountPercentage || 0;
        }
        
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        this.error = 'Failed to load product details';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchRelatedProducts() {
      try {
        const productsResponse = await axios.get(`${API_URL}/products`);
        const allProducts = productsResponse.data;
        
        const promotionsResponse = await axios.get(`${API_URL}/promotions/active`);
        const promotions = promotionsResponse.data;
        
        const categoryProducts = allProducts
          .filter(p => p.category === this.product?.category && p._id !== this.product?._id)
          .slice(0, 4);
        
        this.relatedProducts = categoryProducts.map(product => {
          const productId = product._id;
          
          const promotion = promotions.find(promo => 
            promo.product_id === productId || promo.productId === productId
          );
          
          let displayPrice = product.price;
          let originalPrice = null;
          let discount = 0;
          
          if (promotion) {
            originalPrice = product.price;
            displayPrice = promotion.sale_price || promotion.salePrice || product.price;
            discount = promotion.discount || promotion.discountPercentage || 0;
          }
          
          return {
            id: productId,
            name: product.name,
            price: displayPrice,
            oldPrice: originalPrice,
            image: product.imageSrc || product.image || '/placeholder.png',
            rating: 4.5,
            discount: discount,
            isOnSale: discount > 0
          };
        });
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      }
    },

    selectImage(index) {
      this.selectedImage = index;
    },
    
    increaseQuantity() {
      if (this.product && this.quantity < this.product.inStock) {
        this.quantity++;
      }
    },
    
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    
    checkIfInCart() {
      if (!this.product) return;
      
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartItem = cart.find(item => item.id === this.product._id);
        
        if (cartItem) {
          this.isInCart = true;
          this.cartQuantity = cartItem.qty;
        } else {
          this.isInCart = false;
          this.cartQuantity = 0;
        }
      } catch (error) {
        console.error('Error checking cart:', error);
        this.isInCart = false;
        this.cartQuantity = 0;
      }
    },
    
    addToCart() {
      if (!this.product) return;
      
      if (this.product.inStock === 0) {
        alert(`Sorry, "${this.product.name}" is currently out of stock.`);
        return;
      }

      let cart = [];
      try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
          cart = JSON.parse(cartData);
        }
      } catch (error) {
        console.error('Error reading cart:', error);
      }
      
      const existingIndex = cart.findIndex(item => item.id === this.product._id);
      
      if (existingIndex !== -1) {
        const newQty = cart[existingIndex].qty + this.quantity;
        if (newQty > this.product.inStock) {
          alert(`Cannot add more. Only ${this.product.inStock} items available in stock.`);
          return;
        }
        cart[existingIndex].qty = newQty;
        
        const confirmUpdate = confirm(
          `"${this.product.name}" is already in your cart.\n\n` +
          `Current quantity: ${cart[existingIndex].qty - this.quantity}\n` +
          `Adding: ${this.quantity}\n` +
          `New quantity: ${newQty}\n\n` +
          `Update cart?`
        );
        
        if (!confirmUpdate) {
          return;
        }
      } else {
        cart.push({
          id: this.product._id,
          name: this.product.name,
          image: this.product.imageSrc,
          price: this.displayPrice,
          originalPrice: this.originalPrice,
          qty: this.quantity,
          maxStock: this.product.inStock
        });
      }
      
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cart-updated', { 
          detail: { itemCount: cart.reduce((sum, item) => sum + item.qty, 0) }
        }));
        
        this.checkIfInCart();
      } catch (error) {
        console.error('Error saving cart:', error);
        alert('Failed to add item to cart. Please try again.');
      }
    },
    
    viewCart() {
      this.$router.push('/cart');
    },
    
    async checkIfInWishlist() {
      if (!this.product) return;
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.email || 'demo-user';
      
      try {
        const res = await axios.get(`${API_URL}/wishlist`, { params: { userId } });
        const wishlist = res.data;
        
        this.isInWishlist = wishlist.some(item => {
          const itemProductId = typeof item.productId === 'string' 
            ? item.productId 
            : item.productId?.$oid || item.productId?.toString();
          return itemProductId === this.product._id;
        });
      } catch (err) {
        console.error('Failed to check wishlist:', err);
      }
    },
    
    async toggleWishlist() {
      if (!this.product) return;
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.email || 'demo-user';
      
      this.checkingWishlist = true;
      
      try {
        if (this.isInWishlist) {
          await axios.post(`${API_URL}/wishlist/remove`, {
            userId: userId,
            productId: this.product._id
          });
          this.isInWishlist = false;
        } else {
          await axios.post(`${API_URL}/wishlist`, {
            userId: userId,
            productId: this.product._id
          });
          this.isInWishlist = true;
        }
      } catch (err) {
        console.error('Wishlist error:', err.response?.data);
        if (err.response && err.response.status === 409) {
          alert('This product is already in your wishlist.');
          this.isInWishlist = true;
        } else {
          alert('Failed to update wishlist.');
        }
      } finally {
        this.checkingWishlist = false;
      }
    },
    
    addRelatedToCart(product) {
      if (!product.id) {
        alert('Product information is missing.');
        return;
      }

      let cart = [];
      try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
          cart = JSON.parse(cartData);
        }
      } catch (error) {
        console.error('Error reading cart:', error);
      }
      
      const existingIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingIndex !== -1) {
        cart[existingIndex].qty = (cart[existingIndex].qty || 1) + 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          originalPrice: product.oldPrice,
          qty: 1
        });
      }
      
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cart-updated', { 
          detail: { itemCount: cart.reduce((sum, item) => sum + item.qty, 0) }
        }));
      } catch (error) {
        console.error('Error saving cart:', error);
        alert('Failed to add item to cart. Please try again.');
      }
    },
    
    viewDetails(productId) {
      this.$router.push({ name: 'pdetails', params: { id: productId } });
      this.$nextTick(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
};
</script>

<template>
  <div class="product-details-page">
    <Header />
    
    <main class="main-content">
      <div class="container">
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading product details...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3>{{ error }}</h3>
          <router-link to="/products" class="back-btn">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Products
          </router-link>
        </div>

        <div v-else-if="product" class="product-content">
          <div class="breadcrumb">
            <router-link to="/home">Home</router-link> 
            <span class="separator">›</span> 
            <router-link to="/products">Products</router-link> 
            <span class="separator">›</span> 
            <span class="current">{{ product.category }}</span>
          </div>

          <div class="product-section">
            <div class="product-grid">
              <div class="product-images">
                <div class="main-image-wrapper">
                  <img 
                    :src="getImageUrl(images[selectedImage])" 
                    :alt="product.name"
                    class="main-product-image"
                  />
                  <div v-if="discountPercentage > 0" class="badge-sale">
                    -{{ discountPercentage }}%
                  </div>
                </div>
                <div v-if="images.length > 1" class="thumbnail-gallery">
                  <div 
                    v-for="(image, index) in images"
                    :key="index"
                    class="thumbnail"
                    :class="{ active: selectedImage === index }"
                    @click="selectImage(index)"
                  >
                    <img :src="getImageUrl(image)" :alt="`${product.name} ${index + 1}`" />
                  </div>
                </div>
              </div>

              <div class="product-details">
                <h1 class="product-title">{{ product.name }}</h1>
                
                <div class="rating-section">
                  <div class="stars">
                    <span class="filled">★★★★</span>
                    <span class="empty">★</span>
                  </div>
                  <span class="reviews-count">(4.5 rating · 100 reviews)</span>
                </div>

                <div class="price-section">
                  <span class="current-price">${{ displayPrice.toFixed(2) }}</span>
                  <span v-if="originalPrice" class="original-price">${{ originalPrice.toFixed(2) }}</span>
                  <span v-if="discountPercentage > 0" class="save-badge">
                    Save {{ discountPercentage }}%
                  </span>
                </div>

                <div class="product-meta">
                  <div class="meta-item">
                    <span class="meta-label">Brand:</span>
                    <span class="meta-value">{{ product.brand }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Category:</span>
                    <span class="meta-value">{{ product.category }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Availability:</span>
                    <span class="meta-value" :class="product.inStock > 0 ? 'in-stock' : 'out-stock'">
                      {{ product.inStock > 0 ? `${product.inStock} In Stock` : 'Out of Stock' }}
                    </span>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="action-section">
                  <div class="quantity-wrapper">
                    <label>Quantity:</label>
                    <div class="quantity-controls">
                      <button class="quantity-btn" @click="decreaseQuantity" :disabled="quantity <= 1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                        </svg>
                      </button>
                      <input type="number" v-model.number="quantity" class="quantity-input" min="1" :max="product.inStock" readonly />
                      <button class="quantity-btn" @click="increaseQuantity" :disabled="quantity >= product.inStock">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="action-buttons">
                    <button 
                      class="add-to-cart-btn" 
                      :class="{ 'already-in-cart': isInCart }"
                      @click="addToCart" 
                      :disabled="product.inStock === 0"
                    >
                      <img class="cart-icon" src="/cart.png" alt="">
                      <span v-if="product.inStock === 0">Out of Stock</span>
                      <span v-else-if="isInCart">Add More</span>
                      <span v-else>Add to Cart</span>
                    </button>
                    
                    <button 
                      class="wishlist-btn" 
                      :class="{ 'in-wishlist': isInWishlist }"
                      @click="toggleWishlist" 
                      :disabled="checkingWishlist"
                      :title="isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'"
                    >
                      <svg 
                        v-if="!checkingWishlist"
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        :fill="isInWishlist ? 'currentColor' : 'none'" 
                        stroke="currentColor" 
                        stroke-width="2"
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                      <div v-else class="mini-spinner"></div>
                    </button>
                  </div>
                </div>

                <div class="features-grid">
                  <div class="feature-item">
                    <img class="icon-highlight" src="/freeshipIcon.png" alt="">
                    <span>Fast Delivery</span>
                  </div>
                  <div class="feature-item">
                    <img class="icon-highlight" src="/shield.png" alt="">
                    <span>Secure Payment</span>
                  </div>
                  <div class="feature-item">
                    <img class="icon-highlight" src="/return.png" alt="">
                    <span>Easy Returns</span>
                  </div>
                </div>

                <div v-if="product.description" class="product-description">
                  <h3>Product Description</h3>
                  <p>{{ product.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="relatedProducts.length > 0" class="related-section">
            <div class="section-header">
              <h2 class="section-title">Related Products</h2>
              <p class="section-subtitle">You might also like these products</p>
            </div>
            <div class="related-products">
              <div 
                v-for="relatedProduct in relatedProducts"
                :key="relatedProduct.id"
                class="related-product-wrapper"
              >
                <div v-if="relatedProduct.isOnSale && relatedProduct.discount > 0" class="discount-badge">
                  -{{ relatedProduct.discount }}%
                </div>
                
                <ProductCard
                  :title="relatedProduct.name"
                  :price="relatedProduct.price"
                  :oldPrice="relatedProduct.oldPrice"
                  :rating="relatedProduct.rating"
                  :reviewCount="100"
                  :isOnSale="relatedProduct.isOnSale"
                  :image="relatedProduct.image"
                  :productId="relatedProduct.id"
                  @add-to-cart="addRelatedToCart(relatedProduct)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.product-details-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%);
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 40px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  gap: 24px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
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
  font-weight: 500;
}

.error-state {
  text-align: center;
  padding: 100px 20px;
}

.error-state svg {
  color: #ef4444;
  margin-bottom: 16px;
}

.error-state h3 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 24px;
  font-weight: 600;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  font-size: 14px;
  color: #64748b;
}

.breadcrumb a {
  color: #64748b;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb a:hover {
  color: #3b82f6;
}

.breadcrumb .separator {
  color: #cbd5e1;
  font-size: 18px;
}

.breadcrumb .current {
  color: #1e293b;
  font-weight: 600;
}

.product-section {
  overflow: hidden;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  margin-bottom: 60px;
}

.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

.product-images {
  position: sticky;
  top: 10px;
  height: fit-content;
}

.main-image-wrapper {
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 20px;
  overflow: hidden;
}

.main-product-image {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.main-image-wrapper:hover .main-product-image {
  transform: scale(1.05);
}

.badge-sale {
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.thumbnail-gallery {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px;
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.thumbnail:hover {
  border-color: #3b82f6;
  transform: translateY(-4px);
}

.thumbnail.active {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
  margin: 0;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stars {
  display: flex;
  position: relative;
  font-size: 20px;
  line-height: 1;
}

.stars .filled {
  color: #fbbf24;
}

.stars .empty {
  color: #e2e8f0;
}

.reviews-count {
  color: #64748b;
  font-size: 14px;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.current-price {
  font-size: 2.5rem;
  font-weight: 800;
  color: #256cdf;
}

.original-price {
  font-size: 1.5rem;
  color: #94a3b8;
  text-decoration: line-through;
}

.save-badge {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.product-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-label {
  font-weight: 600;
  color: #64748b;
  min-width: 100px;
}

.meta-value {
  color: #1e293b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-value.in-stock {
  color: #10b981;
}

.meta-value.out-stock {
  color: #ef4444;
}

.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e2e8f0, transparent);
  margin: 8px 0;
}

.action-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quantity-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quantity-wrapper label {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0;
  width: fit-content;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

.quantity-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #f8fafc;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: #e2e8f0;
  color: #3b82f6;
}

.quantity-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantity-input {
  width: 80px;
  height: 44px;
  border: none;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  background: white;
  outline: none;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.add-to-cart-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.add-to-cart-btn:disabled {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  cursor: not-allowed;
  box-shadow: none;
}

.cart-icon {
  width: 17px;
  height: 17px;
  filter: invert(1)
}

.wishlist-btn {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
}

.wishlist-btn:hover:not(:disabled) {
  border-color: #ef4444;
  color: #ef4444;
  transform: scale(1.05);
}

.wishlist-btn.in-wishlist {
  background: #fef2f2;
  border-color: #ef4444;
  color: #ef4444;
}

.wishlist-btn.in-wishlist:hover {
  background: #fee2e2;
  transform: scale(1.05);
}

.wishlist-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mini-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #ef4444;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.feature-item svg {
  color: #10b981;
  flex-shrink: 0;
}

.icon-highlight {
  width: 20px;
  height: 20px;
}

.product-description {
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  margin-top: 16px;
}

.product-description h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.product-description p {
  color: #64748b;
  line-height: 1.7;
  font-size: 15px;
}

.related-section {
  margin-top: 80px;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.section-subtitle {
  color: #64748b;
  font-size: 16px;
}

.related-products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
}

.related-product-wrapper {
  position: relative;
}

.related-product-wrapper .discount-badge {
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

@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .product-images {
    position: static;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .product-section {
    padding: 24px;
  }

  .product-title {
    font-size: 1.5rem;
  }

  .current-price {
    font-size: 2rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .wishlist-btn {
    width: 100%;
  }

  .related-products {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 20px 0;
  }

  .product-section {
    border-radius: 16px;
    padding: 20px;
  }

  .product-title {
    font-size: 1.25rem;
  }

  .related-products {
    grid-template-columns: 1fr;
  }
}
</style>