const pool = require('../db');

const getDiscothequeIdForUser = async (userId) => {
    const { rows } = await pool.query('SELECT id FROM public.discotheques WHERE user_id = $1 LIMIT 1', [userId]);
    return rows.length > 0 ? rows[0].id : null;
};

const getCodesByYear = async (req, res) => {
    // ... La version complète et correcte que nous avons déjà écrite ...
};

const saveCodes = async (req, res) => {
    // ... La version complète et correcte que nous avons déjà écrite ...
};

module.exports = { getCodesByYear, saveCodes };
