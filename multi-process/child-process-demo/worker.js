process.on('message', (msg, server) => {
  if (msg === 'server' && server) {
    server.on('connection', (socket) => {
      // 利用setTimeout模拟处理请求时的操作耗时
      setTimeout(() => {
        socket.end('Request handled by worker-' + process.pid)
      }, 10)
    })
  }
})
