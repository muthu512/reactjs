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
                dir("C:\\Users\\Dell-Lap\\Downloads\\login360ui\\login360ui") { 
                    script {
                        bat 'set NODE_OPTIONS=--max-old-space-size=8096'
                        bat 'npm run build || exit 1'
                    }
                }
            }
        }

        stage('Deploy to Tomcat') {
            steps {
                script {
                    def tomcatDir = "C:\\Program Files\\Apache Software Foundation\\Tomcat 9.0\\webapps"
                    def appName = "my-react-app" // Replace with your desired app name
                    def projectDir = "C:\\Users\\Dell-Lap\\Downloads\\login360ui\\login360ui"

                    bat "if not exist \"${tomcatDir}\\${appName}\" mkdir \"${tomcatDir}\\${appName}\""
                    bat "xcopy /S /I /Y \"${projectDir}\\build\\*\" \"${tomcatDir}\\${appName}\\\""
                    bat "dir \"${tomcatDir}\\${appName}\""
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
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
