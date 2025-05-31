const queries = require("../queries/reportQueries");
const { successResponse } = require("../utils/responseHelper");
const asyncHandler = require("../utils/asyncHandler");
const queryAsync = require("../utils/dbQuery");
const { throwError } = require("../utils/errorHandler");

// Get Dashboard Content
const getReportContent = asyncHandler(async (req, res) => {
    ////
    try {
const {
      start_date,
      end_date,
      limit = 10,
      offset = 0,
      language_code = 'en'
    } = req.query;

    const [summary, salesByDate, orderStatusSummary, paymentMethodSummary,topProducts] = await Promise.all([
            await queryAsync(queries.getReportSummary, [start_date, end_date]),
            // await queryAsync(queries.getSaleByDate, [start_date, end_date]),
            // await queryAsync(queries.getOrderStatusSummary,    [start_date, end_date]),
            // await queryAsync(queries.getPaymentMethodSummary,[start_date, end_date]),
            // await queryAsync(queries.getTopProducts,  [start_date, end_date, parseInt(limit), parseInt(offset)]),
        ]);


   const response = {
      filters: {
        start_date,
        end_date,
        language_code,
        limit: parseInt(limit),
        offset: parseInt(offset)
      },
      summary: summary[0],
      charts: {
        sales_by_date: salesByDate,
        order_status_summary: orderStatusSummary,
        payment_method_summary: paymentMethodSummary
      },
      top_products: topProducts
    };

        successResponse(res, { data: response, message: "Report loaded Successfully" });
    } catch (error) {
        console.error("Database Query Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});



module.exports = {
    getReportContent,
};