const getDashboardContent = `
SELECT
  metrics.total_revenue,
  metrics.total_orders,
  today.today_orders,
  today.today_revenue,
  products.total_products,
  products.active_products,
  products.inactive_products
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

module.exports = {
    getDashboardContent
};
