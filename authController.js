// <-- MODIFIÉ : On importe le pool central depuis db.js
const pool = require('../db'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// --- SUPPRIMÉ ---
// On a enlevé toute la création du pool qui était ici, car elle est maintenant dans db.js

const register = async (req, res) => {
    const { email, password } = req.body;
    
    // Vérification simple
    if (!email || !password) {
        return res.status(400).json({ error: "L'email et le mot de passe sont requis." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO public.users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        // Log de l'erreur côté serveur pour le debug
        console.error("Erreur lors de l'enregistrement :", err.message);
        res.status(500).json({ error: "Une erreur est survenue lors de l'enregistrement." });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "L'email et le mot de passe sont requis." });
    }

    try {
        const result = await pool.query('SELECT * FROM public.users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '120d' });
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Email ou mot de passe invalide.' });
        }
    } catch (err) {
        console.error("Erreur lors de la connexion :", err.message);
        res.status(500).json({ error: "Une erreur est survenue lors de la connexion." });
    }
};

module.exports = { register, login };
