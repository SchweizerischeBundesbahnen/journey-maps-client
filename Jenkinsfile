#!groovy

def releaseVersion

pipeline {
  agent { label 'nodejs && ncsi' }
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
        sh 'npm run build-lib'
        sh 'npm run build-apps'
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
        NPM_TOKEN = credentials('e5579f36-2d03-4f42-bc79-3f7f11491b5b')
      }
      steps {
        sh "cat dist/journey-maps-client/package.json | jq '.version = \"${releaseVersion}\" | .name = \"@sbbch-rokas/journey-maps-client\"' > tmp.json && mv tmp.json dist/journey-maps-client/package.json"
        sh "cat dist/journey-maps-client-elements/package.json | jq \'.version = \"${releaseVersion}\" | .name = \"@sbbch-rokas/journey-maps-client-elements\"' > tmp.json && mv tmp.json dist/journey-maps-client-elements/package.json"
        // Without sudo I cannot write to /var/data/jenkins/.npmrc
        sh 'sudo npm set //registry.npmjs.org/:_authToken $NPM_TOKEN'
        sh 'sudo npm publish dist/journey-maps-client/ --registry=https://registry.npmjs.org'
        sh 'sudo npm publish dist/journey-maps-client-elements/ --registry=https://registry.npmjs.org'
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
