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

        stage('Build_Parallel_Runtimes') {
            parallel {
                stage('Node_18') {
                    agent any
                    steps {
                        bat 'npm install'
                        bat 'npm run build'
                    }
                }

                stage('Node_20') {
                    agent any
                    steps {
                        bat 'node -v'
                        bat 'npm install'
                        bat 'npm run build'
                    }
                }
            }
        }

        stage('Archive_Results') {
            steps {
                archiveArtifacts artifacts: "**/logs/*.log", allowEmptyArchive: true
                archiveArtifacts artifacts: "**/build/**", allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
    }
}
