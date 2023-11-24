import { useRef, useState } from 'react';
import styles from '../../styles/SettingsPanel.module.css'
import { motion } from "framer-motion";
import { auth } from '../../firebase';
import toast from 'react-hot-toast';
import { Client } from '@passwordlessdev/passwordless-client';

function Securite() {
    const passwordlessClient = new Client({
        apiKey: "klemn:public:8557b931c74a43ae8990c94bbb5aa62c"
    });


    function addPasskey() {
        auth.currentUser?.getIdToken(/* forceRefresh */ true).then((idToken) => {
            fetch(process.env.REACT_APP_API_URL + '/user/passkeys/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': idToken
                }
            }).then(response => response.json()).then(response => {
                const token = response['token'];

                passwordlessClient.register(token, auth.currentUser?.email || '')
                    .then(verifyToken => {
                        console.log(verifyToken)
                        if (verifyToken) {
                            // Successfully registered!
                            console.log("passkey ajoute");
                        } else {
                            console.log("erreur de passkey");
                            // console.error(error);
                        }
                    })
            }).catch((error) => {
                toast.error(`Une erreur est survenue: (${error.code})`)
            })
        })
    }

    return (
        <div className={styles.container_parametres}>
            <motion.div initial={{ x: "-15%", opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <h1 className={'global_title'} id={styles["titleParametres"]}>Sécurité</h1>
                <div>
                    <button onClick={() => addPasskey()}>Ajouter passkey</button>
                </div>
            </motion.div>
        </div>
    );
}

export default Securite;