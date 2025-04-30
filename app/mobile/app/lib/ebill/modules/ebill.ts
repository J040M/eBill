export class EbillApi {
    protected url: string | null = null

    constructor(protected options: Options) {
        this.url = `${this.options.apiUrl}/ebill`;
    }

    async find(uuid: string) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${this.options.apiUrl}/${uuid}`);
        xhr.setRequestHeader("Authorization", `Bearer ${this.options.accessToken}`);
        xhr.onload = () => {
            if (xhr.status === 200) {
                JSON.parse(xhr.responseText);
            } else {
                throw new Error("Failed to fetch eBills.");
            }
        };
        xhr.onerror = () => { throw new Error("Network error.") };
        xhr.send();
    }

    async findAll() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${this.options.apiUrl}/ebills`);
        xhr.setRequestHeader("Authorization", `Bearer ${this.options.accessToken}`);
        xhr.onload = () => {
            if (xhr.status === 200) {
                JSON.parse(xhr.responseText);
            } else {
                throw new Error("Failed to fetch eBills.");
            }
        };
        xhr.onerror = () => { throw new Error("Network error.") };
        xhr.send();
    }

    public async uploadPicture(uri: string): Promise<void> {
        if (!uri) {
            console.error('Picture is not set');
            return;
        }

        const name = new Date().toISOString() + '.jpg';
        const file = {
            uri,
            type: 'image/jpeg',
            name,
        };

        const formData = new FormData();
        formData.append('file', file as any);

        const xhr = new XMLHttpRequest();

        xhr.open('POST', `${this.options.apiUrl}/ebill/upload`);

        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Authorization', `Bearer ${this.options.accessToken}`);

        xhr.onload = () => {
            if (xhr.status === 201) {
                console.log('Picture uploaded successfully!');
            } else {
                console.error('Error uploading picture: Server responded with status', xhr.status, xhr.responseText);
            }
        };

        xhr.onerror = (e) => {
            console.error('Error uploading picture: Network error', e);
        };

        xhr.send(formData);
    }

    async update(uuid: string, data: any) {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", `${this.options.apiUrl}/${uuid}`);
        xhr.setRequestHeader("Authorization", `Bearer ${this.options.accessToken}`);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status === 200) {
                JSON.parse(xhr.responseText);
            } else {
                throw new Error("Failed to update eBill.");
            }
        };
        xhr.onerror = () => { throw new Error("Network error.") };
        xhr.send(JSON.stringify(data));
    }
}