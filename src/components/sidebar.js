import React from 'react';
import styles from '../styles/bloglist.module.css';
import { Link } from 'gatsby';

const Sidebar = ({ categories, tags }) => {

    return (
        <aside className={styles.blogMeta}>
            <nav className={styles.blogMetaList}>
                <header><h2>Categories</h2></header>
                <ul>
                    {categories.edges.map(({ node }) => (
                        <li key={node.id}><Link to={`/${node.slug}/`}>{node.name}</Link> <span className="hide">contains </span><span className="badge">{node.count}</span><span className="hide"> posts</span></li>
                    ))}
                </ul>
            </nav>
            <nav className={styles.blogMetaList}>
                <header><h2>Tags</h2></header>
                <div>
                    {tags.edges.map(({ node }) => (
                        <Link key={node.id} to={`/${node.slug}/`}>{node.name}</Link>
                    ))}
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
