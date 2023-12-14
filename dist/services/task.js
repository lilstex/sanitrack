"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qrcode = __importStar(require("qrcode"));
const jsqr_1 = __importDefault(require("jsqr"));
const jimp_1 = __importDefault(require("jimp"));
// Function to generate a QR code with the required data
const generateQRCode = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const qrCode = yield qrcode.toDataURL(data);
        return {
            status: true,
            data: qrCode
        };
    }
    catch (error) {
        console.error('Error generating QR code:', error);
        return {
            status: false,
            message: 'Error generating QR code',
        };
    }
});
// Function to decode a QR code
const decodeQRCode = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const qrBuffer = Buffer.from(data.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64');
        const image = yield jimp_1.default.read(qrBuffer);
        // Get the image data
        const imageData = {
            data: new Uint8ClampedArray(image.bitmap.data),
            width: image.bitmap.width,
            height: image.bitmap.height,
        };
        // Use jsQR to decode the QR code
        const decodedQR = (0, jsqr_1.default)(imageData.data, imageData.width, imageData.height);
        if (!decodedQR) {
            return {
                status: false,
                message: 'Failed to decode QR code.',
            };
        }
        return {
            status: true,
            data: decodedQR.data
        };
    }
    catch (error) {
        return {
            status: false,
            message: 'Error decoding QR code',
        };
    }
});
exports.default = {
    generateQRCode,
    decodeQRCode,
};
//# sourceMappingURL=task.js.map