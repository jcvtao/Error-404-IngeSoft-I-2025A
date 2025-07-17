import svelte from 'eslint-plugin-svelte3';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'release/']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        NodeJS: 'readonly',
        require: 'readonly'
      }
    },
    rules: {
      // Puedes agregar reglas personalizadas aquí
    }
  },
  {
    files: ['**/*.svelte'],
    plugins: {
      svelte3: svelte
    },
    processor: 'svelte3/svelte3'
  }
];