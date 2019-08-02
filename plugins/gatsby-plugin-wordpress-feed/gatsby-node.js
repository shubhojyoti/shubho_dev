const Feed = require('feed').Feed;
const fs = require('fs');
const moment = require('moment');

function createFeed(posts, siteData) {
    const feed = new Feed({
        title: siteData.title,
        description: siteData.description,
        link: siteData.url,
        id: siteData.url,
        copyright: createCopyRight(siteData.startYear, siteData.author),
        feedLinks: {
            atom: `${siteData.url}/atom.xml`,
            json: `${siteData.url}/feed.json`,
        },
        author: {
            name: siteData.author,
        }
    });

    posts.edges.forEach(({ node }) => {
        const feedItem = {
            title: node.title,
            id: `${siteData.url}/${node.categories[0].slug}/${node.slug}/`,
            link: `${siteData.url}/${node.categories[0].slug}/${node.slug}/`,
            date: moment(node.date).toDate(),
            content: node.childMarkdownWordpress.childMarkdownRemark.html,
            author: [
                {
                    name: siteData.author,
                    link: siteData.url
                }
            ]
        };
        if (node.featured_media && node.featured_media.fields && node.featured_media.fields.Image_Url_1020x300) {
            feedItem.content = `<div style="margin: 0 auto; text-align: center;"><img src="${node.featured_media.fields.Image_Url_1020x300}" alt="Featured Image"></div>${node.childMarkdownWordpress.childMarkdownRemark.html}`;
        }
        feed.addItem(feedItem);
    });
    feed.addContributor({
        name: siteData.author,
        link: siteData.url
    });
    return feed;
}

function createDateString(startYear) {
    startYear = startYear.toString();
    const currentYear = new Date().getFullYear().toString();
    if (startYear !== currentYear) {
        return `${startYear} - ${currentYear}`;
    }
    return startYear;
}

function createCopyRight(startYear, author) {
    return `Copyright ${author} ${createDateString(startYear)}. License: Creative Commons Attribution-NonCommercial-ShareAlike https://creativecommons.org/licenses/by-nc-sa/4.0/`;
}

async function onPostBuild({
    graphql,
    reporter
}, {
    path = '/public/feed'
} = {}) {
    const rss = __dirname + '/../../' + path + '/index.xml';
    const atom = __dirname + '/../../' + 'public/atom.xml';
    const json = __dirname + '/../../' + 'public/feed.json';

    try {
        fs.mkdirSync(__dirname + '/../../' + path);
    } catch (e) {}

    return graphql(
        `
            {
                site {
                    siteMetadata {
                        title
                        description
                        url
                        startYear
                        author
                    }
                }
                blog: allWordpressPost(sort: {fields: date, order: DESC}, limit: 10) {
                    edges {
                        node {
                            date
                            fields {
                                createdAtFormatted
                            }
                            title
                            slug
                            categories {
                                name
                                slug
                            }
                            tags {
                                name
                            }
                            childMarkdownWordpress {
                                childMarkdownRemark {
                                    html
                                }
                            }
                            featured_media {
                                fields {
                                    Image_Url_1020x300
                                }
                            }
                        }
                    }
                }
            }
        `
    )
        .then((result) => {
            if (result.errors) {
                console.log("Error retrieving wordpress data", result.errors);
                throw result.errors;
            }
            const allPosts = result.data.blog;
            const siteMetaData = result.data.site.siteMetadata;
            const feed = createFeed(allPosts, siteMetaData);

            const atomfeed = feed.atom1();
            fs.writeFileSync(atom, atomfeed, 'utf-8');

            const rssfeed = feed.rss2();
            fs.writeFileSync(rss, rssfeed, 'utf-8');

            const jsonfeed = feed.json1();
            fs.writeFileSync(json, jsonfeed, 'utf-8');
        })
        .catch((error) => {
            console.log(error);
            reporter.panicOnBuild(
                `Error generating feeds - ${error.message}`
            );
        });

}

exports.onPostBuild = onPostBuild;
