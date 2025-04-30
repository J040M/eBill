import { Alert } from "react-native";
import { Options, Ebill } from "../types";

export class EbillApi {
    protected url: string | null = null

    constructor(protected options: Options) {
        this.url = `${this.options.apiUrl}/ebill`;
    }

    async find(uuid: string): Promise<Ebill> {
        const response = await fetch(`${this.options.apiUrl}/${uuid}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.options.accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch eBills.");
        }

        return await response.json();
    }

    async findAll(): Promise<Ebill[]> {
        const response = await fetch(`${this.options.apiUrl}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.options.accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch eBills.");
        }

        return await response.json();
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
        formData.append('file', file as any); // `as any` needed for React Native's FormData

        try {
            const response = await fetch(`${this.options.apiUrl}/ebill/upload`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.options.accessToken}`,
                },
                body: formData,
            });

            if (response.status === 201) {
                Alert.alert('Upload', 'Bill uploaded successfully');
            } else {
                const errorText = await response.text();
                console.error('Error uploading picture: Server responded with status', response.status, errorText);
            }
        } catch (error) {
            console.error('Error uploading picture: Network error', error);
        }
    }

    async update(uuid: string, data: Ebill): Promise<Ebill> {
        try {
          const response = await fetch(`${this.options.apiUrl}/${uuid}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${this.options.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
      
          if (!response.ok) {
            throw new Error('Failed to update eBill.');
          }
      
          return await response.json();
        } catch (error) {
          throw new Error(`Network error: ${error}`);
        }
      }      
}