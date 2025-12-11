<!-- components/DiscountBanner.vue -->
<script setup lang="ts">
defineProps<{
  title: string
  startingPrice: string
  image: string        // must be in public folder + start with "/"
  link?: string
}>()
</script>

<template>
  <a :href="link || '#'" class="discount-banner">
    <div class="overlay" />
  
    <div class="content">
      <h3 class="title">{{ title }}</h3>
      <p class="price">Starting at <strong>{{ startingPrice }}</strong></p>
      <span class="shop-link">Shop now →</span>
    </div>
  </a>
</template>

<style scoped>
.discount-banner {
  display: block;
  position: relative;
  height: 280px;
  width: 410px;
  margin: 12px 0;
  border-radius: 28px;
  overflow: hidden;
  background: url('') center/cover no-repeat;

  background-image: v-bind('`url(${image})`');

  transition: all 0.4s ease;
  text-decoration: none;
  cursor: pointer;
}

.discount-banner:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 30px 70px rgba(0,0,0,0.22);
}

/* Dark overlay for text readability */
.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0,0,0,0.65) 0%,
    rgba(0,0,0,0.35) 50%,
    rgba(0,0,0,0.15) 100%
  );
  z-index: 1;
}

.content {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 56px;
  z-index: 2;
  color: white;
  width: 65%;
}

.title {
  font-size: 2.0rem;
  font-weight: 700;           
  margin: 0 0 12px;
  line-height: 1.1;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

.price {
  font-size: 1.0rem;
  margin: 0 0 20px;
  opacity: 0.95;
}

.price strong {
  font-weight: 800;
}

.shop-link {
  font-size: 1.2rem;
  font-weight: 700;
  color: #60a5fa;
  text-shadow: 0 2px 10px rgba(0,0,0,0.4);
}

.shop-link:hover {
  color: #93bbfc;
}

/* Mobile  */
@media (max-width: 900px) {
  .discount-banner {
    width: 100%;
    max-width: 480px;
    height: 320px;
  }
  .content {
    width: 80%;
    padding: 0 32px;
    text-align: center;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .overlay {
    background: rgba(0,0,0,0.5);
  }
  .title { font-size: 2.2rem; }
}
</style>