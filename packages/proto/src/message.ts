export interface Register {
    t: 'reg',
    sub: string
    version: 1
}

export interface Ack {
    t: 'ack'
    sub: string
    publicUrl: string
}

export interface Req {
    t: 'req'
    id: string
    method: string
    path: string
    headers: Record<string, string>
    body: string // keep body string|base64 for now
}

export interface Res {
    t: 'res'
    id: string
    status: number
    headers: Record<string, string>
    body: string
}

export interface Ping {
    t: 'ping'
}

export interface Pong {
    t: 'pong'
}

export interface Err {
    t: 'err'
    id?: string
    code: string
    msg: string
}

export type Message = Register | Ack | Req | Res | Ping | Pong | Err