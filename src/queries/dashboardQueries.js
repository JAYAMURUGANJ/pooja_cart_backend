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
  p.name AS product_name,
  SUM(pu.in_stock) AS total_stock
FROM products p
JOIN product_units pu ON pu.product_id = p.id
GROUP BY p.id, p.name
HAVING total_stock <= ?
ORDER BY total_stock ASC
LIMIT ? OFFSET ?;
`;

module.exports = {
    getDashboardContent,
    getLowStockProducts
};
