pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git credentialsId: 'muthu512', url: 'https://github.com/muthu512/reactjs.git', branch: 'master'
            }
        }

        stage('Check Environment Variables') {
            steps {
                script {
                    bat 'echo %PATH%'
                }
            }
        }

        stage('Check for package.json') {
            steps {
                script {
                    def projectDir = "C:\\Users\\Dell-Lap\\Downloads\\login360ui\\login360ui"
                    dir(projectDir) {
                        bat 'if exist "package.json" (echo package.json exists) else (echo package.json not found && exit 1)'
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    def projectDir = "C:\\Users\\Dell-Lap\\Downloads\\login360ui\\login360ui"
                    dir(projectDir) {
                        bat 'node -v'
                        bat 'npm -v'
                        bat 'npm install || exit 1'
                    }
                }
            }
        }

        stage('Build React App') {
            steps {
                script {
                    def projectDir = "C:\\Users\\Dell-Lap\\Downloads\\login360ui\\login360ui"
                    dir(projectDir) {
                        bat 'npm run build || exit 1'
                        bat 'dir build'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    bat 'if not exist "C:\\Users\\Dell-Lap\\Downloads\\node\\" mkdir "C:\\Users\\Dell-Lap\\Downloads\\node\\"'
                    bat 'xcopy /S /I /Y "C:\\Users\\Dell-Lap\\Downloads\\login360ui\\login360ui\\build\\*" "C:\\Users\\Dell-Lap\\Downloads\\node\\"'
                    bat 'dir "C:\\Users\\Dell-Lap\\Downloads\\node\\"'
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                script {
                    // Add any cleanup commands here if needed
                    echo 'Cleanup stage - if needed'
                }
            }
        }
    }

    post {
        always {
            echo 'This will always run after the pipeline finishes'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
