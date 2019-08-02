import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

const Footer = () => {
    const data = useStaticQuery(graphql`
        query {
        site {
            siteMetadata {
                author
                startYear
            }
        }
    }
    `);

    const createDateString = () => {
        const startYear = data.site.siteMetadata.startYear.toString();
        const currentYear = new Date().getFullYear().toString();
        if (startYear !== currentYear) {
            return `${startYear} - ${currentYear}`;
        }
        return startYear;
    };
    return (
        <footer>
            <div className="footer-msg">&copy; Copyright {data.site.siteMetadata.author} {createDateString()}. License: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">Attribution-NonCommercial-ShareAlike</a></div>
        </footer>
    );
};

export default Footer;
