pipeline {
  agent any
  stages {
    stage('del') {
      steps {
        sh '''exsitContainer=`docker ps -a --filter name=$NAME |awk \'{print $1}\'|tail -n +2`
echo $exsitContainer
if [ -n "$exsitContainer" ]; then 
    docker stop $exsitContainer
    docker rm $exsitContainer 
fi'''
      }
    }
    stage('error') {
      parallel {
        stage('server') {
          steps {
            sh 'cd server && docker build -t mynodeapp . && docker run -d -p 7001:7001 mynodeapp'
          }
        }
        stage('front') {
          steps {
            sh 'cd frontend && docker build -t myfront . && docker run -d -p 4000:80 myfront'
          }
        }
      }
    }
  }
}
