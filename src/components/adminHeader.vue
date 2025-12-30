<template>
    <header class="admin-header">
      <img class="logo-img" src="/logo.png" alt="">
      <div class="header-actions">
        <button class="icon-btn">
          <img src="/notification.png" alt="">
          <span class="badge">{{ notificationCount }}</span>
        </button>
        <div class="user-info">
          <span class="user-name">{{ userName }}</span>
          <div class="avatar">{{ userInitial }}</div>
        </div>
      </div>
    </header>
  </template>
  
  <script>
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
    computed: {
      userInitial() {
        return this.userName.charAt(0).toUpperCase();
      }
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
  
  .icon-btn {
    position: relative;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
  }
  
  .icon-btn img {
    width: 25px;
    height: 25px;
    filter: invert(1);
  }
  
  .icon-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .icon-btn .badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #dc3545;
    color: white;
    font-size: 10px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
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
  }
  </style>