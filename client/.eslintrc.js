module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "no-unused-vars": "off",  // Désactiver les warnings pour les variables non utilisées
        "react/react-in-jsx-scope": "off",  // Désactiver cette règle pour React 17+
        "react/jsx-uses-react": "off"  // Désactiver l'avertissement d'utilisation de React dans JSX
    }
}
