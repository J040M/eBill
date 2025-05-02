export const en = {
    home: {
        title: "Let's scan  some documents!",
        actions: {
            camera: "Open Camera",
            login: "Open Login",
            settings: "Open Settings",
            ebill: "Open Ebills"
        }
    },
    ebill: {
        title: "Ebill",
        loading: "Loading...",
        form: {
            id: "uuid",
            bill_number: "#",
            supplier: "Supplier",
            issue_date: "Issue date",
            due_date: "Due date",
            items: {
                title: "Items",
                label: "Item",
                quantity: "Quantity",
                amount: "Amount"
            },
            tax: {
                title: "Taxes",
                label: "Label",
                value: "value"
            },
            created_at: "Created at",
            modified_at: "Modified at",
            total: "Total",
        }
    },
    settings: {
        title: "Settings",
        actions: {
            save_api_url: "Save & Test"
        },
        inputs: {
            placeholder: {
                api_url: "API URL"
            }
        }
    },
    login: {
        title: "Login",
        email: "Email",
        password: "Password"
    },
    camera: {
        title: "Camera",
        actions: {
            request_permission: "We need your permission to show the camera",
            grant_permission: "Grant permission",
            take_picture: "Take picture",
            upload_picture: "Upload",
            retake_picture: "Retake",
            close_camera: "Close camera"
        }
    },
    alerts: {
        error: "Error",
        api: {
            success_title: "Success",
            success: "API connection successful",
            fail_title: "Fail",
            fail: "API connection failed",
            missing_url: "Please enter a valid URL"
        },
        network: {
            fail: "Network error occured"
        },
        login: {
            missing_inputs: "Please fill the missing fields",
        }
    },
    not_found: {
        title: "Ups, it was right here but now is not!",
        description: "",
        go_back: "Let's go back home"
    }
}