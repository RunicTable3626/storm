const API_URL = import.meta.env.VITE_API_URL; // VITE_API_URL from .env

export const generateContent = async (query: string, tone: string, token: string) => {
    try {

        const response = await fetch(`${API_URL}/api/actions/generate-content`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ query, tone }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to generate content");
        }
        return data; // Assuming the response contains email & call script data
    } catch (error) {
        console.error("Error generating content:", error);
        return null;
    }
};



export const rephraseContent = async (query: string) => {
    try {
        const response = await fetch(`${API_URL}/api/actions/rephrase-content`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to rephrase content");
        }
        return data; // Assuming the response contains email & call script data
    } catch (error) {
        console.error("Error rephrase content:", error);
        return null;
    }
};