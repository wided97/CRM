/*
=================================================================================
Jenkinsfile (multibranch) - Node (backend) + React (frontend) + MongoDB
WITHOUT SMOKE TEST STAGE (removed per request)
=================================================================================
*/

pipeline {
    agent any

    environment {
        GITHUB_CREDENTIALS = 'github-token'
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        COMPOSE_PROJECT_NAME = "crm_pipeline_${env.BUILD_ID}"
    }

    stages {

        stage('Determine Pipeline Type') {
            steps {
                script {
                    if (env.CHANGE_ID) {
                        env.PIPELINE_TYPE = 'PR'
                        echo "Detected: Pull Request"
                    } else if (env.GIT_TAG) {
                        env.PIPELINE_TYPE = 'TAG'
                        echo "Detected: Tag Build"
                    } else {
                        env.PIPELINE_TYPE = 'DEV'
                        echo "Detected: Dev Build"
                    }
                }
            }
        }

        stage('Checkout SCM') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[
                        name: env.CHANGE_BRANCH ?: env.GIT_TAG ?: env.BRANCH_NAME ?: 'refs/heads/dev'
                    ]],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [],
                    userRemoteConfigs: [[
                        url: 'https://github.com/wided97/CRM.git',
                        credentialsId: "${GITHUB_CREDENTIALS}"
                    ]]
                ])
            }
        }

        stage('Validate PR Target') {
            when {
                expression { env.PIPELINE_TYPE == 'PR' }
            }
            steps {
                script {
                    echo "PR target branch = ${env.CHANGE_TARGET}"
                    if (env.CHANGE_TARGET != 'dev') {
                        echo "⚠ WARNING: PR does not target dev!"
                        currentBuild.result = 'UNSTABLE'
                    } else {
                        echo "✔ PR target is dev"
                    }
                }
            }
        }

        /***************************************************************
         SETUP stage: install backend + frontend dependencies
        ***************************************************************/
        stage('Setup') {
            steps {
                script {
                    echo "→ Installing npm dependencies..."

                    if (isUnix()) {
                        sh '''
                            set -e
                            cd CRM/BackEnd
                            npm ci --no-audit --progress=false
                            cd ../frontend
                            npm ci --no-audit --progress=false
                            cd ../../
                        '''
                    } else {
                        bat '''
    @echo off
    cd CRM\\BackEnd
    npm ci --no-audit --no-progress

    cd ..\\frontend
    npm ci --no-audit --no-progress

    cd ..\\..
'''
    
                    }
                }
            }
        }

        /***************************************************************
         BUILD backend + frontend
        ***************************************************************/
        stage('Build') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                            set -e
                            # Backend build if available
                            if [ -f CRM/BackEnd/package.json ]; then
                                cd CRM/BackEnd
                                if npm run | grep -q "build"; then
                                    npm run build
                                fi
                                cd ../..
                            fi

                            cd CRM/frontend
                            npm run build
                            cd ../..
                        '''
                    } else {
                        bat '''
                            @echo off
                            if exist CRM\BackEnd\package.json (
                                pushd CRM\BackEnd
                                call npm run build || echo "backend build skipped"
                                popd
                            )
                            pushd CRM\frontend
                            call npm run build
                            popd
                        '''
                    }
                }
            }
        }

        /***************************************************************
         RUN docker-compose (Mongo + backend + frontend)
        ***************************************************************/
        stage('Run') {
            steps {
                script {
                    echo "→ Running docker-compose stack..."

                    if (isUnix()) {
                        sh """
                            set -e
                            COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME} docker-compose -f ${DOCKER_COMPOSE_FILE} build --parallel
                            COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME} docker-compose -f ${DOCKER_COMPOSE_FILE} up -d --remove-orphans
                            sleep 3
                        """
                    } else {
                        bat """
                            @echo off
                            set COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME}
                            docker-compose -f %DOCKER_COMPOSE_FILE% build --parallel
                            docker-compose -f %DOCKER_COMPOSE_FILE% up -d --remove-orphans
                            timeout /t 3 /nobreak >nul
                        """
                    }
                }
            }
        }

        /***************************************************************
         ARCHIVE: frontend build + backend logs (if any)
        ***************************************************************/
        stage('Archive Artifacts') {
            steps {
                script {
                    echo "→ Archiving build artifacts..."
                    archiveArtifacts artifacts: 'CRM/frontend/build/**', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'CRM/BackEnd/**/*.log', allowEmptyArchive: true
                }
            }
        }

    }

    post {
        always {
            script {
                echo "→ Cleaning containers (post)..."

                if (isUnix()) {
                    sh """
                        set +e
                        COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME} docker-compose -f ${DOCKER_COMPOSE_FILE} down -v --remove-orphans
                    """
                } else {
                    bat """
                        @echo off
                        set COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME}
                        docker-compose -f %DOCKER_COMPOSE_FILE% down -v --remove-orphans
                    """
                }
            }
        }
        success {
            echo "✔ ${env.PIPELINE_TYPE} pipeline SUCCESS"
        }
        unstable {
            echo "⚠ ${env.PIPELINE_TYPE} pipeline UNSTABLE"
        }
        failure {
            echo "❌ ${env.PIPELINE_TYPE} pipeline FAILED"
        }
    }
}
