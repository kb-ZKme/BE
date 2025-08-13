const SwaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        info: {
            title: 'KB_ZK-me',
            version: '1.0.0',
            description: 'KB ai Challenge'
        },
        host: 'localhost:3000',
        basepath: '../'
    },
    apis: ['./src/routes/*.js', './swagger/*']
};

// Change 'export const' to 'module.exports ='
module.exports.specs = SwaggerJsdoc(options);