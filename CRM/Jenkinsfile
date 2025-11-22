pipeline {
    agent any

    environment {
        IMAGE = "monapp"
        TAG   = "pr-${env.CHANGE_ID}"   // unique tag per PR
    }

    stages {
        stage('Validate PR Target') {
            steps {
                script {
                    def target = env.CHANGE_TARGET ?: ""
                    echo "Pull Request target branch: ${target}"

                    if (target != "dev") {
                        error(" This PR does NOT target 'dev'. Pipeline stopped.")
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
                bat """
                    echo Preparing environment...
                    docker --version
                    echo Workspace: %CD%
                """
            }
        }


        stage('Build') {
            steps {
                bat """
                    docker build -t %IMAGE%:%TAG% .
                """
            }
        }

        stage('Run') {
            steps {
                bat """
                    docker rm -f monapp_test 2>nul || ver > nul
                    docker run -d --name monapp_test -p 8081:80 %IMAGE%:%TAG%
                    ping -n 5 127.0.0.1 > nul
                """
            }
        }

        stage('Smoke Test') {
            steps {
                bat """
                    echo Testing HTTP status...
                    curl -I http://localhost:8081 | find "200 OK"
                """
            }
        }


        stage('Archive Artifacts') {
            steps {
                bat "echo Smoke Test Passed > smoke_result.txt"
                archiveArtifacts artifacts: 'smoke_result.txt', fingerprint: true
            }
        }


        stage('Cleanup') {
            steps {
                bat "docker rm -f monapp_test 2>nul || ver > nul"
            }
        }
    }

    post {
        success {
            echo "✔ PR Build + Smoke Test Succeeded"
        }
        failure {
            echo " PR Build or Smoke Test Failed"
            bat "docker rm -f monapp_test 2>nul || ver > nul"
        }
    }
}
//comment