pipeline {
    agent any

    stages {

        stage('Check PR Target') {
            steps {
                script {
                    // Detect the target branch of the PR
                    def targetBranch = env.CHANGE_TARGET ?: ""

                    echo "Detected PR target branch: ${targetBranch}"

                    // Block PRs not targeting dev
                    if (targetBranch != "dev") {
                        echo "This PR does NOT target dev. Skipping pipeline."
                        currentBuild.result = 'NOT_BUILT'
                        error("Stopping pipeline because PR target is not dev.")
                    }
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build (Parallel runtimes)') {
            parallel {
                stage('Node 18') {
                    agent { docker { image 'node:18' } }
                    steps {
                        sh 'npm install'
                        sh 'npm run build'
                    }
                }
                stage('Node 20') {
                    agent { docker { image 'node:20' } }
                    steps {
                        sh 'npm install'
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t crm-pr .'
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker run -d -p 5000:5000 --name crm-pr-container crm-pr'
            }
        }

        stage('Archive Results') {
            steps {
                archiveArtifacts artifacts: '**/logs/*.log', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            // CLEANUP container
            sh 'docker rm -f crm-pr-container || true'

            // CLEANUP unused images/containers
            sh 'docker system prune -f || true'
        }
    }
}
