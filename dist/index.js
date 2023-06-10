"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_proxy_1 = __importDefault(require("http-proxy"));
const express_1 = __importDefault(require("express"));
const servers = [
    'http://127.0.0.1: 3030',
    'http://127.0.0.1: 4040',
    'http://127.0.0.1: 5000',
    'http://127.0.0.1: 8080',
];
class RoundRobinBalancer {
    constructor(servers) {
        this.index = 0;
        this.servers = servers;
        this.proxy = http_proxy_1.default.createProxyServer();
    }
    getServer() {
        const selectedServer = this.servers[this.index];
        this.index = (this.index + 1) % this.servers.length;
        return selectedServer;
    }
    requestHandle(req, res) {
        const targetServer = this.getServer();
        this.proxy.web(req, res, { target: targetServer });
    }
}
const balancer = new RoundRobinBalancer(servers);
const application = (0, express_1.default)();
application.all('*', balancer.requestHandle.bind(balancer));
application.listen(3333);
