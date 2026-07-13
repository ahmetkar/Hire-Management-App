import baseConfig from "../../eslint.base.config.mjs";

export default [
    ...baseConfig,
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            '@nx/enforce-module-boundaries': [
            'error',
            {
                allow: [
                '^@mistralai/mistralai$',
                '^@mistralai/mistralai/.*',
                ],
                enforceBuildableLibDependency: true,
                depConstraints: [
                {
                    sourceTag: '*',
                    onlyDependOnLibsWithTags: ['*'],
                },
                ],
            },
            ],
        }
    }
];
