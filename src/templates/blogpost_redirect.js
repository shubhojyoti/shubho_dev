import React from 'react';
import { graphql } from "gatsby";
import { Helmet } from 'react-helmet';
import Layout from "../components/layout";

export default ({ data }) => {
    const { slug, categories } = data.wordpressPost;
    const newPostUrl = `/${categories[0].slug}/${slug}/`;
    const refresh = `0; url=${newPostUrl}`;

    return (
        <Layout page="singlepage" mainClassName="blog-post-full">
            <Helmet>
                <meta http-equiv="refresh" content={refresh}/>
            </Helmet>
        </Layout>
    );
};

export const query = graphql`
    query($slug: String!) {
        wordpressPost(slug: { eq: $slug }) {
            id
            title
            date
            modified
            fields {
                createdAtFormatted
            }
            slug
            categories {
                name
                slug
            }
            tags {
                name
                slug
            }
            acf {
                meta_description
                meta_keywords
            }
            featured_media {
                fields {
                    Image_MainUrl
                    Image_Url_306x120
                    Image_Url_425x255
                    Image_Url_652x300
                    Image_Url_864x300
                    Image_Url_870x600
                }
                alt_text
                acf {
                    author
                    author_link
                    photo_provider
                    provider_url
                }
            }
            childMarkdownWordpress {
                childMarkdownRemark {
                    html
                    excerpt
                }
            }
        }
        site {
            siteMetadata {
                author
                pic
                url
                title
            }
        }
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
    }
`;
