<script setup lang="ts">
defineProps<{
  image?: string
  title: string
  price: number
  oldPrice?: number
  rating?: number
  reviewCount?: number
  isOnSale?: boolean
}>()
</script>

<template>
  <div class="product-card">
    <div 
      v-if="isOnSale" class="sale-badge">Sale!
    </div>

    <div class="image-wrapper">
      <img
        :src="image || 'https://via.placeholder.com/400x500/white/ccc?text=Product'"
        :alt="title"
        class="product-image"
        loading="lazy"
      />
    </div>

    <div class="content">
      <h3 class="title">{{ title }}</h3>

      <div v-if="rating" class="rating">
        <div class="stars">
          <span class="filled">★★★★★</span>
          <span class="empty">★★★★★</span>
        </div>
        <span class="value">({{ rating.toFixed(1) }})</span>
      </div>

      <div class="price">
        <span class="current">${{ price.toFixed(2) }}</span>
        <span v-if="oldPrice" class="old">${{ oldPrice.toFixed(2) }}</span>
      </div>

      <button class="add-btn">Add +</button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  position: relative;
  width: 100%;
  max-width: 280px;                 
  background: white;
  border-radius: 28px;
  padding: 20px 16px 28px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.07);
  transition: transform 0.35s ease;
  border: 1px solid #a09f9f;
}

.product-card:hover {
  transform: translateY(-8px);
}

.sale-badge {
  position: absolute;
  top: 16px;
  left: 16px;                
  background: #e0f5e8;
  color: #166534;
  font-size: 12px;
  font-weight: 800;
  padding: 6px 16px;
  border-radius: 50px;
  letter-spacing: 0.5px;
  z-index: 10;
}

.image-wrapper {
  height: 220px;
  margin: 20px auto 16px;
  display: grid;
  place-items: center;
}

.product-image {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: #0f172a;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #64748b;
}

.stars {
  position: relative;
  font-size: 15px;
  line-height: 1;
}

.filled {
  position: absolute;
  left: 0;
  top: 0;
  color: #fbbf24;
  overflow: hidden;
  width: calc(v-bind(rating) * 20%);
}

.empty { color: #e2e8f0; }

.price {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
  font-weight: 700;
}

.current {
  font-size: 1.2rem;           
  color: #16a34a;
}

.old {
  font-size: 1rem;
  color: #94a3b8;
  text-decoration: line-through;
}

/* Add button – exact size & style from your screenshot */
.add-btn {
  background: #c3f2d4;
  color: #166534;
  border: none;
  padding: 10px 28px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  min-width: 120px;
}

.add-btn:hover {
  background: #bbf7d0;
  transform: translateY(-2px);
}

/* Mobile perfect */
@media (max-width: 480px) {
  .product-card {
    max-width: 280px;
    padding: 18px 14px 24px;
  }
  .image-wrapper { height: 200px; }
}
</style>