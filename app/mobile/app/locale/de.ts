export const de = {
    home: {
        title: "Lass uns einige Dokumente scannen!",
        actions: {
            camera: "Kamera öffnen",
            login: "Login öffnen",
            settings: "Einstellungen öffnen"
        }
    },
    ebill: {
        title: "E-Rechnung",
        loading: "Wird geladen...",
        form: {
            id: "UUID",
            bill_number: "Rechnungsnummer",
            supplier: "Lieferant",
            issue_date: "Ausstellungsdatum",
            due_date: "Fälligkeitsdatum",
            items: {
                title: "Artikel",
                label: "Artikel",
                quantity: "Menge",
                amount: "Betrag"
            },
            tax: {
                title: "Steuern",
                label: "Bezeichnung",
                value: "Wert"
            },
            created_at: "Erstellt am",
            modified_at: "Geändert am",
            total: "Gesamt"
        }
    },
    settings: {
        title: "Einstellungen",
        actions: {
            save_api_url: "Speichern & Testen"
        },
        inputs: {
            placeholder: {
                api_url: "API-URL"
            }
        }
    },
    login: {
        title: "Anmeldung",
        email: "E-Mail",
        password: "Passwort"
    },
    camera: {
        title: "Kamera",
        actions: {
            request_permission: "Wir benötigen Ihre Erlaubnis, um die Kamera anzuzeigen",
            grant_permission: "Erlaubnis erteilen",
            take_picture: "Foto aufnehmen",
            upload_picture: "Hochladen",
            retake_picture: "Erneut aufnehmen",
            close_camera: "Kamera schließen"
        }
    },
    alerts: {
        error: "Fehler",
        api: {
            success_title: "Erfolg",
            success: "API-Verbindung erfolgreich",
            fail_title: "Fehlgeschlagen",
            fail: "API-Verbindung fehlgeschlagen",
            missing_url: "Bitte geben Sie eine gültige URL ein"
        },
        network: {
            fail: "Netzwerkfehler aufgetreten"
        },
        login: {
            missing_inputs: "Bitte füllen Sie die fehlenden Felder aus"
        }
    },
    not_found: {
        title: "Ups, es war gerade noch hier, jetzt ist es weg!",
        description: "",
        go_back: "Zurück zur Startseite"
    }
}
