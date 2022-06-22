import { BrowserMultiFormatReader } from '@zxing/library';
import { invoke } from '@tauri-apps/api/tauri';

let reader: BrowserMultiFormatReader;
let timer;

export const listVideoInputDevices = (): Promise<Result> => {
    if (!reader) {
        reader = new BrowserMultiFormatReader();
    }
    return reader.listVideoInputDevices().then((videoInputDevices) => {
        const unauthorized = videoInputDevices.some((videoInputDevice) => {
            return !videoInputDevice.deviceId;
        });
        if (unauthorized) {
            return navigator.mediaDevices.getUserMedia({ video: true }).then((mediaStream) => {
                mediaStream.getVideoTracks().forEach((videoTrack) => {
                    videoTrack.stop();
                });
                return reader.listVideoInputDevices();
            });
        }
        return videoInputDevices;
    }).then((videoInputDevices) => ({
        code: 200000,
        data: videoInputDevices,
    })).catch((err) => ({
        code: 300000,
        message: err.message,
    }));
};

const decode = (deviceId) => {
    reader.decodeOnceFromVideoDevice(deviceId).then((result) => {
        invoke('scan_key_press', { str: result.getText() });
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