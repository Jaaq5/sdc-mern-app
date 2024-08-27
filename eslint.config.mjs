import eslintConfigPrettier from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';

export default [

  eslintConfigPrettier,
  
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react: reactPlugin
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'react/jsx-uses-react': 'error', 
      'react/jsx-uses-vars': 'error',  
      'react/react-in-jsx-scope': 'off'
    },
  },
];
