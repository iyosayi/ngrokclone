import { describe, it, expect } from 'vitest';
import { encode, decode, buildReq } from '../src/codec';
import type { Message, Register, Ack, Req, Res, Ping, Pong, Err } from '../src/message';

// Sample messages covering every variant
const register: Register = { t: 'reg', sub: 'test', version: 1 };
const ack: Ack = { t: 'ack', sub: 'test', publicUrl: 'https://test.example' };
const req: Req = buildReq({
    id: '123',
    method: 'GET',
    path: '/hello',
    headers: { foo: 'bar' },
    body: 'hi',
});
const res: Res = {
    t: 'res',
    id: '123',
    status: 200,
    headers: { foo: 'bar' },
    body: 'ok',
};
const ping: Ping = { t: 'ping' };
const pong: Pong = { t: 'pong' };
const err: Err = { t: 'err', code: 'ERR_TEST', msg: 'something went wrong' };

const all: Message[] = [register, ack, req, res, ping, pong, err];

describe('codec encode→decode roundtrip', () => {
    all.forEach((msg) => {
        it(`should round-trip ${msg.t}`, () => {
            const encoded = encode(msg);
            const decoded = decode(encoded);
            expect(decoded).toEqual(msg);
        });
    });
});

describe('decode validation', () => {
    it('should throw on invalid payload', () => {
        const invalidJson = JSON.stringify({ foo: 'bar' });
        expect(() => decode(invalidJson)).toThrow();
    });
});
