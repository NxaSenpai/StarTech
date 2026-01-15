<template>
    <aside class="sidebar">
      <nav class="nav-links">
        <router-link 
          v-for="item in navigationItems" 
          :key="item.path"
          :to="item.path" 
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <img class="nav-icon" :src="item.icon" :alt="item.label">
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="settings">
        <router-link 
          to="/settings" 
          class="nav-item"
          :class="{ active: isActive('/settings') }"
        >
          <img class="nav-icon" src="/settingIcon.png" alt="">
          <span>Settings</span>
        </router-link>
      </div>
    </aside>
  </template>
  
  <script>
  export default {
    name: 'AdminSidebar',
    data() {
      return {
        navigationItems: [
          {
            path: '/dashboard',
            icon: '/dashboardIcon.png',
            label: 'Dashboard'
          },
          {
            path: '/manageproduct',
            icon: '/productIcon.png',
            label: 'Manage Product'
          },
          
          {
            path: '/managecategories',
            icon: '/categoryIcon.png',
            label: 'Manage Categories'
          },

          {
            path: '/managepromotions',
            icon: '/discountIcon.png',
            label: 'Manage Promotions'
          },

          {
            path: '/managecoupons',
            icon: '/couponIcon.png',
            label: 'Manage Coupons'
          },

          {
            path: '/managesupplier',
            icon: '/supplierIcon.png',
            label: 'Manage Suppliers'
          },
          {
            path: '/manageorder',
            icon: '/cart.png',
            label: 'Manage Orders'
          },
          {
            path: '/manageuser',
            icon: '/userIcon.png',
            label: 'Manage Users'
          },
          {
            path: '/manageadmin',
            icon: '/adminIcon.png',
            label: 'Manage Admins'
          }
        ]
      };
    },
    methods: {
      isActive(path) {
        return this.$route.path === path;
      }
    }
  };
  </script>
  
  <style scoped>
  .sidebar {
    grid-area: sidebar;
    border-right: 1px solid #e9ecef;
    padding: 25px 15px;
    background: white;
    position: sticky;
    top: 70px;
    height: calc(100vh - 70px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .nav-links {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    margin: 0;
    border-radius: 10px;
    text-decoration: none;
    color: #6c757d;
    transition: all 0.3s;
    font-weight: 500;
  }
  
  .nav-item:hover {
    background: #f8f9fa;
    color: #0b6cf0;
  }
  
  .nav-item.active {
    background: #e6f0ff;
    color: #0b6cf0;
  }
  
  .nav-icon {
    width: 20px;
    height: 20px;
  }
  </style>