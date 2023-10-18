import styles from '../styles/GestionCollab.module.css';
import GestionDemandeCollab from '../components/GestionDemandeCollab'
import GestionProjetRapide from  '../components/GestionProjetRapide'
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function GestionCollab() {
    const navigate = useNavigate();

    // get demande de collab
    const [demandesCollab, setDemandesCollab] = useState<any[]>([])
   
    // https://builtin.com/software-engineering-perspectives/react-api 
    useEffect(() => {
        getDemandeCollab()
    }, []);


    return (
        <> 
        <div>  
            <div className={styles.conteneur_gestion_collab}>
                    <div className={styles.titre_mes_demandes}>
                        <h1>Mes demandes de collaboration</h1>
                    </div>
                    <br />
                    {/*Faire map sur retour de demande de collab*/}
                    {demandesCollab.map(({
                        id_compte,
                        url_image_profil,
                        nom_utilisateur,
                        id_projet,
                        titre_projet,
                        description_projet,
                        id_demande_collab
                    }) => { return <>
                    <GestionDemandeCollab 
                        id_compte={id_compte}
                        url_image_profil={url_image_profil}
                        nom_utilisateur={nom_utilisateur}

                        id_projet={id_projet}
                        titre_projet={titre_projet}
                        description_projet={description_projet}
                        id_demande_collab={id_demande_collab}
                        />
                    </>})}
                </div>

                <div className={styles.conteneur_gestion_projet}>
                    
                    <div className={styles.titre_mes_projets_rapide}>
                        <h1>Mes Projets - Edition Rapide</h1>
                    </div>

                    <GestionProjetRapide/>
                </div>

            </div>
        </> 
    )
    
    function getDemandeCollab() {    
        
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                // https://builtin.com/software-engineering-perspectives/react-api 
                fetch(`${process.env.REACT_APP_API_URL}/get-all-demande-collab/${uid}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },                
                })
                    .then(response => response.json())
                    .then(json => setDemandesCollab(json))
                    .catch(error => console.log(error));
            } else {
                navigate("/authenticate")
            }
        })
    }
} 

export default GestionCollab