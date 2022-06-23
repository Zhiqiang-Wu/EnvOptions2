import '@umijs/max/typings';

declare global {

    type  Result = {
        readonly code: Number;
        readonly message?: string;
        readonly data?: any;
    }

    type Payload = {
        readonly keyPath: Iterable<string>,
        readonly value: any
    }

    type Host = {
        readonly id: Number;
        readonly ip: string;
        readonly realm: string;
        readonly selected: boolean;
    }

    type Env = {
        readonly id: Number;
        readonly name: string;
        readonly type: 'REG_SZ' | 'REG_EXPAND_SZ';
        readonly value: string;
        readonly selected: boolean;
    }
}
