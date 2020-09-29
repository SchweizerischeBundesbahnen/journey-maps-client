#!groovy

pipeline {
  agent { label 'nodejs' }
  parameters {
    booleanParam(name: 'RELEASE', defaultValue: false, description: 'Release the current branch?')
  }
  stages {
    stage('Installation') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Build library') {
      steps {
        sh 'npm run build-lib'
      }
    }

    stage('Create snapshot') {
      when {
        allOf {
          branch 'master'
          expression {return !params.RELEASE}
        }
      }
      steps {
        script {
          bin_npmPublishSnapshot(targetRepo: 'rokas.npm', packageJson: './projects/journey-maps-client/package.json', publishablePackageJsons: './dist/journey-maps-client/package.json')
        }
      }
    }

    stage('Create release') {
      when {
        allOf {
          branch 'master'
          expression {return params.RELEASE}
        }
      }
      steps {
        script {
          def packageJson = readJSON file: './projects/journey-maps-client/package.json'
          def (int major, int minor, int patch) = packageJson.version.tokenize('.')

          bin_npmLeanPublish(targetRepo: 'rokas.npm', packageJson: './projects/journey-maps-client/package.json', publishablePackageJsons: './dist/journey-maps-client/package.json',
            nextReleaseVersion: "${major}.${minor}.${patch + 1}".toString(), releaseVersion: "${major}.${minor}.${patch}".toString())
        }
      }
    }
  }
}
