const queries = require("../queries/dashboardQueries");
const { successResponse } = require("../utils/responseHelper");
const asyncHandler = require("../utils/asyncHandler");
const queryAsync = require("../utils/dbQuery");
const { throwError } = require("../utils/errorHandler");

// Get Dashboard Content
const getDashboardContent = asyncHandler(async (req, res) => {
    try {
        const { lang = "en" } = req.query;

        // low stock products limits
        const threshold = 5;
        const page = parseInt(req.query.page || '0');
        const limit = parseInt(req.query.limit || '5');
        const offset = page * limit;

        // top  selling products limits
        const topPage = parseInt(req.query.top_page || '0');
        const topLimit = parseInt(req.query.top_limit || '5');
        const topOffset = topPage * topLimit;

        // recent orders limits
        const recentPage = parseInt(req.query.recent_orders_page || '0');
        const recentLimit = parseInt(req.query.recent_orders_limit || '5');
        const recentOffset = recentPage * recentLimit;

        const [dashboardContent, lowStockRows, topSellingRows, recentOrders] = await Promise.all([
            await queryAsync(queries.getDashboardContent, [lang]),
            await queryAsync(queries.getLowStockProducts, [lang, threshold, limit, offset]),
            await queryAsync(queries.getTopSellingProducts, [lang, topLimit, topOffset]),
            await queryAsync(queries.getRecentOrders, [recentLimit, recentOffset]),
        ]);

        var data = dashboardContent[0];

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
                store_name: "Palani store"
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
                low_stock: lowStockRows,
                top_selling: topSellingRows
            },
            recent_orders: recentOrders,

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