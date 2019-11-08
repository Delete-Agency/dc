module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: 2,
                targets: [
                    "ie 11",
                    "last 2 firefox versions",
                    "last 2 edge versions",
                    "last 2 chrome versions",
                    "last 2 safari versions",
                    "last 2 and_chr versions",
                    "last 2 ios_saf versions"
                ]
            }
        ]
    ]
};