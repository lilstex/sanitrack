import * as qrcode from 'qrcode';
import jsQR from 'jsqr';

// Function to generate a QR code with the required data
const generateQRCode = async (data: string): Promise<any> => {
    try {
        const qrCode = await qrcode.toDataURL(data);
        return {
            status: true,
            data: qrCode
        };
    } catch (error) {
        console.error('Error generating QR code:', error);
        return {
            status: false,
            message: 'Error generating QR code',
        }
    }
};

// Function to decode a QR code
const decodeQRCode = (imageData: Buffer): any => {
    try {
        // Convert Buffer to Uint8Array with type assertion
        const uint8Array = imageData as Uint8Array;

        // Create a new Uint8ClampedArray from Uint8Array
        const uint8ClampedArray = new Uint8ClampedArray(uint8Array);

        // Use jsQR with Uint8ClampedArray
        const qrCode = jsQR(uint8ClampedArray, 0, 0);

        if (qrCode) {
            const decodedData = JSON.parse(qrCode.data as string);
            return {
                status: true,
                data: decodedData
            };
        } else {
            return {
                status: false,
                message: 'Failed to decode QR code'
            };
        }
    } catch (error) {
        console.error('Error decoding QR code:', error);
        return {
            status: false,
            message: 'Error generating QR code',
        }
    }
};

export default {
    generateQRCode,   
    decodeQRCode,
};