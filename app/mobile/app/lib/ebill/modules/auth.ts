export class AuthApi {
    protected url: string | null = null
    public user: any = null;

    constructor(protected options: Options) {
        this.url = `${this.options.apiUrl}/user`;
    }

    public async login(username: string, password: string): Promise<void> {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${this.url}/login`);
        xhr.setRequestHeader("Content-Type", "application/json");

        const payload = {
            login: {
                type: "password",
                username,
                password,
            }
        }

        xhr.onload = () => {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);

                this.options.accessToken = data.session.access_token;
                this.options.refreshToken = data.session.refresh_token;

                this.user.id = data.user.id;
                this.user.email = data.user.email;
            } else {
                throw new Error("Login failed.");
            }
        };
        xhr.onerror = () => {
            throw new Error("Error contacting server");
        };

        xhr.send(JSON.stringify(payload));
    }

    public async logout(): Promise<void> {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${this.options.apiUrl}/logout`);
        xhr.setRequestHeader("Authorization", `Bearer ${this.options.accessToken}`);
        xhr.onload = () => {
            if (xhr.status === 200) {
                delete this.options.accessToken;
                delete this.options.refreshToken;
                this.user = null;
            } else {
                throw new Error("Logout failed.");
            }
        };
        xhr.onerror = () => { throw new Error("Error contacting server") };
        xhr.send();

    }

    public async renewAccessToken(): Promise<void> {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${this.options.apiUrl}/refresh`);
        xhr.setRequestHeader("Content-Type", "application/json");

        const payload = {
            refresh_token: this.options.refreshToken,
        }

        xhr.onload = () => {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                this.options.accessToken = data.session.access_token;
                this.options.refreshToken = data.session.refresh_token;
            } else {
                throw new Error("Refresh token failed.");
            }
        };
        xhr.onerror = () => {
            throw new Error("Error contacting server");
        };

        xhr.send(JSON.stringify(payload));
    }
}