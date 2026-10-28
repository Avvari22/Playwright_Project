
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

                    if (exitCode != 0) {
                        currentBuild.result = 'FAILURE'
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
            post {
                always {
                    // Triggers the Allure Jenkins Plugin to build and host the dashboard
                    allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
                }
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
