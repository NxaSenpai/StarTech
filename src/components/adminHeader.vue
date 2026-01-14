<template>
  <header class="admin-header">
    <img class="logo-img" src="/logo.png" alt="">
    <div class="header-actions">
      <div class="user-info">
        <span class="user-name">{{ displayName }}</span>
        <router-link to="/settings" class="avatar">{{ userInitial }}</router-link>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';

export default {
  name: 'AdminHeader',
  props: {
    userName: {
      type: String,
      default: 'Admin'
    },
    notificationCount: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const user = ref({});

    const loadUser = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          user.value = JSON.parse(userData);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        user.value = {};
      }
    };

    const storageHandler = (e) => {
      if (e.key === 'user') {
        loadUser();
      }
    };

    const userChangedHandler = (ev) => {
      try {
        const detail = ev.detail;
        if (detail && Object.keys(detail).length) {
          user.value = detail;
        } else {
          loadUser();
        }
      } catch {
        loadUser();
      }
    };

    const displayName = computed(() => {
      if (user.value?.name) {
        return String(user.value.name).trim();
      }
      return props.userName;
    });

    const userInitial = computed(() => {
      const name = user.value?.name ? String(user.value.name).trim() : '';
      if (name) return name.charAt(0).toUpperCase();
      
      const email = user.value?.email ? String(user.value.email).trim() : '';
      if (email) return email.charAt(0).toUpperCase();
      
      return props.userName.charAt(0).toUpperCase();
    });

    onMounted(() => {
      loadUser();
      window.addEventListener('storage', storageHandler);
      window.addEventListener('user-changed', userChangedHandler);
    });

    onUnmounted(() => {
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener('user-changed', userChangedHandler);
    });

    return {
      displayName,
      userInitial
    };
  }
};
</script>

<style scoped>
.admin-header {
  grid-area: header;
  background: #0b6cf0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo-img {
  scale: 0.4;
  margin-left: -90px;
  filter: brightness(0) invert(1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  color: white;
  font-weight: 500;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: white;
  color: #0b6cf0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>