module.exports = function (grunt) {

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		bower: {
			install: {
				options: {
					targetDir: 'vendor',
					layout: 'byComponent'
				}
			}
		},

		clean: {
			build: ['build'],
			prod: ['dist']
		}

	});

	grunt.registerTask('init:dev', ['clean', 'bower']);

};
