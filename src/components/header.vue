<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
    searchQuery.value = ''
  }
}

const user = ref<Record<string, any>>({})

const storageHandler = (e: StorageEvent) => {
  if (e.key === 'user') {
    try { user.value = JSON.parse(e.newValue || '{}') } catch { user.value = {} }
  }
}

const userChangedHandler = (ev: Event) => {
  try {
    const detail = (ev as CustomEvent).detail
    user.value = detail && Object.keys(detail).length ? detail : JSON.parse(localStorage.getItem('user') || '{}')
  } catch {
    user.value = {}
  }
}

const initial = computed(() => {
  const name = user.value?.name ? String(user.value.name).trim() : ''
  if (name) return name.charAt(0).toUpperCase()
  const email = user.value?.email ? String(user.value.email).trim() : ''
  if (email) return email.charAt(0).toUpperCase()
  return 'U'
})

onMounted(() => {
  try { user.value = JSON.parse(localStorage.getItem('user') || '{}') } catch { user.value = {} }
  window.addEventListener('storage', storageHandler)
  window.addEventListener('user-changed', userChangedHandler as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('storage', storageHandler)
  window.removeEventListener('user-changed', userChangedHandler as EventListener)
})
</script>

<template>
  <header class="header">
    <div class="main-bar">
      <router-link to="/home" class="logo">
        <img src="/logo.png" alt="Logo" class="logo-img" />
      </router-link>

      <div class="user-section">

        <router-link class="cart-btn" to="/wishlist">
          <img class="cart-icon" src="/wishlistIcon.png" alt="">
        </router-link>

        <router-link class="cart-btn" to="/cart">
          <img class="cart-icon" src="/cart.png" alt="">
        </router-link>

        <router-link to="/profile" class="profile-avatar">
          <div class="avatar-inner">{{ initial }}</div>
        </router-link>
      </div>
    </div>

    <nav class="nav-bar">
      <ul class="nav-list">
        <li><router-link to="/products" active-class="active">All Products</router-link></li>
        <li><router-link to="/eventview" active-class="active">Today Arrivals</router-link></li>
        <li><router-link to="/best-deals" active-class="active">Best Deal</router-link></li>
        <li><router-link to="/orders" active-class="active">My Orders</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header {
  background: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 10000;
}

.main-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 5%;
  background: #007bff;
  min-height: 70px;
  gap: 16px;
}

.user-section {
  display: flex;
  gap: 30px;
  flex-shrink: 0;
  z-index: 10;
}

.logo-img {
  height: 46px;
  filter: brightness(0) invert(1);
  transition: transform 0.3s;
}

.logo:hover .logo-img { transform: scale(1.08); }

.search-form {
  flex: 1;
  max-width: 560px;
  margin: 0 16px;
}

.search-wrapper {
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0,0,0,0.14);
  height: 44px;
  transition: all 0.25s ease;
  border: 1px solid #e0e0e0;
}

.search-wrapper:focus-within {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0,123,255,0.28);
  border-color: #007bff;
}

.search-input {
  flex: 1;
  padding: 0 16px;
  border: none;
  outline: none;
  font-size: 14.5px;
  color: #333;
}

.search-input::placeholder {
  color: #999;
  font-size: 14px;
}

.search-btn {
  background: #007bff;
  color: white;
  border: none;
  width: 40px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-btn:hover {
  background: #0062cc;
  transform: scale(1.05);
}

.search-btn:active { transform: scale(0.95); }

.cart-btn {
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cart-icon {
  width: 25px;
  height: 25px;
  filter: brightness(0) invert(1);
  transition: transform 0.3s;
}

.profile-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 12px rgba(0,0,0,0.15);
  transition: transform 0.3s;
  font-weight: bold;
  color: #007bff;
  font-size: 18px;
}

.profile-avatar:hover { transform: scale(1.1); }

.nav-bar {
  background: #0066cc;
  padding: 12px 5%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.nav-bar::-webkit-scrollbar { display: none; }

.nav-list {
  display: flex;
  gap: 32px;
  min-width: max-content;
  padding: 0 10px;
  margin: 0;
  list-style: none;
}

.nav-list a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  padding: 8px 4px;
  white-space: nowrap;
  position: relative;
}

.nav-list a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 3px;
  bottom: 0;
  left: 50%;
  background: white;
  transition: all 0.3s;
  border-radius: 2px;
}

.nav-list a:hover::after,
.nav-list a.active::after {
  width: 100%;
  left: 0;
}

@media (max-width: 1024px) {
  .main-bar {
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .search-form {
    order: 3;
    flex-basis: 100%;
    max-width: none;
    margin: 12px 0 0;
  }

  .search-wrapper {
    height: 48px;
  }

  .user-section {
    margin-left: auto;                 
  }
}

@media (max-width: 768px) {
  .main-bar {
    padding: 12px 16px;
    gap: 12px;
  }
  
  .logo-img {
    height: 42px;
  }
  
  .profile-avatar {
    width: 38px;
    height: 38px;
    font-size: 17px;
  }
  
  .nav-list {
    gap: 24px;
  }
}

.nav-bar {
  display: flex;
  justify-content: center;
}

.nav-list {
  gap: 32px;
  min-width: max-content;
  padding: 0 10px;
  margin: 0;
  list-style: none;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .nav-bar {
    justify-content: flex-start;
  }
  .nav-list {
    padding-left: 0;              
  }
}

</style>