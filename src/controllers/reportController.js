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
      report_type,
      start_date,
      end_date,
      limit = 10,
      offset = 0,
      language_code = 'en'
    } = req.query;

    let summaryQuery = queries.getTodayReportSummary;
    let getSalesQuery = queries.getTodaySale;
    let orderStatusQuery = queries.getTodayOrderStatus ;
    // let paymentMethodQuery = ;
    // let topProductsQuery = ;
    //params
    let summaryParams = [];
    let getSalesParams = [];
    let orderStatusParams = [];
    

    switch (report_type) {
    case 'T':
      //queries
      summaryQuery = queries.getTodayReportSummary;
      getSalesQuery = queries.getTodaySale;
      orderStatusQuery = queries.getTodayOrderStatus;
     
    break;
    case 'M':
      //queries
      summaryQuery = queries.getMonthlyReportSummary;
      getSalesQuery = queries.getMonthlySale;
      orderStatusQuery = queries.getMonthlyOrderStatus;
      break;

    case 'A':
      //queries
      summaryQuery = queries.getOverallReportSummary;
      getSalesQuery = queries.getOverallSale;
      orderStatusQuery = queries.getOverallOrderStatus ;
      break;

    case 'R': 
     if (start_date === null || start_date === undefined) {
        throw new Error("start_date cannot be null or undefined. A valid start date is required.");
    }
    if (end_date === null || end_date === undefined) {
        throw new new Error("end_date cannot be null or undefined. A valid end date is required.");
    }

    // queries
      summaryQuery = queries.getReportSummaryByDate;
      getSalesQuery = queries.getSaleByDate;
      orderStatusQuery = queries.getOrderStatusByDate;

      // params
      summaryParams = [start_date, end_date];
      getSalesParams = [start_date, end_date];
      orderStatusParams = [start_date, end_date];
      break;
    default:
      summaryQuery = queries.getOverallReportSummary;
      getSalesQuery = queries.getTodaySale;
      
      break;
  }


    const [summary, salesByDate, orderStatusSummary, paymentMethodSummary,topProducts] = await Promise.all([
            await queryAsync(summaryQuery, summaryParams),
            await queryAsync(getSalesQuery, getSalesParams),
             await queryAsync(orderStatusQuery,orderStatusParams),
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