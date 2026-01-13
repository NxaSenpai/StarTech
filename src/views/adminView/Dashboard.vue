<template>
  <div class="page-wrapper">
    <div class="admin-layout">

      <AdminHeader :userName="adminName" :notificationCount="notifications" />
      
      <AdminSidebar @settings-click="handleSettingsClick" />

      <main class="content-area">
        <div class="top-row">
          <h1 class="page-title">Dashboard Overview</h1>
          <div class="date-filter">
            <select class="filter-select">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
        </div>

        <section class="overviews">
          <div class="cards">
            <div class="card">
              <div class="card-header">
                <img class="card-icon" src="/benefitIcon.png">
                <div class="card-info">
                  <p class="label">Total Sales</p>
                  <h1 class="value">$12,624</h1>
                </div>
              </div>
              <div class="trend green">
                <span class="icon">↗</span>
                <span>6.4% from last month</span>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <img class="card-icon" src="/orderIcon.png">
                <div class="card-info">
                  <p class="label">Total Orders</p>
                  <h1 class="value">120</h1>
                </div>
              </div>
              <div class="trend green">
                <span class="icon">↗</span>
                <span>12.4% from last month</span>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <img class="card-icon" src="/userIcon.png">
                <div class="card-info">
                  <p class="label">Total Customers</p>
                  <h1 class="value">95</h1>
                </div>
              </div>
              <div class="trend red">
                <span class="icon">↘</span>
                <span>2.4% from last month</span>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <img class="card-icon" src="/alertIcon.png">
                <div class="card-info">
                  <p class="label">Low Stock</p>
                  <h1 class="value">18</h1>
                </div>
              </div>
              <p class="card-note">Items need restocking</p>
            </div>
          </div>
        </section>

        <section class="stats-container">
          <div class="stats-column wide">
            <div class="chart-box">
              <div class="chart-header">
                <h3>Sales Analytics</h3>
                <div class="chart-tabs">
                  <button class="tab active">Revenue</button>
                  <button class="tab">Orders</button>
                </div>
              </div>
              <apexchart 
                type="area" 
                height="300" 
                :options="salesChartOptions" 
                :series="salesChartSeries"
              ></apexchart>
            </div>
          </div>

          <div class="stats-column">
            <div class="chart-box">
              <h3>Most Sales Categories</h3>
              <apexchart 
                type="bar" 
                height="300" 
                :options="categoryChartOptions" 
                :series="categoryChartSeries"
              ></apexchart>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';
import AdminHeader from '@/components/AdminHeader.vue';
import AdminSidebar from '@/components/AdminSidebar.vue';

export default {
  name: "Dashboard",
  components: {
    apexchart: VueApexCharts,
    AdminHeader,
    AdminSidebar
  },
  data() {
    return {
      adminName: 'Admin',
      notifications: 3,
      
      salesChartSeries: [{
        name: 'Revenue',
        data: [4200, 5300, 4800, 6100, 7200, 5800, 5500, 9200, 8800, 10500, 11200, 12624]
      }],
      salesChartOptions: {
        chart: {
          type: 'area',
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        colors: ['#0b6cf0'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
          }
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          labels: { style: { colors: '#6c757d' } }
        },
        yaxis: {
          labels: {
            style: { colors: '#6c757d' },
            formatter: (val) => '$' + val
          }
        },
        grid: {
          borderColor: '#f1f1f1',
        },
        tooltip: {
          y: { formatter: (val) => '$' + val }
        }
      },

      categoryChartSeries: [{
        name: 'Sales',
        data: [15000, 28000, 18000, 32000, 12000, 24000]
      }],
      categoryChartOptions: {
        chart: {
          type: 'bar',
          toolbar: { show: false }
        },
        plotOptions: {
          bar: {
            borderRadius: 8,
            columnWidth: '60%',
            distributed: true
          }
        },
        colors: ['#0b6cf0', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
        dataLabels: { enabled: false },
        xaxis: {
          categories: ['Kitchen', 'PCs', 'Refrigerator', 'Smart TV', 'Audio', 'Others'],
          labels: { style: { colors: '#6c757d' } }
        },
        yaxis: {
          labels: {
            style: { colors: '#6c757d' },
            formatter: (val) => '$' + (val / 1000) + 'K'
          }
        },
        legend: { show: false },
        grid: { borderColor: '#f1f1f1' }
      },

      stockChartSeries: [52.1, 22.8, 13.9, 11.2, 20],
      stockChartOptions: {
        chart: { type: 'donut' },
        labels: ['Kitchen appliances', 'PCs & laptop', 'Refrigerator', 'Smart home', 'Others'],
        colors: ['#0b6cf0', '#a050a0', '#3b5998', '#343a40', '#28a745'],
        legend: {
          position: 'bottom',
          labels: { colors: '#6c757d' }
        },
        plotOptions: {
          pie: {
            donut: {
              size: '70%',
              labels: {
                show: true,
                total: {
                  show: true,
                  label: 'Total Stock',
                  color: '#343a40'
                }
              }
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => val.toFixed(1) + '%'
        }
      }
    };
  },
  methods: {
    handleSettingsClick() {
      console.log('Settings clicked');
    }
  }
};
</script>

<style scoped>
.page-wrapper {
  color: black;
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
  grid-template-columns: 260px 1fr;
  grid-template-rows: 70px 1fr;
  grid-template-areas:
    "header header"
    "sidebar content";
}

.content-area {
  grid-area: content;
  padding: 30px 40px; 
  overflow-y: auto;
  height: calc(100vh - 70px);
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title {
  color: #111;
  font-weight: 700;
  font-size: 28px; 
  margin: 0;
}

.date-filter {
  display: flex;
  gap: 10px;
}

.filter-select {
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: white;
  color: #495057;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:hover {
  border-color: #0b6cf0;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e9ecef; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.3s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(11, 108, 240, 0.15);
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 15px;
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-header img {
  width: 20px;
  height: 20px;
}

.card-info {
  flex-grow: 1;
}

.card .label {
  color: #6c757d;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
}

.card .value {
  font-size: 28px;
  margin: 0;
  color: #212529;
  font-weight: 700;
  line-height: 1.2;
}

.trend {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  gap: 4px;
}

.icon {
  font-size: 14px;
}

.green { color: #28a745; }
.red { color: #dc3545; }

.card-note {
  color: #6c757d;
  font-size: 12px;
  margin: 0;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stats-column {
  min-width: 0;
  width: 100%;
}

.stats-column.wide {
  grid-column: 1 / -1;
}

.chart-box,
.stock-box {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px; 
  border: 1px solid #e9ecef; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.04); 
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-box h3,
.stock-box h3 {
  color: #343a40;
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
}

.chart-tabs {
  display: flex;
  gap: 10px;
}

.tab {
  padding: 6px 16px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
  color: #6c757d;
}

.tab.active {
  background: #0b6cf0;
  color: white;
  border-color: #0b6cf0;
}

.tab:hover:not(.active) {
  background: #f8f9fa;
}

@media (max-width: 1200px) {
  .admin-layout {
    grid-template-columns: 220px 1fr;
  }
}

@media (max-width: 968px) {
  .cards {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .stats-column.wide {
    grid-column: 1;
  }
}
</style>