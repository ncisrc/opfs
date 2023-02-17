import terser from '@rollup/plugin-terser';
export default {
	input: 'src/main.js',
	output: [
    {
      file: 'dist/browser.js',
      format: 'iife',
      name: 'nci'
	  },
		{
			file: 'dist/browser.min.js',
			format: 'iife',
			name: 'nci',
			plugins: [terser()]
		}
  ]
};