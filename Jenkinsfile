pipeline {
    agent any

    options {
        timeout(time: 120, unit: 'MINUTES') // 2-hour timeout
        buildDiscarder(logRotator(numToKeepStr: '5', artifactNumToKeepStr: '5'))
    }

    stages {
        stage('Checkout SCM') {
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

        stage('Prepare Project') {
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
                        bat 'npm install --audit --force'
                    }
                }
            }
        }

        stage('Optimized Build React App') {
            steps {
                timeout(time: 30, unit: 'MINUTES') {
                    dir("C:\\Users\\Dell-Lap\\Downloads\\login360ui\\login360ui") {
                        script {
                            try {
                                // Clean node_modules
                                bat 'rmdir /S /Q node_modules'
                                
                                // Install dependencies with force flag
                                bat 'npm ci --force'
                                
                                // Set NODE_OPTIONS
                                bat 'set NODE_OPTIONS=--max-old-space-size=16384'
                                
                                // Build with optimized memory
                                bat 'npm run build || exit 1'
                            } catch (Exception e) {
                                echo "Build failed: ${e.message}"
                                currentBuild.result = 'FAILED'
                            }
                        }
                    }
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                script {
                    archiveArtifacts artifacts: 'build/**', allowEmptyArchive: true
                }
            }
        }

        stage('Deploy to Tomcat') {
            steps {
                script {
                    def tomcatDir = "C:\\Program Files\\Apache Software Foundation\\Tomcat 9.0\\webapps"
                    def appName = "login360ui"
                    def projectDir = "C:\\Users\\Dell-Lap\\Downloads\\login360ui\\login360ui"

                    // Check if the build folder exists and contains files
                    bat "if not exist \"${projectDir}\\build\" (echo Build directory does not exist && exit 1)"
                    bat "dir \"${projectDir}\\build\""

                    // If the build directory exists but is empty, display an error and exit
                    bat "if not exist \"${projectDir}\\build\\*\" (echo No files in build directory && exit 1)"

                    // Create the application directory if it does not exist
                    bat "if not exist \"${tomcatDir}\\${appName}\" mkdir \"${tomcatDir}\\${appName}\""

                    // Copy files from build directory to Tomcat
                    bat "xcopy /S /I /Y \"${projectDir}\\build\\*\" \"${tomcatDir}\\${appName}\\\""

                    // Verify deployment by listing files in the Tomcat app directory
                    bat "dir \"${tomcatDir}\\${appName}\""
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    // Remove unnecessary files
                    bat 'rmdir /S /Q C:\\Users\\Dell-Lap\\.jenkins\\workspace\\react js@2\\node_modules'
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
        unstable {
            echo 'Pipeline unstable!'
        }
    }
}
