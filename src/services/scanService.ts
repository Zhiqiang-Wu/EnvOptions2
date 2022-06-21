import { BrowserMultiFormatReader } from '@zxing/library';

let reader: BrowserMultiFormatReader;
let timer;

export const listVideoInputDevices = (): Promise<Result> => {
    if (!reader) {
        reader = new BrowserMultiFormatReader();
    }
    return reader.listVideoInputDevices().then((videoInputDevices) => ({
        code: 200000,
        data: videoInputDevices,
    })).catch((err) => ({
        code: 300000,
        message: err.message,
    }));
};

const decode = (deviceId) => {
    reader.decodeOnceFromVideoDevice(deviceId).then((result) => {
        console.log(result.getText());
        timer = setTimeout(() => {
            decode(deviceId);
        }, 1000);
    }).catch(() => {

    });
};

export const openScan = ({ deviceId }): void => {
    decode(deviceId);
};

export const closeScan = () => {
    clearTimeout(timer);
    reader.reset();
};