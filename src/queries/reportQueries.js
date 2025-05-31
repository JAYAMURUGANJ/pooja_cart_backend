// -- 1. Summary
 const getReportSummary = `SELECT 
  COUNT(*) AS total_orders,
  SUM(grand_total) AS total_revenue,
  AVG(grand_total) AS average_order_value,
  COUNT(DISTINCT customer_name) AS total_customers
FROM orders
WHERE order_time BETWEEN ? AND ?`;

// -- 2. Sales by Date
 const getSaleByDate =  `SELECT 
  DATE(order_time) AS date,
  COUNT(*) AS total_orders,
  SUM(grand_total) AS total_revenue
FROM orders
WHERE order_time BETWEEN ? AND ?
GROUP BY DATE(order_time)
ORDER BY date`;

// -- 3. Order Status Summary
const getOrderStatusSummary =  `SELECT 
  order_status AS status,
  COUNT(*) AS count
FROM orders
WHERE order_time BETWEEN ? AND ?
GROUP BY order_status`;

// -- 4. Payment Method Summary
 const getPaymentMethodSummary =   `SELECT 
  payment_method,
  COUNT(*) AS order_count,
  SUM(grand_total) AS revenue
FROM orders
WHERE order_time BETWEEN ? AND ?
GROUP BY payment_method`;

// -- 5. Top Products
const getTopProducts = `SELECT 
  oi.product_id,
  p.product_name,
  SUM(oi.quantity) AS quantity_sold,
  SUM(oi.total) AS revenue
FROM order_items oi
JOIN products p ON p.id = oi.product_id
JOIN orders o ON o.id = oi.order_id
WHERE o.order_time BETWEEN ? AND ?
GROUP BY oi.product_id, p.product_name
ORDER BY revenue DESC
LIMIT ? OFFSET ?`;




module.exports = {
  getReportSummary,
  getSaleByDate,
  getOrderStatusSummary,
  getPaymentMethodSummary,
  getTopProducts
};
