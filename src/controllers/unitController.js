const queries = require("../queries/unitQueries");
const { successResponse } = require("../utils/responseHelper");
const asyncHandler = require("../utils/asyncHandler");
const queryAsync = require("../utils/dbQuery");
const { throwError } = require("../utils/errorHandler");


const getAllUnits = asyncHandler(async (req, res) => {
    const language = req.query.lang || 'en'; // Default to 'en' if no language is provided
    const result = await queryAsync(queries.getAllUnits, [language]);
    successResponse(res, { data: result, message: "Units retrieved successfully" });
});


const getUnitById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const language = req.query.lang || 'en';
    const result = await queryAsync(queries.getUnitById, [id, language]);
    if (result.length === 0) throwError("Unit not found", 404);
    successResponse(res, { data: result[0], message: "Unit retrieved successfully" });
});


const createUnit = asyncHandler(async (req, res) => {
    const { translations } = req.body; // Expecting array [{ lang: 'en', name: 'Kilogram', abbreviation: 'kg' }, {...}]
    
    // Insert into unit_master (returns the new unit_id)
    const masterResult = await queryAsync(queries.createUnitMaster);
    const unitId = masterResult.insertId;

    // Insert translations
    for (const { lang, name, abbreviation } of translations) {
        await queryAsync(queries.createUnitTranslation, [unitId, lang, name, abbreviation]);
    }

    successResponse(res, {
        data: { id: unitId, translations },
        message: "Unit created successfully",
        statusCode: 201
    });
});


const updateUnit = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { lang, name, abbreviation } = req.body; // Expecting single language update

    const result = await queryAsync(queries.updateUnitTranslation, [name, abbreviation, id, lang]);
    if (result.affectedRows === 0) throwError("Unit not found or language entry missing", 404);

    // Fetch updated data
    const updatedUnit = await queryAsync(queries.getUnitById, [id, lang]);
    successResponse(res, { 
        message: "Unit updated successfully",
        data: updatedUnit[0]
    });
});


const deleteUnit = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Delete translations first (to avoid constraint errors)
    await queryAsync(queries.deleteUnitTranslations, [id]);

    // Delete unit from unit_master
    const result = await queryAsync(queries.deleteUnitMaster, [id]);
    if (result.affectedRows === 0) throwError("Unit not found", 404);

    successResponse(res, { 
        message: "Unit deleted successfully",
        data: { id: Number(id) }
    });
});

module.exports = { 
    getAllUnits,
    getUnitById,
    createUnit, 
    updateUnit, 
    deleteUnit 
};
