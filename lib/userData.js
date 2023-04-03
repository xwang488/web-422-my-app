import { getToken } from "./authenticate"

//import { getToken } from "./authenticate";
//require("dotenv").config()


const API_URL = process.env.NEXT_PUBLIC_API_URL

async function fetchWithAuth (url, method) {
    const token = await getToken()
    const response = await fetch(`${API_URL}${url}`, {
        method,
        headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "application/json",
        },
    })
    if (response.ok) {
        return response.json()
    } else {
        return []
    }
}

export async function addToFavourites (id) {
    return fetchWithAuth(`/favourites/${id}`, "PUT")
}

export async function removeFromFavourites (id) {
    return fetchWithAuth(`/favourites/${id}`, "DELETE")
}

export async function getFavourites () {
    return fetchWithAuth("/favourites", "GET")
}

export async function addToHistory (id) {
    return fetchWithAuth(`/history/${id}`, "PUT")
}

export async function removeFromHistory (id) {
    return fetchWithAuth(`/history/${id}`, "DELETE")
}

export async function getHistory () {
    return fetchWithAuth("/history", "GET")
}
