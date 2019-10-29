const baseConfig = require('./webpack.base.config');

module.exports = (env, argv) => {
    const config = baseConfig(env, argv);
    config.output.path = __dirname + '/demo/dist';
    return config;
};