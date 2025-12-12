<template>
  <div class="page-wrapper">
    <div class="admin-layout">

      <header class="admin-header">
        <img class="logo-img" src="/logo.png" alt="">
      </header>

      <aside class="sidebar">
        <nav class="nav-links">
          <a href="#" class="nav-item active">Dashboard</a>
          <router-link to="/manageproduct" class="nav-item">Manage Product</router-link>
          <router-link to="/manageorder" class="nav-item">Manage Orders</router-link>
          <router-link to="/manageuser" class="nav-item">Manage Users</router-link>
        </nav>
        <div class="settings">
          <a href="#" class="nav-item">Setting</a>
        </div>
      </aside>

      <main class="content-area">
        <div class="top-row">
          <h1 class="page-title">Dashboard Overview</h1>
        </div>

        <section class="overviews">
          <div class="cards">
            <div class="card">
              <p class="label">Total Sales</p>
              <h1 class="value">$12,624</h1>
              <div class="trend green">
                <span class="icon">↗</span>
                <span>6.4%</span>
              </div>
            </div>

            <div class="card">
              <p class="label">Total Orders</p>
              <h1 class="value">120</h1>
              <div class="trend green">
                <span class="icon">↗</span>
                <span>12.4%</span>
              </div>
            </div>

            <div class="card">
              <p class="label">Total Customers</p>
              <h1 class="value">95</h1>
              <div class="trend red">
                <span class="icon">↘</span>
                <span>2.4%</span>
              </div>
            </div>

            <div class="card">
              <p class="label">Low Stock</p>
              <h1 class="value">18</h1>
            </div>
          </div>
        </section>

        <section class="stats-container">
          <div class="stats-column">
            <h3 class="major-title">Sales</h3>
            <div class="chart-box">
              <h3>Most Sales Categories</h3>

              <div class="bar-chart-visual">
                <div class="y-axis">
                  <div class="label">30K</div>
                  <div class="label">20K</div>
                  <div class="label">10K</div>
                  <div class="label">0</div>
                </div>
                <div class="bars-container">
                  <div class="bar" style="height: 45%;"><span class="x-label">A</span></div>
                  <div class="bar" style="height: 80%;"><span class="x-label">B</span></div>
                  <div class="bar" style="height: 55%;"><span class="x-label">C</span></div>
                  <div class="bar" style="height: 90%;"><span class="x-label">D</span></div>
                  <div class="bar" style="height: 30%;"><span class="x-label">E</span></div>
                  <div class="bar" style="height: 70%;"><span class="x-label">Other</span></div>
                </div>
              </div>

            </div>
          </div>

          <div class="stats-column">
            <h3 class="major-title">Stocks</h3>
            <div class="stock-box">
              <h3>Stock Levels</h3>
              <ul class="stock-list">
                <li class="color-light-blue"><span>Kitchen appliances</span><span>52.1%</span></li>
                <li class="color-purple"><span>PCs & laptop</span><span>22.8%</span></li>
                <li class="color-indigo"><span>Refrigerator</span><span>13.9%</span></li>
                <li class="color-black"><span>Smart home</span><span>11.2%</span></li>
                <li class="color-green"><span>Others</span><span>20%</span></li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
};
</script>

<style scoped>

.page-wrapper {
  background: #f8f9fa; 
  min-height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
}

.admin-layout {
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 70px 1fr;
  grid-template-areas:
    "header header"
    "sidebar content";
  border-radius: 0;
}

.admin-header {
  grid-area: header;
  background: #0b6cf0; 
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo-img {
  scale: .4;
  margin-left: -90px;
  filter: brightness(0) invert(1);
}

.sidebar {
  grid-area: sidebar;
  border-right: 1px solid #eee;
  padding: 20px;
  background: white;
  position: sticky;
  top: 70px;
  height: calc(100vh - 70px);
}

.nav-item {
  display: block;
  padding: 12px;
  margin: 5px 0;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
}
.nav-item.active {
  background: #e6f0ff;
  color: #0b6cf0;
}

.content-area {
  grid-area: content;
  padding: 40px; 
  overflow-y: auto;
  height: calc(100vh - 70px);
}

.page-title {
  color: #111;
  font-weight: 700;
  font-size: 24px; 
  margin-bottom: 25px; 
}

/* ---------- OVERVIEWS (THE CARDS) ---------- */

.cards {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
}

.card {
  background: #ffffff;
  padding: 24px;
  flex: 1;
  min-width: 200px;
  border-radius: 10px;
  border: 1px solid #eee; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.card .label {
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.card .value {
  font-size: 32px;
  margin: 0 0 8px 0;
  color: #212529;
  font-weight: 700;
  line-height: 1.2;
}

.trend {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  gap: 6px;
}

.icon {
  font-size: 16px;
  line-height: 1;
}

/* COLORS */
.green {
  color: #28a745;
}

.red {
  color: #dc3545;
}

/* ---------- BOTTOM SECTION LAYOUT ---------- */
.stats-container {
  display: flex;
  margin-top: 40px;
  gap: 25px;
  flex-wrap: wrap;
}

.stats-column {
  flex: 1;
  min-width: 300px;
}

.major-title {
  color: #343a40;
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 20px;
}

.chart-box,
.stock-box {
  background: #ffffff;
  padding: 24px;
  border-radius: 10px; 
  width: 100%;
  border: 1px solid #eee; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); 
}

.chart-box h3,
.stock-box h3 {
  color: #343a40;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

/* --- BAR CHART STYLES --- */

.bar-chart-visual {
  display: flex;
  height: 250px;
  padding-bottom: 5px;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: right;
  padding-right: 10px;
  border-right: 1px solid #dee2e6;
  height: 100%;
  font-size: 12px;
  color: #6c757d;
  position: relative;
}

.y-axis .label:first-child {
  margin-top: -8px;
}

.y-axis .label:last-child {
  margin-bottom: -8px;
}

.bars-container {
  flex-grow: 1;
  display: flex;
  align-items: flex-end;
  gap: 45px;
  padding: 0 40px;
  border-bottom: 1px solid #dee2e6;
  height: 100%;
}

.bar {
  width: 25px;
  background-color: #0b6cf0; 
  border-radius: 10px 10px 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.x-label {
  position: absolute;
  bottom: -20px;
  font-size: 12px;
  color: #6c757d;
  white-space: nowrap;
}


/* --- Stock List Styles --- */
.stock-list {
  list-style: none;
  padding: 0;
}

.stock-list li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 14px;
}

.stock-list li span:first-child {
  padding-left: 10px;
  position: relative;
  color: #6c757d;
}

.stock-list li span:first-child::before {
  content: '•';
  position: absolute;
  left: 0;
  font-size: 1.5em; 
  line-height: 1;
}

/* 1.Kitchen appliances */
.stock-list li.color-light-blue span:first-child::before {
  color: #0b6cf0;
}

/* 2.PCs & laptop */
.stock-list li.color-purple span:first-child::before {
  color: #a050a0;
}

/* 3.Refrigerator */
.stock-list li.color-indigo span:first-child::before {
  color: #3b5998;
}

/* 4.Smart home */
.stock-list li.color-black span:first-child::before {
  color: #343a40;
}

/* 5.Others */
.stock-list li.color-green span:first-child::before {
  color: #28a745;
}


/* Percentage value on the right */
.stock-list li span:last-child {
  color: #212529;
  font-weight: 600;
}
</style>