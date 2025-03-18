const getAllUnits = `
    SELECT u.id, ut.language_code, ut.name, ut.abbreviation
    FROM unit_master u
    JOIN unit_translations ut ON u.id = ut.unit_id
    WHERE ut.language_code = ?;
`;

const getUnitById = `
    SELECT u.id, ut.language_code, ut.name, ut.abbreviation
    FROM unit_master u
    JOIN unit_translations ut ON u.id = ut.unit_id
    WHERE u.id = ? AND ut.language_code = ?;
`;

const createUnitMaster = "INSERT INTO unit_master () VALUES ();";

const createUnitTranslation = `
    INSERT INTO unit_translations (unit_id, language_code, name, abbreviation)
    VALUES (?, ?, ?, ?);
`;

const updateUnitTranslation = `
    UPDATE unit_translations 
    SET name = ?, abbreviation = ?
    WHERE unit_id = ? AND language_code = ?;
`;

const deleteUnitMaster = "DELETE FROM unit_master WHERE id = ?;";
const deleteUnitTranslations = "DELETE FROM unit_translations WHERE unit_id = ?;";

module.exports = {
    getAllUnits,
    getUnitById,
    createUnitMaster,
    createUnitTranslation,
    updateUnitTranslation,
    deleteUnitMaster,
    deleteUnitTranslations
};
