const fs = require('fs');
const uuid = require('uuid/v4');

exports.sourceNodes = (
    { actions, createNodeId, createContentDigest },
    configOptions
) => {
    const { createNode } = actions;
    delete configOptions.plugins;

    const processSocialNode = (social) => {
        const nodeId = createNodeId(`social-svg-${social.id}`);
        const nodeContent = JSON.stringify(social);
        const nodeData = Object.assign({}, social, {
            id: nodeId,
            parent: null,
            children: [],
            internal: {
                type: `SocialSvgIconData`,
                content: nodeContent,
                contentDigest: createContentDigest(social),
            },
        });
        return nodeData;
    };

    const createAllData = (datafile, icondir) => {
        return new Promise((resolve) => {
            const data = JSON.parse(fs.readFileSync(datafile, 'utf-8'));
            const keys = data.map(key => key.key);
            const files = keys.map((key) => `${icondir}/${key}.svg`);
            const validFilesData = {};
            files.forEach((file, idx) => {
                if (fs.existsSync(file)) {
                    validFilesData[keys[idx]] = fs.readFileSync(file, 'utf-8');
                }
            });
            const validKeys = Object.keys(validFilesData);
            const finalData = [];
            validKeys.forEach((key) => {
                const temp = data.filter(social => social.key === key)[0];
                temp['svg'] = validFilesData[key];
                temp['id'] = uuid.v4();
                finalData.push(temp);
            });
            resolve(finalData);
        });
    };

    const jsonData = __dirname + '/../../'+ (configOptions.configFile || 'social.json');
    const iconsDir = __dirname + '/../../src/' + configOptions.iconsDir;
    return createAllData(jsonData, iconsDir)
        .then((data) => {
            data.forEach((social) => {
                const nodeData = processSocialNode(social);
                createNode(nodeData);
            })
        });
};
