export class SupplierApi {
    protected url: string | null = null
    
    constructor(protected options: any) { 
        this.url = `${this.options.apiUrl}/supplier`;
    }

    async find(uuid: string) { 
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${this.url}/${uuid}`);
        xhr.setRequestHeader("Authorization", `Bearer ${this.options.accessToken}`);
        xhr.onload = () => {
            if (xhr.status === 200) {
                return JSON.parse(xhr.responseText);
            } else {
                throw new Error("Failed to fetch supplier.");
            }
        };
        xhr.onerror = () => { throw new Error("Network error.") };
        xhr.send();
    }
    
    async findAll() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${this.url}`);
        xhr.setRequestHeader("Authorization", `Bearer ${this.options.accessToken}`);
        xhr.onload = () => {
            if (xhr.status === 200) {
                return JSON.parse(xhr.responseText);
            } else {
                throw new Error("Failed to fetch suppliers.");
            }
        };
        xhr.onerror = () => { throw new Error("Network error.") };
        xhr.send();
    }
    
    async create(data: any) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${this.url}`);
        xhr.setRequestHeader("Authorization", `Bearer ${this.options.accessToken}`);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status === 201) {
                return JSON.parse(xhr.responseText);
            } else {
                throw new Error("Failed to create supplier.");
            }
        };
        xhr.onerror = () => { throw new Error("Network error.") };
        xhr.send(JSON.stringify(data));
    }
    
    async update(uuid: string, data: any) {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", `${this.url}/${uuid}`);
        xhr.setRequestHeader("Authorization", `Bearer ${this.options.accessToken}`);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status === 200) {
                return JSON.parse(xhr.responseText);
            } else {
                throw new Error("Failed to update supplier.");
            }
        };
        xhr.onerror = () => { throw new Error("Network error.") };
        xhr.send(JSON.stringify(data));
    }
}