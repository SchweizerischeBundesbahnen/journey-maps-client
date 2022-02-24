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

    stage('Security Dependency-Check') {
      when {
        branch 'master'
      }
      steps {
          withCredentials([usernamePassword(credentialsId: 'OWASP-NVD_RO', passwordVariable: 'dbpwd', usernameVariable: 'dbuser')]) {
              dependencyCheck additionalArguments: ' --connectionString jdbc:postgresql://owasp-nvd-db.tools.sbb.ch:5432/owasp-nvd-v6 --dbDriverName org.postgresql.Driver --dbUser ' + dbuser + ' --dbPassword ' + dbpwd + ' --format ALL --disableOssIndex --disableRetireJS -n -scan ./**/*.jar', odcInstallation: 'dependency-check'
              dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
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
          releaseVersion = bin_npmLeanPublish(
            targetRepo: 'rokas.npm',
            packageJson: './package.json',
            publishablePackageJsons:
              './dist/journey-maps-client/package.json,' +
              './dist/journey-maps-client-elements/package.json',
          )
        }
      }
    }

    stage('Publish to NPM') {
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
        sh "cat dist/journey-maps-client/package.json | jq '.version = \"${releaseVersion.version}\" | .name = \"@sbbch-rokas/journey-maps-client\"' > tmp.json && mv tmp.json dist/journey-maps-client/package.json"
        sh "cat dist/journey-maps-client-elements/package.json | jq \'.version = \"${releaseVersion.version}\" | .name = \"@sbbch-rokas/journey-maps-client-elements\"' > tmp.json && mv tmp.json dist/journey-maps-client-elements/package.json"
        sh 'npm publish dist/journey-maps-client/ --registry=https://registry.npmjs.org --access public'
        sh 'npm publish dist/journey-maps-client-elements/ --registry=https://registry.npmjs.org --access public'
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

          cloud_helmchartsDeploy(
            cluster: 'aws_aws01t',
            project: 'ki-journey-maps-client',
            credentialId: '3561396d-b39e-44ff-a871-ed1017266f57',
            chart: 'ki-journey-maps-client',
            release: 'ki-journey-maps-client'
          )
        }
      }
    }
  }
}
