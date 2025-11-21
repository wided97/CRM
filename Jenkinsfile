//corrected code
pipeline {
    agent any

    stages {
        // 1. CHECKOUT (Toujours exécuté)
        stage('Checkout') {
            steps {
                checkout scm
                echo "Branche actuelle : ${env.BRANCH_NAME}"
            }
        }

        // 2. SETUP
        stage('Setup') {
            steps {
                // "call" permet d'éviter que le script plante si npm n'est pas trouvé (optionnel mais mieux)
                bat 'npm install'
            }
        }

        // 3. BUILD PARALLÈLE (Exigence : Runtimes différents)
        // Note : Idéalement, utilise Docker ici pour avoir vraiment Node 18 et 20.
        // Ici, comme tu utilises "bat", cela utilisera le Node installé sur ton Windows.
        stage('Build_Parallel_Runtimes') {
            parallel {
                stage('Build Node A') {
                    steps {
                        echo "Simulation Build Runtime A"
                        bat 'npm run build --if-present' 
                    }
                }

                stage('Build Node B') {
                    steps {
                        echo "Simulation Build Runtime B"
                        bat 'node -v'
                        bat 'npm run build --if-present'
                    }
                }
            }
        }

        // 4. ARCHIVE (Exigence : Logs et Artefacts)
        stage('Archive_Results') {
            steps {
                // allowEmptyArchive: true évite que le build échoue si pas de logs
                archiveArtifacts artifacts: "**/logs/*.log, **/package.json", allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
        success {
            echo "Build réussi !"
        }
        failure {
            echo "Build échoué."
        }
    }
}
