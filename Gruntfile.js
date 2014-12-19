module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compile: {
        files: {
          'releases/international-phone-number.js': 'src/international-phone-number.coffee'
        }
      }
    },
    uglify: {
      release: {
        files: {
          'releases/international-phone-number.min.js': ['releases/international-phone-number.js']
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['coffee', 'uglify']);
};
