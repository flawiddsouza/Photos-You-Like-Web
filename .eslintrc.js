module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": {
        "eslint:recommended",
        "plugin:vue/essential"
    },
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single",
            { "allowTemplateLiterals": true }
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};