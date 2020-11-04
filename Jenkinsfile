#!groovy

pipeline {
  agent { label 'nodejs' }
  parameters {
    booleanParam(name: 'RELEASE', defaultValue: false, description: 'Release the current branch?')
    string(name: 'RELEASE_VERSION', defaultValue: '', description: 'Release version. Will be read from package.json if empty.')
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

    stage('Test') {
      steps {
        sh 'npm run test-headless'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Create snapshot') {
      when {
        allOf {
          branch 'master'
          expression { return !params.RELEASE }
        }
      }
      steps {
        script {
          bin_npmPublishSnapshot(
            targetRepo: 'rokas.npm',
            packageJson: './package.json',
            publishablePackageJsons:
              './dist/journey-maps-client/package.json,' +
              './dist/journey-maps-client-elements/package.json'
          )
        }
      }
    }

    stage('Create release') {
      when {
        allOf {
          branch 'master'
          expression { return params.RELEASE }
        }
      }
      steps {
        script {
          def packageJson = readJSON file: './package.json'
          def version = params.RELEASE_VERSION ? params.RELEASE_VERSION : packageJson.version
          def (int major, int minor, int patch) = version.tokenize('.')

          bin_npmLeanPublish(
            targetRepo: 'rokas.npm',
            packageJson: './package.json',
            publishablePackageJsons:
              './dist/journey-maps-client/package.json,' +
              './dist/journey-maps-client-elements/package.json',
            nextReleaseVersion: "${major}.${minor}.${patch + 1}",
            releaseVersion: "${major}.${minor}.${patch}",
            tag: "${major}.${minor}.${patch}"
          )
        }
      }
    }
    stage('Create & deploy testapp docker') {
      when {
        branch 'master'
      }
      steps {
        script {
          cloud_buildDockerImage(
            artifactoryProject: 'rokas.docker',
            ocApp: 'journey-maps-client-testapp',
            dockerDir: '.',
            ocAppVersion: 'latest'
          )

          cloud_mergeConfigAndUpdateOpenShift(
            cluster: 'otc_test_04',
            credentialId: 'ea1bfded-bc12-4db2-8429-e204a28195d1',
            projects: 'ki-journey-maps-client'
          )

          cloud_callDeploy(
            cluster: 'otc_test_04',
            credentialId: 'ea1bfded-bc12-4db2-8429-e204a28195d1',
            dc: 'journey-maps-client',
            project: 'ki-journey-maps-client',
            doNotFailOnRunningDeployment: true
          )
        }
      }
    }
  }
}
