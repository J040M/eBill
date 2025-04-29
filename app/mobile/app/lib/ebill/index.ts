import { AuthApi, EbillApi, SupplierApi } from './modules';

export default class EbillClient {
    protected options: any = null;
    
    constructor(url: string) {
        if (!url) throw new Error("API URL is not set.");
        
        this.options.apiUrl = url
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