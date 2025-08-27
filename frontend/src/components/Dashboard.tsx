import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const vendor = JSON.parse(localStorage.getItem('vendor') || '{}');

  const { data: monthlyData, isLoading: monthlyLoading } = useQuery({
    queryKey: ['monthlySales', vendor.id],
    queryFn: () => analyticsService.getMonthlySales(vendor.id),
  });

  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ['productSales', vendor.id],
    queryFn: () => analyticsService.getProductSales(vendor.id),
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['vendorStats', vendor.id],
    queryFn: () => analyticsService.getVendorStats(vendor.id),
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('vendor');
    navigate('/login');
  };

  const productColumns: GridColDef[] = [
    { 
      field: 'productName', 
      headerName: 'Ürün Adı', 
      flex: 2,
      minWidth: 200,
    },
    { 
      field: 'totalQuantity', 
      headerName: 'Toplam Adet', 
      flex: 1,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
    },
    { 
      field: 'totalOrders', 
      headerName: 'Sipariş Sayısı', 
      flex: 1,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
    },
    { 
      field: 'totalSales', 
      headerName: 'Toplam Satış (₺)', 
      flex: 1,
      minWidth: 150,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (params: any) => `₺${params?.toLocaleString?.('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}`,
    },
  ];

  const formatCurrency = (value: number) => {
    return `₺${value?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Chart colors
  const chartColors = {
    primary: '#532D3C',
    secondary: '#B39DDB', 
    accent: '#F8BBD9',
    success: '#81C784',
    warning: '#FFB74D',
    error: '#E57373',
    info: '#64B5F6',
    gradient: ['#532D3C', '#B39DDB', '#F8BBD9', '#CE93D8', '#AB47BC', '#9C27B0']
  };

  // Prepare pie chart data for monthly sales
  const pieData = monthlyData?.data?.slice(0, 6).map((item: any, index: number) => ({
    name: item.month,
    value: item.totalSales,
    color: chartColors.gradient[index % chartColors.gradient.length]
  })) || [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ minHeight: '70px !important' }}>
          <Typography 
            variant="h5" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              fontSize: '1.8rem',
              letterSpacing: '0.02em',
              fontFamily: '"Inter", sans-serif'
            }}
          >
            LONCA.CO
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {vendor.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body1">{vendor.name}</Typography>
            <IconButton color="inherit" onClick={handleLogout} title="Çıkış">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Box sx={{ 
              mb: 4, 
              textAlign: 'center',
              py: 3,
              background: 'linear-gradient(135deg, rgba(232, 180, 227, 0.08) 0%, rgba(179, 157, 219, 0.08) 100%)',
              borderRadius: 3,
              border: '1px solid rgba(232, 180, 227, 0.15)'
            }}>
              <Typography variant="h3" gutterBottom sx={{ 
                fontWeight: 700, 
                color: '#fff',
                mb: 1
              }}>
                Vendor Dashboard
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'text.secondary',
                fontSize: '1.1rem'
              }}>
                Lonca üzerindeki satış performansınızı izleyin ve analiz edin
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #E8B4E3 0%, #D897D1 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(232, 180, 227, 0.3)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                      Toplam Gelir
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {statsLoading ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      ) : (
                        formatCurrency(statsData?.data?.totalRevenue || 0)
                      )}
                    </Typography>
                  </Box>
                  <AttachMoneyIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #B39DDB 0%, #9C27B0 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(179, 157, 219, 0.3)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                      Toplam Sipariş
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {statsLoading ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      ) : (
                        statsData?.data?.totalOrders || 0
                      )}
                    </Typography>
                  </Box>
                  <ShoppingCartIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.9)' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #F8BBD9 0%, #F48FB1 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(248, 187, 217, 0.3)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                      Ürün Sayısı
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {statsLoading ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      ) : (
                        statsData?.data?.totalProducts || 0
                      )}
                    </Typography>
                  </Box>
                  <InventoryIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.9)' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #CE93D8 0%, #AB47BC 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(206, 147, 216, 0.3)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                      En Çok Satan
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem' }} noWrap>
                      {statsLoading ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      ) : (
                        statsData?.data?.topProduct?.productName || 'N/A'
                      )}
                    </Typography>
                  </Box>
                  <TrendingUpIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.9)' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Sales Charts Section */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper sx={{ 
              p: 4, 
              height: 480,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,239,246,0.8) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(232, 180, 227, 0.2)'
            }}>
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 600, 
                color: 'primary.main',
                mb: 3,
                textAlign: 'center'
              }}>
                 Aylık Satış Performansı
              </Typography>
              {monthlyLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
                  <CircularProgress />
                </Box>
              ) : monthlyData?.data?.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart 
                    data={monthlyData.data
                      .filter((item: any) => item && item.totalSales !== undefined && item.totalOrders !== undefined)
                      .map((item: any) => ({ ...item, monthYear: `${item.month} ${item.year}` }))} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(232, 180, 227, 0.3)" />
                    <XAxis 
                      dataKey="monthYear" 
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <YAxis 
                      yAxisId="left"
                      tickFormatter={(value) => `₺${(value/1000).toFixed(0)}K`}
                      tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => {
                        if (name.includes('Satış')) return [formatCurrency(value), name];
                        return [value, name];
                      }}
                      labelStyle={{ color: '#000', fontWeight: 600 }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.95)', 
                        border: '1px solid rgba(232, 180, 227, 0.3)',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="totalSales"
                      fill={chartColors.primary}
                      fillOpacity={0.6}
                      stroke={chartColors.primary}
                      strokeWidth={2}
                      name="Toplam Satış (₺)"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="totalOrders"
                      fill={chartColors.secondary}
                      name="Sipariş Sayısı"
                      opacity={0.8}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <Alert severity="info">Henüz satış verisi bulunmamaktadır.</Alert>
              )}
            </Paper>
          </Grid>

          {/* Monthly Sales Distribution Pie Chart */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper sx={{ 
              p: 4, 
              height: 480,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,239,246,0.8) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(232, 180, 227, 0.2)'
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 600, 
                color: 'primary.main',
                mb: 3,
                textAlign: 'center'
              }}>
                 Aylık Satış Dağılımı
              </Typography>
              {monthlyLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
                  <CircularProgress />
                </Box>
              ) : pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.95)', 
                        border: '1px solid rgba(232, 180, 227, 0.3)',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Alert severity="info">Grafik için yeterli veri bulunmamaktadır.</Alert>
              )}
            </Paper>
          </Grid>

          <Grid size={12}>
            <Paper sx={{ 
              p: 4, 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,239,246,0.8) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(232, 180, 227, 0.2)'
            }}>
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 600, 
                color: 'primary.main',
                mb: 3,
                textAlign: 'center'
              }}>
                 Ürün Satış Detayları
              </Typography>
              {productLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : productData?.data?.length > 0 ? (
                <DataGrid
                  rows={productData.data.map((item: any, index: number) => ({
                    id: index,
                    ...item,
                  }))}
                  columns={productColumns}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 },
                    },
                  }}
                  pageSizeOptions={[10, 25, 50]}
                  disableRowSelectionOnClick
                  sx={{ minHeight: 400 }}
                />
              ) : (
                <Alert severity="info">Henüz ürün satış verisi bulunmamaktadır.</Alert>
              )}
            </Paper>
          </Grid>

          {/* Top Products Section */}
          

          {/* Sales vs Orders Comparison */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper sx={{ 
              p: 4, 
              height: 460,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,239,246,0.8) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(232, 180, 227, 0.2)'
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 600, 
                color: 'primary.main',
                mb: 3,
                textAlign: 'center'
              }}>
                 Aylık Sipariş Analizi
              </Typography>
              {monthlyLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
                  <CircularProgress />
                </Box>
              ) : monthlyData?.data?.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart 
                    data={monthlyData.data
                      .filter((item: any) => item && item.totalSales !== undefined)
                      .map((item: any) => ({ ...item, monthYear: `${item.month} ${item.year}` }))} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(232, 180, 227, 0.3)" />
                    <XAxis 
                      dataKey="monthYear" 
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => {
                        if (name.includes('Adet')) return [value, name];
                        return [value, name];
                      }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.95)', 
                        border: '1px solid rgba(232, 180, 227, 0.3)',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="totalOrders"
                      stackId="1"
                      stroke={chartColors.secondary}
                      fill={chartColors.secondary}
                      name="Sipariş Sayısı"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="totalQuantity"
                      stackId="1"
                      stroke={chartColors.accent}
                      fill={chartColors.accent}
                      name="Toplam Adet"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Alert severity="info">Grafik için yeterli veri bulunmamaktadır.</Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;