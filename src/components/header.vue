<!-- src/components/Header.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
    searchQuery.value = ''
  }
}
</script>

<template>
  <header class="header">
    <div class="main-bar">
      <router-link to="/" class="logo">
        <img src="/logo.png" alt="Logo" class="logo-img" />
      </router-link>

      <form @submit.prevent="handleSearch" class="search-form">
        <div class="search-wrapper">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products, brands..."
            class="search-input"
            aria-label="Search"
          />
          <button type="submit" class="search-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      </form>

      <div class="user-section">
        <div class="profile-avatar">
          <div class="avatar-inner">T</div>
        </div>
      </div>
    </div>

    <nav class="nav-bar">
      <ul class="nav-list">
        <li><router-link to="/products" active-class="active">All Products</router-link></li>
        <li><router-link to="/category/home" active-class="active">Home Appliances</router-link></li>
        <li><router-link to="/category/audio" active-class="active">Audio & Video</router-link></li>
        <li><router-link to="/category/fridge" active-class="active">Refrigerator</router-link></li>
        <li><router-link to="/new" active-class="active">New Arrivals</router-link></li>
        <li><router-link to="/deals" active-class="active">Today's Deal</router-link></li>
        <li><router-link to="/orders" active-class="active">My Orders</router-link></li>
        <li><router-link to="/cart" active-class="active">Cart (0)</router-link></li>
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
  z-index: 1000;
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
  flex-shrink: 0;   /* prevents overlap on small screens */
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
    justify-content: space-between;   /* ← This keeps logo left + avatar right */
  }

  /* Push search bar to full width below, but keep logo & avatar on top row */
  .search-form {
    order: 3;
    flex-basis: 100%;                  /* ← full width */
    max-width: none;
    margin: 12px 0 0;
  }

  .search-wrapper {
    height: 48px;
  }

  /* Make sure avatar stays on the right even when wrapped */
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
    justify-content: flex-start;   /* move menu to the left */
  }
  .nav-list {
    padding-left: 0;              
  }
}

</style>