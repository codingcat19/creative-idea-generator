pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "creative-idea-generator"
    }

    stages {
        stage('Checkout') {
            steps {
                // Jenkins automatically pulls the code from GitHub
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                script {
                    // Rebuilds the image using your Dockerfile
                    sh "docker compose build"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Stops old containers and starts new ones in detached mode
                    sh "docker compose down"
                    sh "docker compose up -d --build"
                }
            }
        }

        stage('Cleanup') {
            steps {
                // Removes unused docker images to save space
                sh "docker image prune -f"
            }
        }
    }
}
