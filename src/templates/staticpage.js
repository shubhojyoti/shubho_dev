import React from "react";
import { graphql, Link } from 'gatsby';
import blogPostStyles from '../styles/blogpost.module.css';
import Layout from "../components/layout";
import Social from '../components/social';
import { Helmet } from 'react-helmet';

const StaticPage = ({ data }) => {
    const { title, childMarkdownWordpress, date, fields, featured_media } = data.wordpressPage;
    const bodyHtml = childMarkdownWordpress.childMarkdownRemark.html;

    return (
        <Layout page="singlepage" mainClassName="blog-post-full">
            <Helmet title={title}/>
            <div className={blogPostStyles.postBg}>
                <picture>
                    <source media="(max-width: 360px)" data-srcset={featured_media.fields.Image_Url_306x120}/>
                    <source media="(max-width: 499px)" data-srcset={featured_media.fields.Image_Url_425x255}/>
                    <source media="(max-width: 768px)" data-srcset={featured_media.fields.Image_Url_652x300}/>
                    <source media="(max-width: 1024px)" data-srcset={featured_media.fields.Image_Url_864x300}/>
                    <source media="(max-width: 1199px)" data-srcset={featured_media.fields.Image_Url_864x300}/>
                    <source media="(min-width: 1200px)" data-srcset={featured_media.fields.Image_Url_864x300}/>
                    <img className="article-image lazyload" src={featured_media.fields.Image_Url_425x255} data-src={featured_media.fields.Image_Url_425x255} alt={featured_media.alt_text} />
                </picture>
            </div>
            <article className={blogPostStyles.article}>
                <header>
                    <h1 className={blogPostStyles.articleTitle} dangerouslySetInnerHTML={ { __html: title } }/>
                    <div className="metadata invisible">
                        <p className={blogPostStyles.datetime}>
                            <time dateTime={date}>{fields.createdAtFormatted}</time>
                        </p>
                        <p className={blogPostStyles.tags} aria-hidden="true">
                            <Link to="/to">Meta</Link>
                        </p>
                    </div>
                </header>
                <div className={blogPostStyles.pageArticleBody} dangerouslySetInnerHTML={ { __html: bodyHtml } }/>
                <div className={blogPostStyles.pageBodyExtender}><Social data={data.allSocialSvgIconData} /></div>
            </article>
        </Layout>
    );
};

export default StaticPage;

export const query = graphql`
    query($slug: String!) {
        allSocialSvgIconData {
            edges {
                node {
                    id
                    key
                    url
                    alt
                    svg
                }
            }
        }
        wordpressPage(slug: { eq: $slug }) {
            id
            title
            date
            fields {
                createdAtFormatted
            }
            slug
            featured_media {
                fields {
                    Image_MainUrl
                    Image_Url_306x120
                    Image_Url_425x255
                    Image_Url_652x300
                    Image_Url_864x300
                }
                alt_text
            }
            childMarkdownWordpress {
                childMarkdownRemark {
                    html
                }
            }
        }
    }
`;
