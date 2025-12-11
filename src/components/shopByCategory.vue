<script setup lang="ts">
defineProps<{
  title: string
  productCount: number
  imageUrl: string
  categoryLink?: string
  width?: string
  height?: string
}>()
</script>

<template>
  <router-link
    :to="categoryLink || '#'"
    class="categoryCard"
    active-class="active"
  >
    <div class="card-inner">
      <!-- Category Image -->
      <div class="image-wrapper">
        <img
          :src="imageUrl"
          :alt="title"
          class="category-image"
          loading="lazy"
        />
      </div>

      <!-- Text Content -->
      <div class="text-content">
        <h3 class="category-title">{{ title.toUpperCase() }}</h3>
        <p class="product-count">{{ productCount }} PRODUCTS</p>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.category-card {
  display: block;
  width: 100%;
  max-width: 320px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.35s ease;
  text-decoration: none;
  color: inherit;
  border: 1px solid #eef2f6;
}

.category-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #8091a222;
}

.card-inner {
  padding: 24px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border: 1px solid #a09f9f;
  border-radius: 10px;
}
.image-wrapper {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: #f8fbff;
  border-radius: 12px;
}

.category-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.category-card:hover .category-image {
  transform: scale(1.08);
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.category-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: 0.5px;
}

.product-count {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .category-card {
    max-width: 280px;
  }
  .image-wrapper {
    height: 160px;
  }
}

@media (max-width: 480px) {
  .card-inner {
    padding: 20px 12px;
  }
  .category-title {
    font-size: 1rem;
  }
}
</style>