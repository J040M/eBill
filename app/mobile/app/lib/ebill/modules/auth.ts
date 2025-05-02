import AsyncStorage from "@react-native-async-storage/async-storage";
import { Options, User } from "../types";

export class AuthApi {
    protected url: string | null = null
    public user: User | null = null;

    constructor(protected options: Options) {
        this.url = `${this.options.apiUrl}/user`;
    }

    public async login(email: string, password: string): Promise<void> {
        const payload = {
            login: {
                type: "password",
                email,
                password,
            },
        };

        try {
            const response = await fetch(`${this.url}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.status !== 201) {
                throw new Error('Login failed.');
            }

            const data = await response.json();

            this.options.accessToken = data.session.access_token;
            this.options.refreshToken = data.session.refresh_token;

            await AsyncStorage.multiSet([
                ['accessToken', data.session.access_token],
                ['refreshToken', data.session.refresh_token],
            ]);

            this.user = {
                id: data.user.id,
                email: data.user.email,
            };

        } catch (err) {
            throw new Error(`Error contacting server`);
        }
    }


    public async logout(): Promise<void> {
        try {
            const response = await fetch(`${this.url}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.options.accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Logout failed.');
            }

            delete this.options.accessToken;
            delete this.options.refreshToken;

            await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);

            this.user = null;

        } catch (err) {
            throw new Error(`Error contacting server`);
        }
    }


    public async renewAccessToken(): Promise<void> {
        const payload = {
            refresh_token: this.options.refreshToken,
        };

        try {
            const response = await fetch(`${this.url}/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Refresh token failed.');
            }

            const data = await response.json();

            this.options.accessToken = data.access_token;
            this.options.refreshToken = data.refresh_token;

            await AsyncStorage.multiSet([
                ['accessToken', data.access_token],
                ['refreshToken', data.refresh_token],
            ]);

        } catch (err) {
            throw new Error(`Error contacting server`);
        }
    }
}