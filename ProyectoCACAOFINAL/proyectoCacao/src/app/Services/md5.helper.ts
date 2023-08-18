import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class Md5Helper {

    // Metodo para encriptar una clave en formaro md5
    generateMD5(value1: string, value2: string): string {
        const combinedValue = value1 + value2;
        return CryptoJS.MD5(combinedValue).toString();
    }
}