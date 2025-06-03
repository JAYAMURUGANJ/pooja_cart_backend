// -- 1. Summary query
  const getTodayReportSummary = `SELECT
    COUNT(*) AS total_orders,
    SUM(total) AS total_revenue,
    AVG(total) AS average_order_value,
    COUNT(DISTINCT mobile_no) AS total_customers
  FROM orders
  WHERE order_date = CURDATE()`;

 const  getMonthlyReportSummary =  `SELECT
    DATE_FORMAT(order_date, '%Y-%m') AS month,
    COUNT(*) AS total_orders,
    SUM(total) AS total_revenue,
    AVG(total) AS average_order_value,
    COUNT(DISTINCT mobile_no) AS total_customers
   FROM orders
   WHERE YEAR(order_date) = YEAR(CURDATE())
  AND MONTH(order_date) = MONTH(CURDATE())
   GROUP BY month
   ORDER BY month;`;

  const getReportSummaryByDate = `SELECT
    COUNT(*) AS total_orders,
    SUM(total) AS total_revenue,
    AVG(total) AS average_order_value,
    COUNT(DISTINCT mobile_no) AS total_customers
  FROM orders
  WHERE DATE(order_date) BETWEEN ? AND ?`;

   const  getOverallReportSummary = 
   `SELECT
    COUNT(*) AS total_orders,
    SUM(total) AS total_revenue,
    AVG(total) AS average_order_value,
    COUNT(DISTINCT mobile_no) AS total_customers
    FROM orders`;

    // -- 2. Sales queries

  const getTodaySale =  `SELECT 
       DATE(order_date) AS date,
       COUNT(*) AS total_orders,
       SUM(total) AS total_revenue
       FROM orders
       WHERE order_date = CURDATE()`;

  const getMonthlySale =  `SELECT 
    DATE_FORMAT(order_date, '%Y-%m') AS month,
       DATE(order_date) AS date,
       COUNT(*) AS total_orders,
       SUM(total) AS total_revenue
        FROM orders
       WHERE YEAR(order_date) = YEAR(CURDATE())
      AND MONTH(order_date) = MONTH(CURDATE())
       GROUP BY month
       ORDER BY month;`;

  const getSaleByDate =  `SELECT 
       DATE(order_date) AS date,
       COUNT(*) AS total_orders,
       SUM(total) AS total_revenue
       FROM orders
        WHERE order_date BETWEEN ? AND ?
        GROUP BY DATE(order_date)
        ORDER BY date`;

  const getOverallSale =  `SELECT 
       DATE(order_date) AS date,
       COUNT(*) AS total_orders,
       SUM(total) AS total_revenue
       FROM orders`;


// -- 3. Order Status Summary
const getTodayOrderStatus =  `SELECT 
  order_status AS status,
  COUNT(*) AS count
FROM orders
WHERE order_date = CURDATE()`;

const getMonthlyOrderStatus =  `SELECT 
 DATE_FORMAT(order_date, '%Y-%m') AS month,
  order_status AS status,
  COUNT(*) AS count
 FROM orders
 WHERE YEAR(order_date) = YEAR(CURDATE())
      AND MONTH(order_date) = MONTH(CURDATE())
       GROUP BY month
       ORDER BY month`;

const getOrderStatusByDate =  `SELECT 
  order_status AS status,
  COUNT(*) AS count
FROM orders
 WHERE order_date BETWEEN ? AND ?
        GROUP BY DATE(order_date)
        ORDER BY order_date`;

const getOverallOrderStatus =  `SELECT 
  order_status AS status,
  COUNT(*) AS count
FROM orders`;

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
  getTodayReportSummary,
  getMonthlyReportSummary,
  getReportSummaryByDate,
  getOverallReportSummary,
  //sale
  getTodaySale,
  getMonthlySale,
  getSaleByDate,
  getOverallSale,
  // order status
  getTodayOrderStatus,
  getMonthlyOrderStatus,
  getOrderStatusByDate,
  getOverallOrderStatus,

  getPaymentMethodSummary,
  getTopProducts
};
