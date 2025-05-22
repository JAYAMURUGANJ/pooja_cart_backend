const queries = require("../queries/dashboardQueries");
const { successResponse } = require("../utils/responseHelper");
const asyncHandler = require("../utils/asyncHandler");
const queryAsync = require("../utils/dbQuery");
const { throwError } = require("../utils/errorHandler");

// Get Dashboard Content
const getDashboardContent = asyncHandler(async (req, res) => {
    try {
        const { lang = "en" } = req.query;
        const dashboartContent = await queryAsync(queries.getDashboardContent, [lang]);

        var data = dashboartContent[0];

        if (!data) {
            return throwError("No data found", 404);
        }
        const response = {
            timestamp: new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}),
            admin_user: {
                admin_id: "admin_001",
                name: "Admin",
                email: "admin@gmail.com",
                role: "Super Admin",
                last_login: "",
                profile_picture_url: "https://example.com/images/admins/ravi_kumar.jpg"
            },
            store: {
                store_id: "store_001",
                store_name: "UrbanCart"
            },
            metrics: {
                today_orders: data.today_orders,
                today_revenue: data.today_revenue,                
                total_orders: data.total_orders,
                total_revenue: data.total_revenue
            },
            products: {
                total_products: data.total_products,
                active_products: data.active_products,
                inactive_products: data.inactive_products,
                out_of_stock: data.out_of_stock_products,
                low_stock: [
                    {
                        product_id: "prod_0023",
                        product_name: "Wireless Mouse",
                        stock: 3
                    },
                    {
                        product_id: "prod_0091",
                        product_name: "Bluetooth Speaker",
                        stock: 5
                    }
                ],
                top_selling: [
                    {
                        product_id: "prod_0001",
                        product_name: "USB-C Charger",
                        units_sold: 420,
                        revenue: 6300.00
                    },
                    {
                        product_id: "prod_0004",
                        product_name: "Laptop Stand",
                        units_sold: 390,
                        revenue: 11700.00
                    }
                ]
            },
            recent_orders: [
                {
                    order_id: "order_001",
                    customer_name: "John Doe",
                    order_date: "2023-10-01",
                    total_amount: 100.00,
                    status: "Delivered"
                },
                {
                    order_id: "order_002",
                    customer_name: "Jane Smith",
                    order_date: "2023-10-02",
                    total_amount: 50.00,
                    status: "Pending"
                }
            ],

        };

        successResponse(res, { data: response, message: "Dashboard loaded Successfully" });
    } catch (error) {
        console.error("Database Query Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});



module.exports = {
    getDashboardContent,
};