const childProcess = require('child_process')
const net = require('net')
const cpuNum = require('os').cpus().length - 1

// 创建工作进程
let workers = []
let cur = 0
for (let i = 0; i < cpuNum; ++i) {
  workers.push(childProcess.fork('./worker.js'))
  console.log('Create worker-' + workers[i].pid)
}

// 创建TCP服务器
const server = net.createServer()

// 由于master进程也会监听端口。因此需要对请求做出处理
server.on('connection', (socket) => {
  // 利用setTimeout模拟处理请求时的操作耗时
  setTimeout(() => {
    socket.end('Request handled by master')
  }, 10)
})

server.listen(8080, () => {
  console.log('TCP server: 127.0.0.1:8080')
  // 监听端口后将服务器句柄发送给工作进程
  for (let i = 0; i < cpuNum; ++i) {
    workers[i].send('server', server)
    // 工作进程退出后重启
    workers[i].on('exit', ((i) => {
      return () => {
        console.log('Worker-' + workers[i].pid + ' exited')
        workers[i] = childProcess.fork('./worker.js')
        console.log('Create worker-' + workers[i].pid)
        workers[i].send('server', server)
      }
    })(i))
  }
  // 关闭主线程服务器的端口监听
  // server.close()
})
