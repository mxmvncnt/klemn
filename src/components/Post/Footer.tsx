import { BsFillReplyAllFill } from 'react-icons/bs';
import styles from '../../styles/Post.module.css'
import { AiFillDislike, AiFillLike, AiOutlineShareAlt } from 'react-icons/ai';
import { AnimatePresence } from 'framer-motion';
import SectionReponses from '../SectionReponses';
import { useState } from 'react';
import { auth } from '../../firebase';
import toast from 'react-hot-toast';

interface FooterProps {
    idPost: string;
    nombreLike: number;
    nombreDislike: number;
    nombrePartage: number;
    nombreCommentaire: number;
    isPostFullScreen: Boolean;
}

const PostFooter = (props: FooterProps) => {
    const [isReponsesOpen, setIsReponsesOpen] = useState(false);
    const [postScore, setPostScore] = useState(props.nombreLike - props.nombreDislike)
    const [userVote, setUserVote] = useState() // le vote de lutilisateur pour afficher le bouton en couleur ou non

    function handleVote(score: number) {
        auth.currentUser?.getIdToken(/* forceRefresh */ true)
            .then((idToken) => {
                fetch('http://localhost:1111/vote', {
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
                    console.log('before', postScore)
                    console.log('diff', score)
                    console.log('result:', response['postScoreDifference'] + postScore)
                        setPostScore(response['postScoreDifference'] + postScore)
                    }).catch((error) => {
                        console.log(error)
                        toast.error('Une erreur est survenue');
                    })
            })
    }

    return (
        <div>
            <div className={styles.footer}>

                <div className={styles.bouton_interraction} id={styles.bouton_interraction_reply} onClick={() => setIsReponsesOpen(!isReponsesOpen)}>
                    <BsFillReplyAllFill className={styles.icone} id={styles.icone_reply} />
                    <span className={styles.interraction_count}>{props.nombreCommentaire}</span>
                </div>

                <div className={styles.like_dislike_container}>
                    <div className={styles.bouton_interraction} id={styles.bouton_interraction_like} onClick={() => handleVote(1)}>
                        <AiFillLike className={styles.icone} id={styles.icone_like} />
                    </div>

                    <span className={styles.interraction_count}>{postScore}</span>

                    <div className={styles.bouton_interraction} id={styles.bouton_interraction_dislike} onClick={() => handleVote(-1)}>
                        <AiFillDislike className={styles.icone} id={styles.icone_dislike} />
                    </div>
                </div>


                <div className={styles.bouton_interraction} id={styles.bouton_interraction_partage}>
                    <AiOutlineShareAlt className={styles.icone} id={styles.icone_partage} />
                    <span className={styles.interraction_count}>{props.nombrePartage}</span>
                </div>
            </div>

            {!props.isPostFullScreen && (
                <AnimatePresence>
                    {isReponsesOpen ? <SectionReponses idParent={props.idPost} /> : ''}
                </AnimatePresence>)}

        </div>
    )
}

export default PostFooter;