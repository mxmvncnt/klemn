import { useParams } from 'react-router';
import Bonjour from '../components/ComponentWithParameters';
import HelloWorldComponent from '../components/HelloWorldComponent';
import styles from '../styles/Profil.module.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PosteBlogue from '../components/Post/PosteBlogue';
import Post from '../components/Post';
import { auth } from '../firebase';
import toast from 'react-hot-toast'
import { onAuthStateChanged } from 'firebase/auth';

function Profil() {
    let { username } = useParams();
    const navigate = useNavigate();

    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [dateCreationCompte, setDateCreationCompte] = useState('');
    const [nombreAbonnes, setNombreAbonnes] = useState(0);
    const [nombreAbonnements, setNombreAbonnements] = useState(0);
    const [bio, setBio] = useState('');
    const [urlImageProfil, setUrlImageProfil] = useState('');
    const [urlImageBanniere, setUrlImageBanniere] = useState('');
    const [visitorFollowsUser, setVisitorFollowsUser] = useState(false)

    const [idCompte, setIdCompte] = useState('')

    const [userPosts, setUserPosts] = useState<any[]>([])
    const [loadingPosts, setLoadingPosts] = useState(true)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            fetch(`http://localhost:1111/profil`, {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    is_followed_by: auth.currentUser?.uid
                }),
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(response => {
                    let data = response

                    // if (!data) {
                    //     navigate("/404")
                    // }

                    setIdCompte(data.id_compte)
                    setNom(data.nom)
                    setPrenom(data.prenom)
                    setDisplayName(data.nom_affichage ? data.nom_affichage : username)
                    setDateCreationCompte(data.date_creation_compte)
                    setNombreAbonnes(data.nombre_abonnes)
                    setNombreAbonnements(data.nombre_abonnements)
                    setBio(data.biographie)
                    setUrlImageProfil(data.url_image_profil)
                    setUrlImageBanniere(data.url_image_banniere)
                    setVisitorFollowsUser(data.visitor_follows_profile)

                    return data.id_compte;

                }).then((userId) => {
                    fetch(`http://localhost:1111/user-posts/${userId}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    }).then(response => response.json())
                        .then(response => {
                            let data = response;

                            setUserPosts(data);
                            setLoadingPosts(false);
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                })
                .catch((error) => {
                    console.log(error)
                })
        });

    }, [username]);

    function followUser() {
        auth.currentUser?.getIdToken(/* forceRefresh */ true)
            .then((idToken) => {
                fetch('http://localhost:1111/follow-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: auth.currentUser?.uid,
                        wants_to_follow: idCompte,
                        firebase_id_token: idToken
                    }),
                }).then(response => response)
                    .then(response => {
                        if (response.status === 401) {
                            toast.error("Vous ne pouvez pas suivre le même compte plus d'une fois.");
                        }

                        if (response.status === 200) {
                            toast.success(`Vous suivez maintenant ${displayName}!`);
                            setNombreAbonnes(nombreAbonnes + 1)
                            setVisitorFollowsUser(true)
                        }

                    }).catch((error) => {
                        console.log(error)
                        toast.error('Une erreur est survenue');
                    })
            })
    }

    function unfollowUser() {
        auth.currentUser?.getIdToken(/* forceRefresh */ true)
            .then((idToken) => {
                fetch('http://localhost:1111/unfollow-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: auth.currentUser?.uid,
                        wants_to_unfollow: idCompte,
                        firebase_id_token: idToken
                    }),
                }).then(response => response)
                    .then(response => {
                        if (response.status === 401) {
                            toast.error("Vous ne suivez pas cet utilisateur.");
                        }

                        if (response.status === 200) {
                            toast.success(`Vous ne suivez plus ${displayName}.`);
                            setNombreAbonnes(nombreAbonnes - 1)
                            setVisitorFollowsUser(false)
                        }

                    }).catch((error) => {
                        console.log(error)
                        toast.error('Une erreur est survenue');
                    })
            })
    }

    return (
        <div className={styles.flex}>

            <div className={styles.header}>
                <img className={styles.photo_banniere} src={urlImageBanniere} />

                <div className={styles.sous_banniere}>
                    <img className={styles.photo_profil} src={urlImageProfil} />

                    <div className={styles.infos_profil}>
                        <h2 className={styles.nom}>{displayName}</h2>
                        <p className={styles.username}>@{username}</p>
                        {idCompte != auth.currentUser?.uid && auth.currentUser && visitorFollowsUser == false && (
                            <button className={`${styles.bouton_follow} global_bouton`} onClick={() => followUser()}>Suivre</button>
                        )}

                        {idCompte != auth.currentUser?.uid && auth.currentUser && visitorFollowsUser == true && (
                            <button className={`${styles.bouton_follow} global_bouton`} onClick={() => unfollowUser()}>Ne plus suivre</button>
                        )}
                    </div>

                </div>

                <div className={styles.follows}>
                    <div><p>{nombreAbonnes}</p> abonnés</div>
                    <div><p>{nombreAbonnements}</p> Abonnements</div>
                </div>

                <p className={styles.bio}>{bio}</p>
            </div>

            {loadingPosts && (
                <div>Chargement...</div>
            )}

            {userPosts?.map(({
                contenu,
                date_publication,
                id_compte,
                id_infos,
                id_parent,
                id_post,
                id_type_post,
                nombre_commentaires,
                nombre_dislikes,
                nombre_likes,
                nombre_partages,
                nombre_reposts,
                titre,
                url_image_profil
            }) => {
                return (
                    <Post
                        idPost={id_post}
                        idCompte={id_compte}
                        date={date_publication}
                        nomAffichage={displayName}
                        nomUtilisateur={username + ''}
                        titre={titre}
                        contenu={contenu}
                        nombreLike={nombre_likes}
                        nombreDislike={nombre_dislikes}
                        nombrePartage={nombre_partages}
                        nombreCommentaire={nombre_commentaires}
                        type={id_type_post}
                        isPostFullScreen={false} 
                        urlImageProfil={urlImageProfil} />
                )
            })}

        </div>
    );
}

export default Profil;
