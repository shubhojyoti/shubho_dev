const TurndownService = require('turndown');

async function onCreateNode({
    node,
    actions,
    createNodeId,
    createContentDigest,
    reporter
}, {
    headingStyle = 'setext',
    hr = '* * *',
    bulletListMarker = '*',
    codeBlockStyle = 'fenced',
    fence = '```',
    emDelimiter = '_',
    strongDelimiter = '**',
    linkStyle = 'inlined',
    linkReferenceStyle = 'full',
    turndownPlugins = []
} = {}) {
    const { createNode, createParentChildLink } = actions;
    if (node.internal.type !== `wordpress__POST` && node.internal.type !== `wordpress__PAGE`) {
        return;
    }
    const options = {
        headingStyle,
        hr,
        bulletListMarker,
        codeBlockStyle,
        fence,
        emDelimiter,
        strongDelimiter,
        linkStyle,
        linkReferenceStyle
    };
    const turndownService = new TurndownService(options);
    if (turndownPlugins.length > 0) {
        turndownPlugins.forEach((plugin) => {
            if (plugin === 'turndown-plugin-gfm') {
                const turndownPluginGfm = require('turndown-plugin-gfm');
                const gfm = turndownPluginGfm.gfm;
                turndownService.use(gfm);
            }
        });
    }

    try {
        const content = node.content;
        const contentMarkDown = turndownService.turndown(content);
        let markdownNode = {
            id: createNodeId(`${node.id}-markdown`),
            children: [],
            parent: node.id,
            internal: {
                type: `MarkdownWordpress`,
                mediaType: `text/markdown`,
                content: contentMarkDown,

            },
        };
        markdownNode.internal.contentDigest = createContentDigest(markdownNode);
        createNode(markdownNode);
        createParentChildLink({ parent: node, child: markdownNode });
        return markdownNode;
    } catch (err) {
        reporter.panicOnBuild(
            `Error processing Wordpress posts to Markdown
            ${node.title} - ${err.message}`
        );

        return {} // eslint
    }
}

exports.onCreateNode = onCreateNode;
