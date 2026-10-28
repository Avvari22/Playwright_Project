pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.64.0-noble'
        }
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Playwright tests') {
            steps {
                sh 'npm test'
            }
        }
    }

    post {
        always {
            sh '''
                if [ ! -d "allure-results" ]; then
                    echo "ERROR: allure-results directory is missing"
                    exit 1
                fi

                result_count=$(find allure-results -type f -name '*-result.json' | wc -l)
                echo "Allure test results: $result_count"

                if [ "$result_count" -eq 0 ]; then
                    echo "ERROR: No Allure test results were generated"
                    exit 1
                fi

                npx allure generate allure-results --clean -o allure-report
            '''

            archiveArtifacts artifacts: 'allure-report/**,allure-results/**,playwright-report/**,test-results/**', allowEmptyArchive: true
        }
    }
}
