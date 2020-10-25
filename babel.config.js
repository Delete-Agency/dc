module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                corejs: 3
            }
        ],
        '@babel/preset-typescript',
    ],
    plugins: [
        '@babel/plugin-transform-object-assign',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-object-rest-spread',
    ],
};
