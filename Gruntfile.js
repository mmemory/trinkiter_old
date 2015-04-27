module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');

    grunt.initConfig({
        concat: {
            options: {
            },
            dist: {
                src: ['src/js/app.js' ,'src/js/**/*.js'],
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
            js: {
                files: ['src/js/app.js','src/js/**/*.js'],
                tasks: ['concat']
            },
            scss: {
                files: ['src/styles/styles.scss', 'src/styles/partials/*.scss'],
                tasks: ['compass:dev']
            },
            html: {
                files: ['*.html', 'src/templates/*.html']
            }
        }
    });

    grunt.registerTask('default', 'watch');
};