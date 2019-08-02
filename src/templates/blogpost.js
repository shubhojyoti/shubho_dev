import React from 'react';
import { Link, graphql } from "gatsby";
import { Helmet } from 'react-helmet';
import blogPostStyles from '../styles/blogpost.module.css';
import Layout from "../components/layout";

const codepen_snippet = (url) => {
    url = url.replace('/pen/', '/embed/preview/');
    return `<p class="codepen-embed"><iframe height="400" style="width: 100%;" scrolling="no" src="${url}?height=400&theme-id=0&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true"></iframe></p>`;
};

const github_gist = (url) => {
    return `<p class="github-gist-embed"><script src="${url}"></script></p>`;
};

const image_tag_process = (img_url, alt) => {
    return `<figure class="article-body-image"><img src="${img_url}" alt="${alt}"><figcaption>${alt}</figcaption></figure>`;
};

const jsonld = (author, pic, siteUrl, social, title, slug, date, modified, image, metaDesc, metaKeywords) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "publisher": {
        "@type": "Person",
        "givenName": author.split(' ')[0],
        "familyName": author.split(' ')[1],
        "image": {
            "@type": "ImageObject",
            "url": pic,
            "width": 548,
            "height": 548
        },
        "nationality": "India"
    },
    "author": {
        "@type": "Person",
        "name": author,
        "image": {
            "@type": "ImageObject",
            "url": pic,
            "width": 548,
            "height": 548
        },
        "url": siteUrl,
        "sameAs": social
    },
    "headline": title,
    "url": `${siteUrl}/blog/${slug}/`,
    "datePublished": date,
    "dateModified": modified,
    "image": {
        "@type": "ImageObject",
        "url": image,
        "width": 652,
        "height": 300
    },
    "keywords": metaKeywords.split(',').join(' '),
    "description": metaDesc,
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": siteUrl
    }
});


const BlogPost = ({ data }) => {
    const { title, slug, childMarkdownWordpress, categories, tags, date, modified, fields } = data.wordpressPost;
    const bodyHtml = childMarkdownWordpress.childMarkdownRemark.html;
    let bodyparts = bodyHtml.replace(/<p class="codepen">http[s]?:([/]{2}.*?)<\/p>/g, (a, b) => codepen_snippet(b));
    bodyparts = bodyparts.replace(/<p class="gist">(http[s]?:[/]{2}.*?)<\/p>/g, (a, b) => github_gist(b));
    bodyparts = bodyparts.replace(/<p>[\W]*<img src="(.*?)"[\W]+alt="(.*?)">[\W]*<\/p>/g, (a, b, c) => image_tag_process(b, c));
    const { author, pic, url, title: siteTitle } = data.site.siteMetadata;
    const socialUrls = [];
    data.allSocialSvgIconData.edges.forEach(( { node }) => {
        if (node.key !== 'contact') {
            socialUrls.push(node.url);
        }
    });
    let metaDesc = '';
    let metaKeyWords = '';
    if (data.wordpressPost.acf) {
        if (data.wordpressPost.acf.meta_description) {
            metaDesc = data.wordpressPost.acf.meta_description;
        }
        if (data.wordpressPost.acf.meta_keywords) {
            metaKeyWords = data.wordpressPost.acf.meta_keywords;
        }
    }
    if (metaDesc === '') {
        metaDesc = childMarkdownWordpress.childMarkdownRemark.excerpt;
    }
    const categoriesList = categories ? categories.map(tag => tag.name) : [];
    const tagsList = tags ? tags.map(tag => tag.name) : [];
    const catTags = [...categoriesList, ...tagsList].join(',');
    if (metaKeyWords === '') {
        metaKeyWords = catTags;
    }
    const json = jsonld(author, pic, url, socialUrls, title, slug, date, modified, data.wordpressPost.featured_media ? data.wordpressPost.featured_media.fields.Image_Url_652x300 : '', metaDesc, metaKeyWords);
    if (!data.wordpressPost.featured_media) {
        delete json.image;
    }
    const postUrl = `${url}/${categories[0].slug}/${slug}/`;

    return (
        <Layout page="singlepage" mainClassName="blog-post-full">
            <Helmet title={title}>
                <meta property="og:site_name" content={siteTitle} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={metaDesc} />
                <meta property="og:url" content={postUrl} />
                {data.wordpressPost.featured_media && <meta property="og:image" content={data.wordpressPost.featured_media.fields.Image_Url_870x600} />}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={metaDesc} />
                <meta name="twitter:url" content={postUrl} />
                {data.wordpressPost.featured_media && <meta property="twitter:image" content={data.wordpressPost.featured_media.fields.Image_Url_870x600} />}
                <meta property="og:image:width" content="870" />
                <meta property="og:image:height" content="600" />
                <script type="application/ld+json">
                    { JSON.stringify(json) }
                </script>
            </Helmet>
            <div className={blogPostStyles.postBg}>
                {data.wordpressPost.featured_media && (<picture>
                    <source media="(max-width: 360px)" data-srcset={data.wordpressPost.featured_media.fields.Image_Url_306x120}/>
                    <source media="(max-width: 499px)" data-srcset={data.wordpressPost.featured_media.fields.Image_Url_425x255}/>
                    <source media="(max-width: 768px)" data-srcset={data.wordpressPost.featured_media.fields.Image_Url_652x300}/>
                    <source media="(max-width: 1024px)" data-srcset={data.wordpressPost.featured_media.fields.Image_Url_864x300}/>
                    <source media="(max-width: 1199px)" data-srcset={data.wordpressPost.featured_media.fields.Image_Url_864x300}/>
                    <source media="(min-width: 1200px)" data-srcset={data.wordpressPost.featured_media.fields.Image_Url_864x300}/>
                    <img className="article-image lazyload" src={data.wordpressPost.featured_media.fields.Image_Url_425x255} data-src={data.wordpressPost.featured_media.fields.Image_Url_425x255} alt={data.wordpressPost.featured_media.alt_text} />
                </picture>)}
            </div>
            <article className={blogPostStyles.article}>
                <header>
                    <h1 className={blogPostStyles.articleTitle} dangerouslySetInnerHTML={ { __html: title } }/>
                    <div className="metadata">
                        <p className={blogPostStyles.datetime}>
                            <time dateTime={date}>{fields.createdAtFormatted}</time>
                        </p>
                        <p className={blogPostStyles.tags}>
                            <span className="hidden">Posted in </span>{categories.length > 0 && categories.map((cat) => (
                            <Link to={`/${cat.slug}/`} key={cat.name}>{cat.name}</Link>
                        ))}
                            <span className="hidden">Tagged with </span>{tags.length > 0 && tags.map((tag) => (
                            <Link to={`/${tag.slug}/`} key={tag.name}>{tag.name}</Link>
                        ))}
                        </p>
                        <p className={blogPostStyles.metaData}>{childMarkdownWordpress.childMarkdownRemark.fields.readingTime.text}</p>
                    </div>
                </header>
                <div className={blogPostStyles.articleBody} dangerouslySetInnerHTML={ { __html: bodyparts } }/>
                {data.wordpressPost.featured_media && data.wordpressPost.featured_media.acf && data.wordpressPost.featured_media.acf.author && data.wordpressPost.featured_media.acf.author !== '' && (
                    <div className={blogPostStyles.featuredImageCredits}>Featured Image courtesy <a href={data.wordpressPost.featured_media.acf.author_link}>{data.wordpressPost.featured_media.acf.author}</a> at <a href={data.wordpressPost.featured_media.acf.provider_url}>{data.wordpressPost.featured_media.acf.photo_provider}</a></div>
                )}
            </article>
        </Layout>
    );
};

export default BlogPost;

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
                    fields {
                        readingTime {
                            text
                        }
                    }
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
