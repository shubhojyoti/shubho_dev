import React, { useState, useEffect } from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import DarkThemeLogo from '../images/darklogo.svg';
import LightThemeLogo from '../images/lightlogo.svg';
import styles from '../styles/header.module.css';
import { Helmet } from 'react-helmet';

const Header = (props) => {
    const data = useStaticQuery(graphql`
        query {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `);

    let [logotheme, setLogoTheme] = useState('light');

    useEffect(() => {
        const settheme = localStorage.hasOwnProperty('theme') && localStorage.getItem('theme') !== '' ?
            localStorage.getItem('theme') : window.matchMedia('(prefers-color-scheme: dark)').matches ?
                'dark' : 'light';
        setLogoTheme(settheme);
        localStorage.setItem('theme', settheme);
    }, [logotheme]);

    const themeToggle = (event) => {
        if (event.target.checked) {
            setLogoTheme('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            setLogoTheme('light');
            localStorage.setItem('theme', 'light');
        }
    };

    const ThemeSelector = () => (
        <div className={[styles.themeToggler, 'only-js'].join(' ')}>
            <label htmlFor="toggle" className={styles.themeToggler} id="theme-toggler">
                <span className={styles.themeTogglerLabel}>Dark Mode</span>
                <input type="checkbox" id="toggle" className={styles.themeTogglerChkbox}
                       onChange={e => themeToggle(e)}
                       checked={logotheme === 'dark'}/>
                <span aria-hidden="true" className={styles.themeTogglerSwitch}/>
            </label>
        </div>
    );

    const Logo = (props) => {
        if (props.theme === 'dark') {
            return <img src={DarkThemeLogo} alt="Shubho.dev logo" height="48" />
        }
        return <img src={LightThemeLogo} alt="Shubho.dev logo" height="48" />;
    };

    return (
        <>
            <Helmet
                htmlAttributes={{ lang: 'en', class: props.page || 'posts' }}
                title="Home"
                titleTemplate={`%s | ${data.site.siteMetadata.title}`}
                bodyAttributes={{ class: logotheme }}
            >
                <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed/index.xml" />
                <link rel="alternate" type="application/atom+xml" title="Atom Feed" href="/atom.xml" />
                <link rel="alternate" type="application/json" title="JSON Feed" href="/feed.json" />
                <link rel="stylesheet" href="https://use.typekit.net/iqu1tdj.css"/>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.1.0/lazysizes.min.js" async defer/>
            </Helmet>
            <header className={styles.header}>
                <div className={styles.headerContainer}>
                    <div className="logoContainer">
                        <Link to="/"><Logo theme={logotheme} /></Link>
                    </div>
                    <nav className={styles.topNav}>
                        <ul>
                            <li><Link to="/blog/">Blog</Link></li>
                            <li><a href="/about/">About</a></li>
                        </ul>
                    </nav>
                    <ThemeSelector/>
                </div>
            </header>
        </>
    );
};

export default Header;

