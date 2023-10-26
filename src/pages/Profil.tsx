import { useParams } from 'react-router';
import styles from '../styles/Profil.module.css'
import { useEffect, useState } from 'react';
import Post from '../components/Post';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import FollowButton from '../components/FollowButton';
import { useAnimate } from 'framer-motion';
import InfiniteScroll from "react-infinite-scroll-component";

function Profil() {
    const OFFSET = 6;

    let { username } = useParams();

    const [userData, setUserData] = useState<any>('')

    const [displayName, setDisplayName] = useState('');
    const [nombreAbonnes, setNombreAbonnes] = useState(0);
    const [nombreAbonnesBefore, setNombreAbonnesBefore] = useState(nombreAbonnes);
    const [visitorFollowsUser, setVisitorFollowsUser] = useState(false)

    const [userPosts, setUserPosts] = useState<any[]>([])
    const [cursor, setCursor] = useState(0)
    const [isEndOfFeed, setIsEndOfFeed] = useState(false)


    const [followerNumberScope, animateFollowerNumber] = useAnimate()


    useEffect(() => {
        // Unfollow
        if (nombreAbonnes < nombreAbonnesBefore) {
            animateFollowerNumber(followerNumberScope.current, {
                y: -20,
                opacity: 0,
                scale: 0.5,
            }, {
                duration: 0.1
            })
                .then(() => setNombreAbonnesBefore(nombreAbonnes))
                .then(() => {
                    animateFollowerNumber(followerNumberScope.current, {
                        y: [20, 0],
                        opacity: [0, 1],
                        scale: 1,
                    }, {
                        duration: 0.1
                    })
                })
        }

        // Follow
        else if (nombreAbonnes > nombreAbonnesBefore) {
            animateFollowerNumber(followerNumberScope.current, {
                y: 20,
                opacity: 0,
                scale: 0.5,
            }, {
                duration: 0.1
            })
                .then(() => setNombreAbonnesBefore(nombreAbonnes))
                .then(() => {
                    animateFollowerNumber(followerNumberScope.current, {
                        y: [-20, 0],
                        opacity: [0, 1],
                        scale: 1,
                    }, {
                        duration: 0.1
                    })
                })
        }
    }, [nombreAbonnes])

    useEffect(() => {
        getUserData()
    }, [username])

    useEffect(() => {
        if (userData) getPosts()
    }, [userData])


    function getUserData() {

        onAuthStateChanged(auth, (user) => {
            fetch(`${process.env.REACT_APP_API_URL}/user/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': user?.uid || ''
                },
            }).then(response => response.json()).then(response => {
                let data = response

                console.log(response)

                setDisplayName(data.nom_affichage ? data.nom_affichage : username)
                setNombreAbonnes(data.nombre_abonnes)
                setVisitorFollowsUser(data.visitor_follows_profile)

                setUserData(data)
            }).catch((error) => {
                console.log(error)
            })
        })
    }


    function getPosts() {
        onAuthStateChanged(auth, (user) => {
            fetch(`${process.env.REACT_APP_API_URL}/post/user/${userData.id_compte}/${cursor}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': user?.uid || ''
                }
            }).then(response => response.json()).then(response => {
                let data = response["posts"]

                let newCursor = parseInt(response.newCursor)

                setCursor(newCursor)

                if (!newCursor) {
                    setIsEndOfFeed(true)
                }

                setUserPosts(userPosts.concat(data))
            }).catch((error) => {
                console.log(error)
            })
        }
        )

    }

    if (!userData) {
        return (
            <div>
                Chargement...
            </div>
        )
    }


    return (
        <div className={styles.flex}>

            <div className={styles.header}>
                <img className={styles.photo_banniere} src={userData.url_image_banniere} />

                <div className={styles.sous_banniere}>
                    <img className={styles.photo_profil} src={userData.url_image_profil} />

                    <div className={styles.infos_profil}>
                        <h2 className={styles.nom}>{userData.nom_affichage}</h2>
                        <p className={styles.username}>@{userData.nom_utilisateur}</p>
                        <FollowButton
                            userId={userData.id_compte}
                            displayName={userData.nom_affichage}
                            nombreAbonnes={nombreAbonnes}
                            setNombreAbonnes={setNombreAbonnes}
                            visitorFollowsUser={visitorFollowsUser}
                            setVisitorFollowsUser={setVisitorFollowsUser} />
                    </div>

                </div>

                <div className={styles.follows}>
                    <div><p ref={followerNumberScope}>{nombreAbonnesBefore}</p> abonnés</div>
                    <div><p>{userData.nombre_abonnements}</p> Abonnements</div>
                </div>

                <p className={styles.bio}>{userData.biographie}</p>
            </div>

            <InfiniteScroll
                dataLength={userPosts.length}
                next={() => getPosts()}
                hasMore={!isEndOfFeed} // Replace with a condition based on your data source
                loader={<p>Chargement...</p>}
                endMessage={<h1>Oh non! Vous avez terminé Klemn!</h1>}
            >
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
                    url_image_profil,
                    vote
                }) => {
                    return (
                        <Post
                            key={id_post}
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
                            urlImageProfil={userData.url_image_profil}
                            userVote={vote} />
                    )
                })}
            </InfiniteScroll>
        </div >
    );
}

export default Profil;