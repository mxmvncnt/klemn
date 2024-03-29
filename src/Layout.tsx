import { BrowserRouter, Navigate, Route, RouterProvider, Routes, createBrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import './styles/global.css'
import AccueilConnecte from "./pages/AccueilConnecte";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Projets from "./pages/Projets";
import Landing from "./pages/Landing";
import Profil from "./pages/Profil";
import Erreur404 from "./pages/404";
import Parametres from "./pages/settings/Parametres";
import ModifierProfil from "./pages/settings/ModifierProfil";
import PostFullScreen from "./pages/PostFullScreen";
import Home from "./pages/Home";
import Interface from "./pages/settings/Interface";
import GestionCollab from "./pages/GestionCollab";
import ProjetForm from './pages/ProjetForm';
import PageKlemn from './pages/klemn';

import README from "./pages/AProposReadMe";
import Securite from "./pages/settings/Securite";
import ModifProjetForm from "./pages/ModifProjetForm";


function Layout() {

    /*Set Theme on Refresh*/
    let hueLS = parseInt(window.localStorage.getItem('hue') || "270");
    let saturationLS = parseInt(window.localStorage.getItem('saturation') || "30");

    function changeTheme(hue: number, saturation: number) {
        document.documentElement.style.setProperty('--base_h', hue.toString())
        document.documentElement.style.setProperty('--base_s', saturation.toString() + "%")
    }

    useEffect(() => {
        if (localStorage.getItem("hue") === null || localStorage.getItem("saturation") === null) {
            window.localStorage.setItem('hue', "270");
            window.localStorage.setItem('saturation', "30");
        }

        if (localStorage.getItem("hue") !== null && localStorage.getItem("saturation") !== null) {
            changeTheme(hueLS, saturationLS);
        }
    }, []);

    return (
        <>
            <BrowserRouter>
                <Header />
                <Toaster />
                <body>
                    <Routes>
                        {/* Gestion des erreurs 404 */}
                        <Route path="/404" element={<Erreur404 />} />
                        <Route path="*" element={<Navigate to="/404" />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/authenticate" element={<Landing />} />
                        <Route path="/u/:username" element={<Profil />} />
                        <Route path="/p/:postId" element={<PostFullScreen />} />
                        <Route path="/parametres" element={<Parametres />}>
                            <Route path="profil" element={<ModifierProfil />} />
                            <Route path="securite" element={<Securite />} />
                            <Route path="interface" element={<Interface />} />
                        </Route>
                        <Route path="/gestion" element={<GestionCollab />} />
                        <Route path="/projet" element={<ProjetForm />} />
                        <Route path="/projet/:projetId" element={<ModifProjetForm />} />
                        <Route path="/klemn" element={<PageKlemn />} />
                        <Route path="/apropos" element={<README />} />
                    </Routes>
                </body>
                <Footer />
            </BrowserRouter>
        </>
    );
}

export default Layout;