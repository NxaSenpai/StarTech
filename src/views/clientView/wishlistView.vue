<script setup>
import { ref, onMounted } from 'vue';
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';
import ProductCard from '@/components/productCard.vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000';
const wishlist = ref([]);
const products = ref([]);
const isLoading = ref(true);
const user = JSON.parse(localStorage.getItem('user') || '{}');
const userId = user.email || 'demo-user';

async function fetchWishlist() {
  isLoading.value = true;
  try {
    const res = await axios.get(`${API_URL}/wishlist`, { params: { userId } });
    wishlist.value = res.data;
    
    console.log('Wishlist items:', res.data);
    
    // Fetch product details for each wishlist item
    const productPromises = res.data.map(item => {
      // Extract the productId string (handle both string and ObjectId formats)
      const productId = typeof item.productId === 'string' 
        ? item.productId 
        : item.productId?.$oid || item.productId?.toString();
      
      console.log('Fetching product:', productId);
      return axios.get(`${API_URL}/products/${productId}`).catch(err => {
        console.error(`Failed to fetch product ${productId}:`, err);
        return null;
      });
    });
    
    const productResponses = await Promise.all(productPromises);
    products.value = productResponses
      .filter(response => response && response.data)
      .map(response => {
        const product = response.data;
        // Ensure _id is a string
        return {
          ...product,
          _id: typeof product._id === 'string' 
            ? product._id 
            : product._id?.$oid || product._id?.toString()
        };
      });
    
    console.log('Loaded products:', products.value);
    
  } catch (err) {
    console.error('Failed to fetch wishlist:', err);
    wishlist.value = [];
    products.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchWishlist);

async function removeFromWishlist(productId) {
  try {
    // Ensure productId is a string
    const productIdStr = typeof productId === 'string' 
      ? productId 
      : productId?.$oid || productId?.toString();
    
    console.log('Removing from wishlist:', { userId, productId: productIdStr });
    
    await axios.post(`${API_URL}/wishlist/remove`, {
      userId: userId,
      productId: productIdStr
    });
    
    // Remove from local state
    wishlist.value = wishlist.value.filter(item => {
      const itemProductId = typeof item.productId === 'string' 
        ? item.productId 
        : item.productId?.$oid || item.productId?.toString();
      return itemProductId !== productIdStr;
    });
    
    products.value = products.value.filter(product => product._id !== productIdStr);
    
    alert('Removed from wishlist');
  } catch (err) {
    console.error('Failed to remove:', err);
    alert('Failed to remove from wishlist');
  }
}

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItem = cart.find(item => item._id === product._id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Added to cart!');
}
</script>

<template>
  <div class="wishlist-page">
    <Header />
    
    <main class="main-content">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">My Wishlist</h1>
          <p class="page-subtitle">{{ products.length }} {{ products.length === 1 ? 'item' : 'items' }}</p>
        </div>

        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading your wishlist...</p>
        </div>

        <div v-else-if="products.length === 0" class="empty-state">
          <h2>Your wishlist is empty</h2>
          <p>Start adding products you love!</p>
          <router-link to="/products" class="browse-btn">Browse Products</router-link>
        </div>

        <div v-else class="wishlist-grid">
          <div v-for="product in products" :key="product._id" class="wishlist-item">
            <button class="remove-btn" @click="removeFromWishlist(product._id)" title="Remove from wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <ProductCard
              :image="product.images?.[0] || product.imageSrc || product.image_src"
              :title="product.name"
              :price="product.price"
              :old-price="product.originalPrice"
              :rating="product.rating || 4.5"
              :product-id="product._id"
              @add-to-cart="addToCart(product)"
            />
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.wishlist-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%);
  display: flex;
  flex-direction: column;
}

.main-content {
  width: 100%;
  flex: 1;
  padding: 40px 0 80px;
}

.container {
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #64748b;
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

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-state svg {
  color: #cbd5e1;
  margin-bottom: 24px;
}

.empty-state h2 {
  font-size: 1.75rem;
  color: #1e293b;
  margin-bottom: 12px;
  font-weight: 600;
}

.empty-state p {
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 32px;
}

.browse-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.browse-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
  justify-items: center;
}

.wishlist-item {
  position: relative;
  width: 100%;
  max-width: 280px;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.remove-btn:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  transform: scale(1.1);
}

.remove-btn svg {
  color: #ef4444;
}

@media (max-width: 1024px) {
  .wishlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .wishlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }

  .main-content {
    padding: 32px 0 60px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.75rem;
  }

  .wishlist-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .wishlist-item {
    max-width: 100%;
  }
}
</style>