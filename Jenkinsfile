pipeline {
    agent any

    options {
        timestamps()
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
    }

    environment {
        CI = 'true'
        PLAYWRIGHT_BROWSERS_PATH = '0'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Environment') {
            steps {
                bat '''
                    node --version
                    npm --version
                    java -version
                    git --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install chromium'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                script {
                    def exitCode = bat(
                        script: 'npx playwright test',
                        returnStatus: true
                    )

                    // Setting build status to UNSTABLE allows succeeding reporting stages to continue executing
                    if (exitCode != 0) {
                        currentBuild.result = 'UNSTABLE'
                        echo "Playwright tests failed: ${exitCode}"
                    }
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                bat '''
                    if not exist allure-results (
                        echo Allure results directory missing
                        exit /b 1
                    )
                    npx allure generate allure-results --clean -o allure-report
                '''
            }
        }

        stage('Publish Allure Report') {
            steps {
                // Correctly wrapping the native plugin step within the required 'steps' block
                allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            }
        }
    }

    post {
        always {
            archiveArtifacts(
                artifacts: 'allure-results/**,allure-report/**,playwright-report/**,test-results/**,junit-results/**',
                allowEmptyArchive: true
            )

            junit(
                testResults: 'junit-results/*.xml',
                allowEmptyResults: true
            )
        }

        success {
            echo 'All Playwright tests passed!'
        }

        failure {
            echo 'Build failed. Review Allure and Playwright reports.'
        }
    }
}
