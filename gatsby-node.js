const path = require(`path`);
const slash = require(`slash`);
const moment = require(`moment-timezone`);

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions;
    if (node.internal.type === "wordpress__POST" || node.internal.type === "wordpress__PAGE") {
        createNodeField({
            name: "createdAtFormatted",
            value: moment(node.date).tz('Universal').tz('Asia/Calcutta').format(`MMMM DD, YYYY`),
            node,
        });
        createNodeField({
            name: "yearOfPost",
            value: moment(node.date).tz('Universal').tz('Asia/Calcutta').format(`YYYY`),
            node,
        });
        createNodeField({
            name: "monthOfPost",
            value: moment(node.date).tz('Universal').tz('Asia/Calcutta').format(`MMMM`),
            node,
        });
        createNodeField({
            name: "dateOfPost",
            value: moment(node.date).tz('Universal').tz('Asia/Calcutta').format(`DD`),
            node,
        });
        createNodeField({
            name: "dayOfPost",
            value: moment(node.date).tz('Universal').tz('Asia/Calcutta').format(`ddd`),
            node,
        });
        createNodeField({
            name: "timeOfPost",
            value: moment(node.date).tz('Universal').tz('Asia/Calcutta').format(`HH:mm`),
            node,
        });
    }
    if (node.internal.type === "wordpress__wp_media") {
        const url = node.source_url;
        const photoslug = node.slug;
        const ext = url.split('.').slice(-1)[0];
        if (['jpeg', 'jpg', 'png', 'gif'].indexOf(ext) > -1) {
            const rootpath = url.split('/').slice(0, -1).join('/');
            createNodeField({
                name: "Image_MainUrl",
                value: url,
                node,
            });
            createNodeField({
                name: "Image_Url_306x120",
                value: `${rootpath}/${photoslug}-306x120.${ext}`,
                node,
            });
            createNodeField({
                name: "Image_Url_425x255",
                value: `${rootpath}/${photoslug}-425x255.${ext}`,
                node,
            });
            createNodeField({
                name: "Image_Url_652x300",
                value: `${rootpath}/${photoslug}-652x300.${ext}`,
                node,
            });
            createNodeField({
                name: "Image_Url_870x300",
                value: `${rootpath}/${photoslug}-870x300.${ext}`,
                node,
            });
            createNodeField({
                name: "Image_Url_1020x300",
                value: `${rootpath}/${photoslug}-1020x300.${ext}`,
                node,
            });
            createNodeField({
                name: "Image_Url_864x300",
                value: `${rootpath}/${photoslug}-864x300.${ext}`,
                node,
            });
            createNodeField({
                name: "Image_Url_870x600",
                value: `${rootpath}/${photoslug}-870x600.${ext}`,
                node,
            });
        }
    }
};

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions;
    return graphql(
        `
            {
                blog: allWordpressPost {
                    edges {
                        node {
                            id
                            slug
                            categories {
                                name
                            }
                        }
                    }
                },
                page: allWordpressPage {
                    edges {
                        node {
                            id
                            slug
                        }
                    }
                },
                categories: allWordpressCategory {
                    edges {
                        node {
                            id
                            name
                            slug
                            count
                        }
                    }
                },
                tags: allWordpressTag {
                    edges {
                        node {
                            id
                            name
                            slug
                            count
                        }
                    }
                }
            }
        `
    ).then(result => {
        if (result.errors) {
            console.log("Error retrieving wordpress data", result.errors);
        }
        const pageTemplate = path.resolve("./src/templates/staticpage.js");
        result.data.page.edges.forEach(edge => {
            createPage({
                path: `/${edge.node.slug}/`,
                component: slash(pageTemplate),
                context: {
                    slug: edge.node.slug,
                    id: edge.node.id
                }
            });
        });

        const blogPostTemplate = path.resolve("./src/templates/blogpost.js");
        result.data.blog.edges.forEach(edge => {
            createPage({
                path: `/${edge.node.categories[0].name.toLowerCase()}/${edge.node.slug}/`,
                component: slash(blogPostTemplate),
                context: {
                    slug: edge.node.slug,
                    id: edge.node.id
                }
            });
        });

        const blogPostRedirectTemplate = path.resolve("./src/templates/blogpost_redirect.js");
        result.data.blog.edges.forEach(edge => {
            createPage({
                path: `/blog/${edge.node.slug}/`,
                component: slash(blogPostRedirectTemplate),
                context: {
                    slug: edge.node.slug,
                    id: edge.node.id
                }
            });
        });

        const categoryTemplate = path.resolve("./src/templates/categorylist.js");
        result.data.categories.edges.forEach(({ node }) => {
            if (node.count > 0) {
                createPage({
                    path: `/${node.slug.toLowerCase()}`,
                    component: slash(categoryTemplate),
                    context: {
                        slug: node.slug,
                        name: node.name,
                        id: node.id,
                        taxonomy: 'category'
                    }
                });
            }
        });

        const tagsTemplate = path.resolve("./src/templates/taglist.js");
        result.data.tags.edges.forEach(({ node }) => {
            if (node.count > 0) {
                createPage({
                    path: `/${node.slug.toLowerCase()}`,
                    component: slash(tagsTemplate),
                    context: {
                        slug: node.slug,
                        name: node.name,
                        id: node.id,
                        taxonomy: 'tag'
                    }
                });
            }
        });
    })
        .catch(error => {
            console.log("Error retrieving contentful data", error);
        });
};
