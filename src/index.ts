import httpProxy from 'http-proxy'
import express, { Request, Response, Express } from 'express'

const servers: string[] = [
    'http://127.0.0.1: 3030',
    'http://127.0.0.1: 4040',
    'http://127.0.0.1: 5000',
    'http://127.0.0.1: 8080',
]

class RoundRobinBalancer {
    private index: number
    private servers: string[]
    private proxy: httpProxy

    constructor(servers: string[]) {
        this.index = 0
        this.servers = servers
        this.proxy = httpProxy.createProxyServer()
    }

    public getServer(): string {
        const selectedServer: string = this.servers[this.index]
        this.index = (this.index + 1) % this.servers.length
        return selectedServer
    }

    public requestHandle(req: Request, res: Response): void {
        const targetServer: string = this.getServer()
        this.proxy.web(req, res, { target: targetServer })
    }
}

const balancer: RoundRobinBalancer = new RoundRobinBalancer(servers)

const application: Express = express()
application.all('*', balancer.requestHandle.bind(balancer))
application.listen(3333)
