module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');

    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/js/**/*.js'],
                dest: 'build/js/scripts.js'
            }
        },
        compass: {
            dev: {
                options: {
                    config: 'config.rb'
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            scss: {
                files: ['src/styles/styles.scss', 'src/styles/partials/*.scss'],
                tasks: ['compass:dev']
            },
            js: {
                files: 'src/js/**/*.js',
                tasks: ['concat']
            },
            html: {
                files: ['*.html']
            }
        }
    });

    grunt.registerTask('default', 'watch');
};