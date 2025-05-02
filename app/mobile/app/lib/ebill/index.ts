import { AuthApi, EbillApi, SupplierApi } from './modules';
import { Options } from './types';

export default class EbillClient {
    protected options: Options;
    
    constructor(options: Options) {
        this.options = options
    }

    get auth() {
        return new AuthApi(this.options);
    }

    get ebill() {
        return new EbillApi(this.options);
    }

    get supplier() {
        return new SupplierApi(this.options);
    }
}