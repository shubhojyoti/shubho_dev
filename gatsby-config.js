if (process.env.NODE_ENV === 'development') {
    require("dotenv").config({
        path: `.env.development`,
    });
}
if (!process.env.SOURCE_WP_URL || process.env.SOURCE_WP_URL === '' ||
    !process.env.DEST_WP_URL || process.env.DEST_WP_URL === '') {
    throw new Error('WP URLs are required');
}

module.exports = {
    siteMetadata: {
        title: process.env.SITE_TITLE,
        description: process.env.SITE_DESCRIPTION,
        author: process.env.AUTHOR,
        email: process.env.EMAIL || '',
        url: process.env.SITE_URL,
        siteUrl: process.env.SITE_URL,
        pic: process.env.MAIN_PIC,
        startYear: process.env.START_YEAR,
        introTagLines: process.env.INTRO_TAG_LINES.split('-_-')
    },
    plugins: [
        {
            resolve: "gatsby-plugin-social-svg",
            options: {
                configFile: 'social.json',
                iconsDir: 'images/social'
            },
        },
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-plugin-react-helmet-canonical-urls`,
            options: {
                siteUrl: `https://www.shubho.dev`,
            },
        },
        `gatsby-plugin-catch-links`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        `gatsby-plugin-postcss`,
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-reading-time`
                    },
                    {
                        resolve: `gatsby-remark-embed-gist`,
                    },
                    {
                        resolve: `gatsby-remark-prismjs`,
                        options: {
                            classPrefix: "language-",
                            aliases: {
                                javascript: 'js'
                            },
                            inlineCodeMarker: '>>',
                            showLineNumbers: false,
                            noInlineHighlight: false,
                            showLanguage: true
                        }
                    }
                ]
            }
        },
        `gatsby-plugin-favicon`,
        {
            resolve: "gatsby-source-wordpress",
            options: {
                baseUrl: process.env.BASE_WP_URL,
                protocol: process.env.BASE_PROTOCOL,
                hostingWPCOM: false,
                useACF: true,
                acfOptionPageIds: [],
                auth: {
                    htaccess_user: process.env.REST_UN,
                    htaccess_pass: process.env.REST_PWD,
                    htaccess_sendImmediately: true,
                },
                cookies: {},
                verboseOutput: false,
                perPage: 100,
                searchAndReplaceContentUrls: {
                    sourceUrl: process.env.SOURCE_WP_URL,
                    replacementUrl: process.env.DEST_WP_URL,
                },
                concurrentRequests: 10,
                includedRoutes: [
                    "**/categories",
                    "**/posts",
                    "**/pages",
                    "**/media",
                    "**/tags",
                    "**/taxonomies",
                    "**/users",
                ],
                excludedRoutes: [],
                normalizer: function({ entities }) {
                    return entities
                },
            }
        },
        {
            resolve: `gatsby-transformer-wordpress-markdown`,
            options: {
                turndownPlugins: ['turndown-plugin-gfm']
            }
        },
        `gatsby-plugin-wordpress-feed`,
        {
            resolve: `gatsby-plugin-advanced-sitemap`,
            options: {
                exclude: [
                    `/dev-404-page`,
                    `/404`,
                    `/404.html`,
                    `/offline-plugin-app-shell-fallback`,
                    `/blog/*`
                ],
                createLinkInHead: true
            }
        }
    ],
};
