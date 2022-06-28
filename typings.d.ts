import '@umijs/max/typings';

declare global {

    type  Result = {
        readonly code: number;
        readonly message?: string;
        readonly data?: any;
    }

    type Payload = {
        readonly keyPath: Iterable<string>,
        readonly value: any
    }

    type Host = {
        readonly id: number;
        readonly ip: string;
        readonly realm: string;
        readonly selected: boolean;
    }

    type Env = {
        readonly id: number;
        readonly name: string;
        readonly type: 'REG_SZ' | 'REG_EXPAND_SZ';
        readonly value: string;
        readonly selected: boolean;
    }
}
