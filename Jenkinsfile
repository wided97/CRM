pipeline {
    agent any

    stages {

        stage('Check PR Target') {
            steps {
                script {
                    def targetBranch = env.CHANGE_TARGET ?: ""
                    echo "Detected PR target branch: ${targetBranch}"

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
                bat 'npm install'
            }
        }

        stage('Build (Parallel runtimes)') {
            parallel {
                stage('Node 18') {
                    agent any
                    steps {
                        bat 'npm install'
                        bat 'npm run build'
                    }
                }

                stage('Node 20') {
                    agent any   // ❌ REMOVED docker agent
                    steps {
                        // You cannot switch Node version automatically on Windows Jenkins
                        // So we simply log the version
                        bat 'node -v'
                        bat 'npm install'
                        bat 'npm run build'
                    }
                }
            }
        }

        stage('Archive Results') {
            steps {
                archiveArtifacts artifacts: '**/logs/*.log', allowEmptyArchive: true
                archiveArtifacts artifacts: '**/build/**', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
    }
}
