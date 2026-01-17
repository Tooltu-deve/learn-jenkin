pipeline {
    agent any
    
    environment {
        // Thay đổi DOCKER_HUB_USERNAME bằng username Docker Hub của bạn
        DOCKER_HUB_USERNAME = 'tooltu'
        
        // Image tags
        BACKEND_IMAGE = "${DOCKER_HUB_USERNAME}/todo-backend"
        FRONTEND_IMAGE = "${DOCKER_HUB_USERNAME}/todo-frontend"
        
        // Build version (sử dụng BUILD_NUMBER hoặc GIT_COMMIT)
        IMAGE_TAG = "${env.BUILD_NUMBER ?: 'latest'}"
        IMAGE_TAG_LATEST = "latest"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from Git repository...'
                checkout scm
            }
        }
        
        stage('Build Backend Image') {
            steps {
                script {
                    echo "Building backend Docker image: ${BACKEND_IMAGE}:${IMAGE_TAG}"
                    docker.build("${BACKEND_IMAGE}:${IMAGE_TAG}", "--file backend/Dockerfile backend/")
                    
                    // Tag as latest
                    sh "docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${BACKEND_IMAGE}:${IMAGE_TAG_LATEST}"
                }
            }
        }
        
        stage('Build Frontend Image') {
            steps {
                script {
                    echo "Building frontend Docker image: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                    docker.build("${FRONTEND_IMAGE}:${IMAGE_TAG}", "--file frontend/Dockerfile frontend/")
                    
                    // Tag as latest
                    sh "docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${FRONTEND_IMAGE}:${IMAGE_TAG_LATEST}"
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    echo 'Logging in to Docker Hub...'
                    // Sử dụng credentials ID đã cấu hình trong Jenkins
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                    }
                    
                    echo "Pushing backend image: ${BACKEND_IMAGE}:${IMAGE_TAG}"
                    sh "docker push ${BACKEND_IMAGE}:${IMAGE_TAG}"
                    sh "docker push ${BACKEND_IMAGE}:${IMAGE_TAG_LATEST}"
                    
                    echo "Pushing frontend image: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                    sh "docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                    sh "docker push ${FRONTEND_IMAGE}:${IMAGE_TAG_LATEST}"
                    
                    echo 'Logging out from Docker Hub...'
                    sh "docker logout"
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo 'Deploying application with docker-compose...'
                    
                    // Stop and remove old containers
                    sh '''
                        docker-compose -f docker-compose.prod.yml down || true
                    '''
                    
                    // Pull latest images
                    sh '''
                        docker-compose -f docker-compose.prod.yml pull
                    '''
                    
                    // Start containers
                    sh '''
                        docker-compose -f docker-compose.prod.yml up -d
                    '''
                    
                    // Wait for services to be healthy
                    sh '''
                        sleep 10
                        docker-compose -f docker-compose.prod.yml ps
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
            echo "Backend image: ${BACKEND_IMAGE}:${IMAGE_TAG}"
            echo "Frontend image: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
        always {
            // Cleanup: remove dangling images
            sh '''
                docker image prune -f || true
            '''
        }
    }
}
