# client-server model
1.  server
    -   always on host
    -   permanent IP address
    -   often a data center

2. client
    - contact, communicate with server
    - may be intermittently connected
    - may have dynamic IP address
    - do not communicate directly with each other

3. example: HTTP, IMAP, FTP

# Peer-to-peer model
1. no always-on server
2. arbitrary end systems directly communicate
3. peers are intermittently connected and change IP addresses
4. peers request service from other peers, provide service in return
    - self scalability 
    - new peers bring new service capacity, as well as new service demands

# sockets
process sends/receives messages to/from its socket
    - socket: door between application layer and transport layer

## addressing processes
to receive messages, process must have identifier
identifier includes both IP address and port number(端口号) associated with process on host 

# open protocols:
公共的

# proprietary protocols:
部分公司专有的协议，他们的运作方式是不被公开的

# what transport service does an app need?
1. date interaction
    - 需要可靠的传输: file transfer, email
    - 能容忍不可靠传输: audio, video
2. timing
    - 需要及时的传输
3. throughput
    - 需要高吞吐量的传输
4. security
    - 需要安全的传输

# TCP service:
1. 保证在发送和接收之间的可靠传输
2. flow control: 
    - sender不会发送超过接收者处理能力的数据
3. congestion control:
    - sender不会发送超过网络处理能力的数据
4. connection-oriented:
    - 先建立连接，然后再传输数据
5. 不提供任何时间保证和安全服务

# UDP service:
不保证可靠的传输
- UDP使用的原因：可以在应用层上实现可靠的传输

# TCP secure

- 原始的 TCP & UDP 套接字:

没有加密
明文密码被发送到套接字中
在互联网上以明文传输 (！)
传输层安全协议 (TLS)

-提供加密的 TCP 连接
数据完整性
端点认证
TLS 在应用层实现

- 应用程序使用 TLS 库，而 TLS 库反过来使用 TCP
明文发送到“套接字”后，在互联网上传输时会被加密
更多内容：第八章