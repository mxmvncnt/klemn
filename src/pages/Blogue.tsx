import { Link, useNavigate } from 'react-router-dom';
import PosteBlogue from '../components/PosteBlogue';
import toast from 'react-hot-toast';
import { BlogueProp } from '../components/PosteBlogue';
import QuestionProp from '../components/PosteQuestion';
import PosteQuestion from '../components/PosteQuestion';
import BlogueForm from "../components/BlogueForm";
import {useState} from "react";

export interface PostProp {
    idPost: string;
    date: string;
    nom: string;
    prenom: string;
    nomUtilisateur: string;
    titre: string;
    contenu: string;
    type: string;
    status: boolean;
    meilleureReponse: number;
    nombreLike: number;
    nombrePartage: number;
    nombreCommentaire: number;
    nombreDislike: number;
    idCompte: string;
}




function Blogue() {
    const navigate = useNavigate();
    // const lesBlogues = chargerPosteBlogue();


    // Retourne une liste de 15 objet BlogueProp
    // function chargerPosteBlogue() {
    //     var listeBlogueProp: PostProp[] = [];

    //     fetch('http://localhost:1111/chargerPosts', {
    //         method: 'GET'
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             listeBlogueProp = data;
    //             return listeBlogueProp;
    //         })
    //         .catch((error) => {
    //             toast.error('Une erreur est survenue: ' + error.name)
    //         });

    //     return listeBlogueProp;
    // }

    // const listItems = lesBlogues.map((post: PostProp) => {
    //     if (post.type == "Blogue") {
    //         <div className='conteneurComposantPosteBlogue'>
    //             <PosteBlogue
    //                 idPost={post.idPost}
    //                 date={post.date}
    //                 nom={post.nom}
    //                 prenom={post.prenom}
    //                 nomUtilisateur={post.nomUtilisateur}
    //                 titre={post.titre}
    //                 contenu={post.contenu}
    //                 type={post.type}
    //             />
    //         </div>
    //     } else if (post.type == "Question") {
    //         <div className='conteneurComposantPosteQuestion'>
    //             <PosteQuestion
    //                 idPost={post.idPost}
    //                 date={post.date}
    //                 nom={post.nom}
    //                 prenom={post.prenom}
    //                 nomUtilisateur={post.nomUtilisateur}
    //                 titre={post.titre}
    //                 contenu={post.contenu}
    //                 type={post.type}
    //                 status={post.status}
    //                 meilleureReponse={post.meilleureReponse}
    //             />
    //         </div>
    //     }
    // }
    // );

    return (
        <div>
            <div>
                <div className='conteneurComposantPosteBlogue'>
                    <PosteBlogue
                        idPost={'1234'}
                        date={'2023-01-01'}
                        nom={'bob'}
                        prenom={'gratton'}
                        nomUtilisateur={'stephkill3r'}
                        titre={'mon post'}
                        contenu={'lorem ipsum lorem  ipsum lorem  ipsum lorem  ipsum lorem  ipsum lorem  ipsum lorem  ipsum lorem  ipsum lorem  ipsum lorem  ipsum lorem  ipsum lorem  ipsum lorem  ipsum lorem  ipsum lorem  ipsum lorem  ipsum lorem  ipsum lorem  ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum'}
                        type={'1'}
                        idCompte={'abcd'}
                        nombreLike={4}
                        nombreDislike={482}
                        nombrePartage={29}
                        nombreCommentaire={273}
                    />
                </div>

                {/* {
                    lesBlogues?.map((post: PostProp) => {
                        if (post.type == "Blogue") {
                            return (
                                <div className='conteneurComposantPosteBlogue'>
                                    <PosteBlogue
                                        idPost={'1234'}
                                        date={'2023-01-01'}
                                        nom={'stephane'}
                                        prenom={'bilodeau'}
                                        nomUtilisateur={'stephkill3r'}
                                        titre={'mon post'}
                                        contenu={'lorem ipsum'}
                                        type={'1'}
                                        idCompte={'abcd'}
                                        nombreLike={4}
                                        nombreDislike={482}
                                        nombrePartage={29}
                                        nombreCommentaire={273}
                                    />
                                </div>
                            )

                <BlogueForm/>
            </div>

        </div>


                        }

                        else if (post.type == "Question") {
                            <div className='conteneurComposantPosteQuestion'>
                                <PosteQuestion
                                    idPost={post.idPost}
                                    date={post.date}
                                    nom={post.nom}
                                    prenom={post.prenom}
                                    nomUtilisateur={post.nomUtilisateur}
                                    titre={post.titre}
                                    contenu={post.contenu}
                                    type={post.type}
                                    status={post.status}
                                    meilleureReponse={post.meilleureReponse}
                                    idCompte={post.idCompte}
                                    nombreLike={post.nombreLike}
                                    nombreDislike={post.nombreDislike}
                                    nombrePartage={post.nombrePartage}
                                    nombreCommentaire={post.nombreCommentaire}
                                />
                            </div>
                        }
                    })
                } */}
            </div>
            <button>Charger post plus ancien</button>
        </div>
    );
}

export default Blogue;
