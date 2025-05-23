const getDashboardContent = `
SELECT
  metrics.total_revenue,
  metrics.total_orders,
  today.today_orders,
  today.today_revenue,
  products.total_products,
  products.active_products,
  products.inactive_products,
  products.out_of_stock_products
FROM
  (SELECT SUM(total) AS total_revenue, COUNT(*) AS total_orders FROM orders) AS metrics,
  (SELECT COUNT(*) AS today_orders, SUM(total) AS today_revenue FROM orders WHERE DATE(order_date) = CURDATE()) AS today,
  (SELECT COUNT(*) AS total_products, 
  SUM(CASE WHEN p.is_active = 1 THEN 1 ELSE 0 END) AS active_products,
  SUM(CASE WHEN p.is_active = 0 THEN 1 ELSE 0 END) AS inactive_products,
  COUNT(DISTINCT p.id) - COUNT(DISTINCT pu_in_stock.product_id) AS out_of_stock_products
  FROM products p LEFT JOIN (
    SELECT DISTINCT product_id
    FROM product_units
    WHERE in_stock > 0
    ) AS pu_in_stock ON p.id = pu_in_stock.product_id
  ) AS products
`;

const getLowStockProducts = `
SELECT 
  p.id AS product_id,
  pt.name AS product_name,
  SUM(pu.in_stock) AS in_stock
FROM products p
JOIN product_units pu ON pu.product_id = p.id
JOIN product_translations pt ON pt.product_id = p.id
WHERE pt.language_code = ?
GROUP BY p.id, pt.name
HAVING in_stock <= ?
ORDER BY in_stock ASC
LIMIT ? OFFSET ?;
`;

const getTopSellingProducts = `
SELECT 
  p.id AS product_id,
  pt.name AS product_name,
  SUM(oi.quantity) AS total_sold
FROM order_items oi
JOIN products p ON p.id = oi.product_id
JOIN product_translations pt ON pt.product_id = p.id
WHERE pt.language_code = ?
GROUP BY p.id, pt.name
ORDER BY total_sold DESC
LIMIT ? OFFSET ?;
`;

const getRecentOrders = `
SELECT 
  o.id AS order_id,
  o.name AS customer_name,
  o.mobile_no,
  o.email,
  o.total AS order_total,
  o.order_status,
  o.payment_method,
  o.order_date
FROM orders o
ORDER BY o.order_date DESC
LIMIT ? OFFSET ?;
`;



module.exports = {
    getDashboardContent,
    getLowStockProducts,
    getTopSellingProducts,
    getRecentOrders
};
