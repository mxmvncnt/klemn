const express = require('express')
const app = express()
const { pool, admin } = require('../serveur.js')
const logger = require('../logger.js')

module.exports = app.get('/:id_compte', (req, res) => {
    const idToken = req.headers.authorization;

    admin.auth().verifyIdToken(idToken, true).then((payload) => {
        const userId = payload.uid;

        pool.query(`
            SELECT c.id_compte, c.url_image_profil, c.nom_utilisateur, p.compte_id_proprio, p.id_projet, p.titre_projet, p.description_projet, id_demande_collab
                FROM demande_collab
                INNER JOIN compte c ON demande_collab.compte_id_compte = c.id_compte
                INNER JOIN projet p ON demande_collab.projet_id_projet = p.id_projet
                WHERE p.compte_id_proprio = ? 
                AND demande_collab.est_accepte IS NULL;`, 
            [userId],
            function(err, results, fields) {
                if (err) {
                    res.status(500).send()
                    logger.info(JSON.stringify(err))
                }
                else if (results) {
                    res.send(results)
                }
            })
    }).catch((error) => {
        res.status(500).send("ERREUR: " + error.code)
    });
})