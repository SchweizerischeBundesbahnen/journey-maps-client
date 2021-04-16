#!groovy

def releaseVersion

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
          releaseVersion = packageJson.version
          def (int major, int minor, int patch) = releaseVersion.tokenize('.')

          bin_npmLeanPublish(
            targetRepo: 'rokas.npm',
            packageJson: './package.json',
            publishablePackageJsons:
              './dist/journey-maps-client/package.json,' +
              './dist/journey-maps-client-elements/package.json',
            nextReleaseVersion: "${major}.${minor + 1}.0".toString(),
            releaseVersion: "${major}.${minor}.${patch}".toString()
          )
        }
      }
    }
    stage('Publish to Github-Packages') {
      when {
        allOf {
          branch 'master'
          expression { return params.RELEASE }
        }
      }
      environment {
        GITHUB_ACCESS = credentials('35c4fe78-0d7d-4f6a-91c7-99a512b47665')
      }
      steps {
        sh "cat dist/journey-maps-client/package.json | jq '.version = \"${releaseVersion}\"' > tmp.json && mv tmp.json dist/journey-maps-client/package.json"
        sh "cat dist/journey-maps-client-elements/package.json | jq \'.version = \"${releaseVersion}\"' > tmp.json && mv tmp.json dist/journey-maps-client-elements/package.json"
        sh 'npm set //npm.pkg.github.com/:_authToken $GITHUB_ACCESS'
        sh 'npm publish dist/journey-maps-client/ --registry=https://npm.pkg.github.com'
        sh 'npm publish dist/journey-maps-client-elements/ --registry=https://npm.pkg.github.com'
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
