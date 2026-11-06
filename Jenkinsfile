pipeline {
    agent any

    parameters {
        string(name: 'GIT_BRANCH', defaultValue: 'develop', description: 'Rama Git a auditar')
    }

    tools {
        nodejs 'Node-20'
    }

    options {
        timeout(time: 15, unit: 'MINUTES')
        ansiColor('xterm')
    }

    environment {
        CI = 'true'
        NITRO_PRESET = 'aws-lambda'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    currentBuild.displayName = "#${currentBuild.number} [Rama: ${params.GIT_BRANCH}]"
                }
                echo '=================================================='
                echo "🚀 [Etapa 1/6] Descargando código de rama: ${params.GIT_BRANCH}"
                echo '=================================================='
                git branch: "${params.GIT_BRANCH}", url: 'https://github.com/Francisco-Javier-Gutierrez/jobnet-front.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '=================================================='
                echo '📦 [Etapa 2/6] Instalando dependencias con npm install'
                echo '=================================================='
                script {
                    if (isUnix()) {
                        sh 'npm install --include=dev'
                    } else {
                        bat 'npm install --include=dev'
                    }
                }
            }
        }

        stage('Code Quality & Formatting') {
            steps {
                echo '=================================================='
                echo '🎨 [Etapa 3/6] Verificando Formato Prettier y ESLint'
                echo '=================================================='
                script {
                    if (isUnix()) {
                        sh 'npm run format:check'
                        sh 'npm run lint'
                    } else {
                        bat 'npm run format:check'
                        bat 'npm run lint'
                    }
                }
            }
        }

        stage('Type Checking') {
            steps {
                echo '=================================================='
                echo '🔍 [Etapa 4/6] Verificando Tipos TypeScript con vue-tsc'
                echo '=================================================='
                script {
                    if (isUnix()) {
                        sh 'npm run typecheck'
                    } else {
                        bat 'npm run typecheck'
                    }
                }
            }
        }

        stage('Unit Tests & Coverage') {
            steps {
                echo '=================================================='
                echo '🧪 [Etapa 5/6] Ejecutando Pruebas Unitarias con Vitest'
                echo '=================================================='
                script {
                    if (isUnix()) {
                        sh 'npm run test:coverage'
                    } else {
                        bat 'npm run test:coverage'
                    }
                }
            }
        }

        stage('SSR Lambda Build Verification') {
            environment {
                NODE_ENV = 'production'
            }
            steps {
                echo '=================================================='
                echo '⚙️ [Etapa 6/6] Compilación Nuxt 4 Nitro (aws-lambda)'
                echo '=================================================='
                script {
                    if (isUnix()) {
                        sh 'npm run build'
                    } else {
                        bat 'npm run build'
                    }
                }
            }
        }
    }

    post {
        success {
            echo '========================================================================'
            echo "✅ PIPELINE SUCCESSFUL: Auditoría aprobada para rama '${params.GIT_BRANCH}'."
            echo '   Listo para promoción automática a producción (main).'
            echo '========================================================================'
        }
        failure {
            echo '========================================================================'
            echo "❌ PIPELINE FAILED: Error detectado en rama '${params.GIT_BRANCH}'."
            echo '   Se bloquea la promoción a producción (main).'
            echo '========================================================================'
        }
        always {
            cleanWs deleteDirs: true, notFailBuild: true
        }
    }
}
