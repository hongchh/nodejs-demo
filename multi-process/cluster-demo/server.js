const cluster = require('cluster')

if (cluster.isMaster) {
  const cpuNum = require('os').cpus().length

  for (let i = 0; i < cpuNum; ++i) {
    cluster.fork()
  }

  // 创建进程完成后输出提示信息
  cluster.on('online', (worker) => {
    console.log('Create worker-' + worker.process.pid)
  })

  // 子进程退出后重启
  cluster.on('exit', (worker, code, signal) => {
    console.log('Worker-' + worker.process.pid + ' exited with code: ' + code + ', and signal: ' + signal)
    cluster.fork()
  })
} else {
  const net = require('net')
  net.createServer().on('connection', (socket) => {
    // 利用setTimeout模拟处理请求时的操作耗时
    setTimeout(() => {
      socket.end('Request handled by worker-' + process.pid)
    }, 10)
  }).listen(8080)
}
