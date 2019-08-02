import React from 'react';
import styles from '../styles/homepage_social.module.css';

const Social = (props) => {
    const socialData = props.data;
    const createSvgHtml = (svgHtml) => ({ __html: svgHtml });

    return (
        <ul className={styles.social}>
            {socialData.edges.map(({ node }) => (
                <li key={node.id}><a href={node.url} title={node.alt} dangerouslySetInnerHTML={createSvgHtml(node.svg)}/></li>
            ))}
        </ul>
    );
};

export default Social;
