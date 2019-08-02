import React from 'react';
import { graphql } from 'gatsby';
import { intersection } from 'lodash';
import Layout from '../components/layout';
import styles from '../styles/bloglist.module.css';
import Sidebar from '../components/sidebar';

export default ({ data, pageContext }) => {
    const postMap = {};
    const years = [];
    const mainMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    mainMonths.reverse();
    if (data.allWordpressPost.edges.length > 0) {
        data.allWordpressPost.edges.forEach(({ node }) => {
            if (!postMap[node.fields.yearOfPost]) {
                postMap[node.fields.yearOfPost] = {};
            }
            if (!postMap[node.fields.yearOfPost][node.fields.monthOfPost]) {
                postMap[node.fields.yearOfPost][node.fields.monthOfPost] = {};
            }
            if (!postMap[node.fields.yearOfPost][node.fields.monthOfPost][node.fields.dateOfPost]) {
                postMap[node.fields.yearOfPost][node.fields.monthOfPost][node.fields.dateOfPost] = [];
            }
            postMap[node.fields.yearOfPost][node.fields.monthOfPost][node.fields.dateOfPost].push(node);
        });
        years.push(...Object.keys(postMap));
        years.sort().reverse();
        years.forEach((year) => {
            postMap[year].months = intersection(mainMonths, Object.keys(postMap[year]));
            postMap[year].months.forEach((month) => {
                const dates = Object.keys(postMap[year][month]).sort().reverse();
                postMap[year][month].dates = dates;
            })
        });
    }
    return (
        <Layout page="blog" mainClassName="blog-list">
            <h1 className="hide">{data.site.siteMetadata.title}</h1>
            <section className={styles.blogArticlesList}>
                <header><h2 className={styles.pageHeader}>Articles posted under category "{pageContext.name}"</h2></header>
            {data.allWordpressPost.edges.length > 0 &&
            years.map((year) => (
                <section className={styles.articleList} key={`year-of-article-${year}`}>
                    <header><h2 className={styles.yearOfArticle}>{year}</h2></header>
                    {postMap[year].months.map((month) => (
                        <section className={styles.monthOfArticle} key={`month-of-article-${month}`}>
                            <header><h3>{month}</h3></header>
                            {postMap[year][month].dates.map((date) => (
                                <section className={styles.dateOfArticle} key={`date-of-article-${date}`}>
                                    <>
                                        <header><h4>{date}</h4></header>
                                        <section className={styles.articles}>
                                            {postMap[year][month][date].map((node) => (
                                                <article key={node.id}>
                                                    <aside>
                                                        <div className="day-of-article">{node.fields.dayOfPost}</div>
                                                        <div className="time-of-article">{node.fields.timeOfPost}</div>
                                                    </aside>
                                                    <div className={styles.articleHeader}><a href={`/${node.categories[0].name.toLowerCase()}/${node.slug}/`} dangerouslySetInnerHTML={ { __html: node.title } }/></div>
                                                </article>
                                            ))}
                                        </section>
                                    </>
                                </section>
                            ))}
                        </section>
                    ))}
                </section>
            ))
            }
            </section>
            <Sidebar categories={data.allWordpressCategory} tags={data.allWordpressTag}/>
        </Layout>
    );
};

export const query = graphql`
    query($slug: String!) {
        site {
            siteMetadata {
                title
            }
        }
        allWordpressPost(sort: { fields: date, order: DESC }, filter: { categories: { elemMatch: { slug: {eq: $slug } } } }) {
            edges {
                node {
                    id
                    title
                    slug
                    categories {
                        name
                    }
                    fields {
                        createdAtFormatted
                        yearOfPost
                        monthOfPost
                        dateOfPost
                        dayOfPost
                        timeOfPost
                    }
                }
            }
        }
        allWordpressCategory(filter: {count: {ne: 0}}, sort: {fields: name, order: ASC}) {
            edges {
                node {
                    name
                    slug
                    count
                }
            }
        }
        allWordpressTag(filter: {count: {ne: 0}}, sort: {fields: name, order: ASC}) {
            edges {
                node {
                    name
                    slug
                    count
                }
            }
        }
    }
`;
