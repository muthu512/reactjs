pipeline {
    agent any 

    environment {
        NODE_HOME = "C:\\Program Files\\nodejs" // Path to Node.js installation
        TOMCAT_HOME = "C:\\Program Files\\Apache Software Foundation\\Tomcat 9.0" // Path to your Tomcat installation
        REACT_APP_NAME = "login360ui" // Replace with your app name
        BUILD_DIR = "build" // Default build directory for React apps
        DEPLOY_DIR = "${TOMCAT_HOME}\\webapps\\${REACT_APP_NAME}" // Deployment directory in Tomcat
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the repository
                git url: 'https://github.com/muthu512/reactjs.git', branch: 'master', credentialsId: 'muthu512'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Install npm dependencies
                    bat "\"${NODE_HOME}\\npm\" install"
                    
                    // Update Vite and other dependencies
                    bat "\"${NODE_HOME}\\npm\" install vite@latest"
                    bat "\"${NODE_HOME}\\npm\" update"
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    // Set memory and debug options and run the build
                    bat "set NODE_OPTIONS=--max-old-space-size=4096 && set DEBUG=vite:* && \"${NODE_HOME}\\npm\" run build"
                }
            }
        }

        stage('Deploy to Tomcat') {
            steps {
                script {
                    // Remove old deployment
                    bat "rmdir /s /q ${DEPLOY_DIR}"

                    // Copy the build files to Tomcat webapps directory
                    bat "xcopy /E /I /Y ${BUILD_DIR}\\* ${DEPLOY_DIR}\\"
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed.'
        }
    }
}
