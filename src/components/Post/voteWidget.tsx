import { BsFillReplyAllFill } from 'react-icons/bs';
import styles from '../../styles/Post.module.css'
import { AiFillDislike, AiFillLike, AiOutlineShareAlt } from 'react-icons/ai';
import { AnimatePresence, motion, useAnimate } from 'framer-motion';
import SectionReponses from '../SectionReponses';
import { useEffect, useRef, useState } from 'react';
import { auth } from '../../firebase';
import toast from 'react-hot-toast';

interface FooterProps {
    idPost: string;
    nombreLike: number;
    nombreDislike: number;
    userVote: number;
}

const VoteWidget = (props: FooterProps) => {
    const [postScore, setPostScore] = useState(props.nombreLike - props.nombreDislike)
    const [userVote, setUserVote] = useState(props.userVote || 0) // le vote de lutilisateur pour afficher le bouton en couleur ou non
    const [scoreDifference, setScoreDifference] = useState(0)
    const [scopeLike, animateLike] = useAnimate()
    const [scopeDislike, animateDisike] = useAnimate()
    const [scopeNumberScore, animateNumberScore] = useAnimate()

    // const [cancelledVote, setCancelledVote] = useRef(false)
    const cancelledVoteRef = useRef(false);

    // useEffect(() => {
    //     console.info("cancelledVote UPDATED!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    //     console.info(cancelledVote)
    // }, [cancelledVote])

    function handleVote(score: number) {


        const onVoteIconAnimationType = localStorage.getItem("voteClickAnimation")
        const onVoteTextAnimationType = localStorage.getItem("voteTextAnimation")


        if (score > 0) {
            if (userVote + score == 2) {
                cancelledVoteRef.current = true
            }
            else cancelledVoteRef.current = false
        }

        if (score < 0) {
            if (userVote + score == -2) {
                cancelledVoteRef.current = true
            }
            else cancelledVoteRef.current = false
        }

        // Animation pouce LIKE
        if (score > 0) {

            // afficher animation speciale shake
            if (cancelledVoteRef.current && onVoteIconAnimationType === "shake") {
                animateLike(scopeLike.current, {
                    x: [-10, 10, -7, 3, 0],
                }, {
                    duration: 0.4,
                    ease: "anticipate"
                })
            }

            // animation normale
            else {
                animateLike(scopeLike.current, {
                    scale: 1.3,
                    y: '-18px',
                    rotate: Math.floor(Math.random() * 40) - 20,
                }, { duration: 0.15, ease: "anticipate" })
                    .then(() => {
                        animateLike(scopeLike.current, {
                            scale: 1,
                            y: '0px',
                            rotate: 0,
                        }, { duration: 0.3, type: "spring", bounce: 0.6 })
                    })
            }
        }

        // Animation pouce DISLIKE
        if (score < 0) {
            // animation speciale shake
            if (cancelledVoteRef.current && onVoteIconAnimationType === "shake") {
                animateDisike(scopeDislike.current, {
                    x: [-10, 10, -7, 3, 0],
                }, {
                    duration: 0.4,
                    ease: "anticipate"
                })
            }

            // Animation normale
            else {
                animateDisike(scopeDislike.current, {
                    scale: 0.7,
                    y: '18px',
                    rotate: Math.floor(Math.random() * 40) - 20,
                }, { duration: 0.15, ease: "anticipate" })
                    .then(() => {
                        animateDisike(scopeDislike.current, {
                            scale: 1,
                            y: '0px',
                            rotate: 0,
                        }, { duration: 0.3, type: "spring", bounce: 0.6 })
                    })
            }
        }

        auth.currentUser?.getIdToken(/* forceRefresh */ true).then((idToken) => {

            // Animation slide texte vers le bas (LIKE et CANCEL DISLIKE)
            if (cancelledVoteRef.current || score > 0) {
                animateNumberScore(scopeNumberScore.current, {
                    y: onVoteTextAnimationType === "slide" && '20px',
                    opacity: 0,
                }, {
                    duration: 0.1
                })
            }

            // Animation slide texte vers le haut (DISLIKE et CANCEL LIKE)
            else if (cancelledVoteRef.current || score < 0) {
                animateNumberScore(scopeNumberScore.current, {
                    y: onVoteTextAnimationType === "slide" && '-20px',
                    opacity: 0,
                }, {
                    duration: 0.1
                })
            }

            fetch(props.idPost === "0" ? '0' : 'http://localhost:1111/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: auth.currentUser?.uid,
                    post_id: props.idPost,
                    score: score,
                    firebase_id_token: idToken
                }),
            }).then(response => response.json())
                .then(response => {
                    setPostScore(response['postScoreDifference'] + postScore)
                    setUserVote(response['currentUserVote'])
                    setScoreDifference(response['postScoreDifference'])
                }).catch((error) => {
                    console.log(error)
                    props.idPost != '0' && toast.error('Une erreur est survenue');
                }).then(() => {

                    console.log("LIKE & CANCEL DISLIKE", score > 0 || cancelledVoteRef.current && score < 0)
                    console.log("DISLIKE & CANCEL LIKE", score < 0 || cancelledVoteRef.current && score > 0)
                    // Animation slide texte vers le haut (LIKE et CANCEL DISLIKE)
                    if (score > 0 || cancelledVoteRef.current && score < 0) {
                        animateNumberScore(scopeNumberScore.current, {
                            y: onVoteTextAnimationType === "slide" && [-20, 0],
                            opacity: [0, 1],
                        }, {
                            duration: 0.1
                        })
                    }

                    // Animation slide texte vers le haut (DISLIKE et CANCEL LIKE)
                    else if (score < 0 || cancelledVoteRef.current && score > 0) {
                        animateNumberScore(scopeNumberScore.current, {
                            y: onVoteTextAnimationType === "slide" && [20, 0],
                            opacity: [0, 1],
                        }, {
                            duration: 0.1
                        })
                    }
                })
        })
    }

    return (
        <div>
            <motion.div className={styles.like_dislike_container} layout>
                <motion.div className={styles.bouton_interraction} id={styles.bouton_interraction_like} onClick={() => handleVote(1)}>
                    <div ref={scopeLike}>
                        <AiFillLike className={`styles.icone ${userVote === 1 && styles.liked_post}`} id={styles.icone_like} />
                    </div>

                </motion.div>

                <span ref={scopeNumberScore} className={styles.interraction_count}>{postScore}</span>

                <motion.div className={styles.bouton_interraction} id={styles.bouton_interraction_dislike} onClick={() => handleVote(-1)}>
                    <div ref={scopeDislike}>
                        <AiFillDislike className={`styles.icone ${userVote === -1 && styles.disliked_post}`} id={styles.icone_dislike} />
                    </div>
                </motion.div>
            </motion.div>

        </div>
    )
}

export default VoteWidget;