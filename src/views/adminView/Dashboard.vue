<template>
  <div class="page-wrapper">
    <div class="admin-layout">

      <AdminHeader :userName="adminName" :notificationCount="notifications" />
      
      <AdminSidebar @settings-click="handleSettingsClick" />

      <main class="content-area">
        <div class="top-row">
          <h1 class="page-title">Dashboard Overview</h1>
          <div class="date-filter">
            <select class="filter-select" v-model="selectedPeriod" @change="fetchDashboardData">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
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
                  <h1 class="value">${{ totalSales.toFixed(2) }}</h1>
                </div>
              </div>
              <div class="trend" :class="salesTrend >= 0 ? 'green' : 'red'">
                <span class="icon">{{ salesTrend >= 0 ? '↗' : '↘' }}</span>
                <span>{{ Math.abs(salesTrend).toFixed(1) }}% from last period</span>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <img class="card-icon" src="/orderIcon.png">
                <div class="card-info">
                  <p class="label">Total Orders</p>
                  <h1 class="value">{{ totalOrders }}</h1>
                </div>
              </div>
              <div class="trend" :class="ordersTrend >= 0 ? 'green' : 'red'">
                <span class="icon">{{ ordersTrend >= 0 ? '↗' : '↘' }}</span>
                <span>{{ Math.abs(ordersTrend).toFixed(1) }}% from last period</span>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <img class="card-icon" src="/userIcon.png">
                <div class="card-info">
                  <p class="label">Total Customers</p>
                  <h1 class="value">{{ totalCustomers }}</h1>
                </div>
              </div>
              <div class="trend" :class="customersTrend >= 0 ? 'green' : 'red'">
                <span class="icon">{{ customersTrend >= 0 ? '↗' : '↘' }}</span>
                <span>{{ Math.abs(customersTrend).toFixed(1) }}% from last period</span>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <img class="card-icon" src="/alertIcon.png">
                <div class="card-info">
                  <p class="label">Low Stock</p>
                  <h1 class="value">{{ lowStockCount }}</h1>
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
                  <button class="tab" :class="{ active: chartView === 'revenue' }" @click="chartView = 'revenue'">Revenue</button>
                  <button class="tab" :class="{ active: chartView === 'orders' }" @click="chartView = 'orders'">Orders</button>
                </div>
              </div>
              <apexchart 
                type="area" 
                height="300" 
                :options="currentChartOptions" 
                :series="chartView === 'revenue' ? revenueChartSeries : ordersChartSeries"
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
import axios from 'axios';

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
      selectedPeriod: '30',
      chartView: 'revenue',
      
      totalSales: 0,
      totalOrders: 0,
      totalCustomers: 0,
      lowStockCount: 0,
      salesTrend: 0,
      ordersTrend: 0,
      customersTrend: 0,
      
      revenueChartSeries: [{
        name: 'Revenue',
        data: []
      }],
      ordersChartSeries: [{
        name: 'Orders',
        data: []
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
          categories: [],
          labels: { style: { colors: '#6c757d' } }
        },
        yaxis: {
          labels: {
            style: { colors: '#6c757d' },
            formatter: (val) => '$' + val.toFixed(0)
          }
        },
        grid: {
          borderColor: '#f1f1f1',
        },
        tooltip: {
          y: { formatter: (val) => '$' + val.toFixed(2) }
        }
      },

      ordersChartOptions: {
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
          categories: [],
          labels: { style: { colors: '#6c757d' } }
        },
        yaxis: {
          labels: {
            style: { colors: '#6c757d' },
            formatter: (val) => Math.round(val)
          }
        },
        grid: {
          borderColor: '#f1f1f1',
        },
        tooltip: {
          y: { formatter: (val) => Math.round(val) + ' orders' }
        }
      },

      categoryChartSeries: [{
        name: 'Sales',
        data: []
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
          categories: [],
          labels: { style: { colors: '#6c757d' } }
        },
        yaxis: {
          labels: {
            style: { colors: '#6c757d' },
            formatter: (val) => '$' + (val / 1000).toFixed(1) + 'K'
          }
        },
        legend: { show: false },
        grid: { borderColor: '#f1f1f1' }
      },
    };
  },
  computed: {
    currentChartOptions() {
      return this.chartView === 'revenue' ? this.salesChartOptions : this.ordersChartOptions;
    }
  },
  mounted() {
    this.fetchDashboardData();
  },
  methods: {
    async fetchDashboardData() {
      try {
        await Promise.all([
          this.fetchOrders(),
          this.fetchProducts(),
          this.fetchCategories()
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    },

    async fetchOrders() {
      try {
        const response = await axios.get('http://localhost:3000/orders/all');
        const orders = response.data;
        
        console.log('Orders data:', orders[0]); // Debug: Check order structure
        
        const periodDays = parseInt(this.selectedPeriod);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - periodDays);
        
        // Filter orders by period
        const recentOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= cutoffDate;
        });
        
        // Calculate total sales and orders
        this.totalOrders = recentOrders.length;
        this.totalSales = recentOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        
        // Calculate total unique customers who placed orders
        // Check multiple possible field names for customer identification
        const uniqueCustomers = new Set();
        recentOrders.forEach(order => {
          const customerIdentifier = order.email || 
                                   order.deliveryInfo?.email || 
                                   order.userEmail || 
                                   order.customer?.email ||
                                   order.customerId;
          if (customerIdentifier) {
            uniqueCustomers.add(customerIdentifier);
          }
        });
        this.totalCustomers = uniqueCustomers.size;
        
        console.log('Unique customers:', this.totalCustomers); // Debug
        
        // Calculate trends (comparing to previous period)
        const previousCutoff = new Date(cutoffDate);
        previousCutoff.setDate(previousCutoff.getDate() - periodDays);
        
        const previousOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= previousCutoff && orderDate < cutoffDate;
        });
        
        const previousSales = previousOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        this.salesTrend = previousSales > 0 ? ((this.totalSales - previousSales) / previousSales) * 100 : 0;
        this.ordersTrend = previousOrders.length > 0 ? ((this.totalOrders - previousOrders.length) / previousOrders.length) * 100 : 0;
        
        // Calculate customer trend
        const previousUniqueCustomers = new Set();
        previousOrders.forEach(order => {
          const customerIdentifier = order.email || 
                                   order.deliveryInfo?.email || 
                                   order.userEmail || 
                                   order.customer?.email ||
                                   order.customerId;
          if (customerIdentifier) {
            previousUniqueCustomers.add(customerIdentifier);
          }
        });
        const previousCustomerCount = previousUniqueCustomers.size;
        this.customersTrend = previousCustomerCount > 0 
          ? ((this.totalCustomers - previousCustomerCount) / previousCustomerCount) * 100 
          : 0;
        
        // Generate chart data
        this.generateSalesChartData(recentOrders, periodDays);
        
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    },

    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:3000/products');
        const products = response.data;
        
        // Count low stock items (less than 10)
        this.lowStockCount = products.filter(p => p.inStock < 10).length;
        
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },

    async fetchCategories() {
      try {
        const [ordersResponse, productsResponse] = await Promise.all([
          axios.get('http://localhost:3000/orders/all'),
          axios.get('http://localhost:3000/products')
        ]);
        
        const orders = ordersResponse.data;
        const products = productsResponse.data;
        
        // Calculate sales by category
        const categorySales = {};
        
        orders.forEach(order => {
          order.items.forEach(item => {
            const product = products.find(p => p._id === item.productId);
            if (product) {
              const category = product.category || 'Others';
              if (!categorySales[category]) {
                categorySales[category] = 0;
              }
              categorySales[category] += item.price * item.quantity;
            }
          });
        });
        
        // Sort and get top 6 categories
        const sortedCategories = Object.entries(categorySales)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6);
        
        this.categoryChartOptions = {
          ...this.categoryChartOptions,
          xaxis: {
            categories: sortedCategories.map(([name]) => name),
            labels: { style: { colors: '#6c757d' } }
          }
        };
        
        this.categoryChartSeries = [{
          name: 'Sales',
          data: sortedCategories.map(([, value]) => value)
        }];
        
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },

    generateSalesChartData(orders, periodDays) {
      const dataPoints = periodDays === 7 ? 7 : periodDays === 30 ? 30 : 12;
      const labels = [];
      const revenueData = [];
      const ordersData = [];
      
      if (periodDays === 90) {
        // Monthly data for 3 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        
        for (let i = 2; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          labels.push(months[date.getMonth()]);
          
          const monthOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === date.getMonth() && 
                   orderDate.getFullYear() === date.getFullYear();
          });
          
          revenueData.push(monthOrders.reduce((sum, o) => sum + (o.total || 0), 0));
          ordersData.push(monthOrders.length);
        }
      } else {
        // Daily data
        for (let i = dataPoints - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          if (periodDays === 7) {
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
          } else {
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
          }
          
          const dayOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.toDateString() === date.toDateString();
          });
          
          revenueData.push(dayOrders.reduce((sum, o) => sum + (o.total || 0), 0));
          ordersData.push(dayOrders.length);
        }
      }
      
      console.log('Orders data for chart:', ordersData); // Debug
      
      // Update sales chart options
      this.salesChartOptions = {
        ...this.salesChartOptions,
        xaxis: {
          ...this.salesChartOptions.xaxis,
          categories: labels,
          labels: { style: { colors: '#6c757d' } }
        }
      };

      // Update orders chart options
      this.ordersChartOptions = {
        ...this.ordersChartOptions,
        xaxis: {
          ...this.ordersChartOptions.xaxis,
          categories: labels,
          labels: { style: { colors: '#6c757d' } }
        },
        yaxis: {
          ...this.ordersChartOptions.yaxis,
          labels: {
            style: { colors: '#6c757d' },
            formatter: (val) => {
              return val !== null && val !== undefined ? Math.round(val).toString() : '0';
            }
          },
          forceNiceScale: true,
          min: 0,
          tickAmount: 5
        }
      };
      
      // Ensure data is numeric
      this.revenueChartSeries = [{
        name: 'Revenue',
        data: revenueData.map(v => Number(v) || 0)
      }];
      
      this.ordersChartSeries = [{
        name: 'Orders',
        data: ordersData.map(v => Number(v) || 0)
      }];
      
      console.log('Final orders series:', this.ordersChartSeries); // Debug
    },

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