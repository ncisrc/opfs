import terser from '@rollup/plugin-terser';

export default {
	input: 'src/main.js',
	output: [
    {
      file: 'dist/nci-opfs.js',
      format: 'iife',
      name: 'nopfs'
	  },
		{
			file: 'dist/nci-opfs.min.js',
			format: 'iife',
			name: 'nopfs',
			plugins: [terser()]
		}
  ]
};