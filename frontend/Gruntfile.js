module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dev: ['build'],
      dist: ['dist']
    },

    inline: {
      dev: {
        options: {
          cssmin: false,
          uglify: false
        },
        src: 'build/index.html',
        dest: 'build/index.html'
      },
      dist: {
        options: {
          cssmin: true,
          uglify: true
        },
        src: 'build/index.html',
        dest: 'dist/index.html'
      }
    },

    babel: {
      options: {
        sourceMap: true
      },
      dev: {
        files: {
          'build/main.js': 'src/scripts/main.jsx'
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'dist/index.html': 'dist/index.html'
        }
      },
    },

    watch: {
      app: {
        files: ['src/**/*'],
        options: {
          livereload: true
        },
        tasks: ["build"]
      }
    },

    connect: {
      dist: {
        options: {
          port: 9090,
          hostname: '0.0.0.0',
          base: 'build/'
        }
      }
    },

    targethtml: {

      // Remove livereload and its friends
      prod: {
        files: {
          'dist/index.html': 'dist/index.html'
        }
      }
    },

    browserify: {
      dev: {
        options: {
          debug: true,
          transform: ['reactify']
        },
        files: {
          'build/main.js': 'src/scripts/**/*.jsx'
        }
      },
      dist: {
        options: {
          debug: false,
          transform: ['reactify']
        },
        files: {
          'dist/main.js': 'src/scripts/**/*.jsx'
        }
      }
    },

    copy: {
      dev: {
        files: [
          {expand: true, flatten: true, src: ['src/**/*'], dest: 'build/', filter: 'isFile'},
        ]
      },
      dist: {
        files: [
          {expand: true, flatten: true, src: ['src/*'], dest: 'dist/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['src/images/*'], dest: 'dist/images/'},
        ]
      },
      CNAME: {
        expand: true,
        flatten: true,
        src:  ['src/CNAME'],
        dest: 'dist/'
      }
    },

    concat: {
      dev: {
        src: ['src/scripts/XDomain.js', 'src/scripts/data_hant.js', 'build/main.js'],
        dest: 'build/main.js'
      },
      dist: {
        src: ['src/scripts/XDomain.js', 'src/scripts/data_hant.js', 'dist/main.js'],
        dest: 'dist/main.js'
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/main.js': ['dist/main.js']
        }
      }
    },

    'gh-pages': {
      options: {
        base: 'dist',
        branch: 'gh-pages',
        repo: 'https://github.com/initiummedia/wy-index.git'
      },
      src: '**/*'
    },

    rsync: {
      options: {
        args: ["--verbose"],
        exclude: [".git*","*.scss","node_modules"],
        recursive: true
      },
      showcase: {
        options: {
          src: "./dist/",
          dest: "/home/vagrant/web/bookstaff",
          host: "showcase",
          delete: true // Careful this option could cause data loss, read the docs!
        }
      }
    },

  });


  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  //grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-inline');
  grunt.loadNpmTasks('grunt-rsync');
  grunt.loadNpmTasks('grunt-targethtml');

  grunt.registerTask('build',  ['clean:dev', 'copy:dev', 'inline:dev']);
  grunt.registerTask('serve',  ['build', 'connect', 'watch']);
  grunt.registerTask('deploy', ['clean:dist', 'inline:dist', 'browserify:dist', 'copy', 'concat:dist', 'uglify',
    'targethtml:prod', 'htmlmin',
    'gh-pages', 'rsync']);
};