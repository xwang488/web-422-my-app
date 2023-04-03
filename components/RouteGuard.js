import { isAuthenticated } from '@/lib/authenticate'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { favouritesAtom, searchHistoryAtom } from '@/store'
import { useAtom } from "jotai"
import { getFavourites, getHistory } from '@/lib/userData'


const PUBLIC_PATHS = ['/login', '/', '/_error', '/register']

export default function RouteGuard (props) {
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom)
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)
    const [authorized, setAuthorized] = useState(false)
    const router = useRouter()

    async function updateAtoms () {
        const favourites = await getFavourites()
        const history = await getHistory()
        setFavouritesList(favourites)
        setSearchHistory(history)
    }

    useEffect(() => {
        //ensure our atoms are update when the user refershes the page
        updateAtoms()

        // on initial load - run auth check
        authCheck(router.pathname)

        // on route change complete - run auth check
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeComplete', authCheck)
        }

    }, [])

    function authCheck (url) {
        // redirect to login page if accessing a private page and not logged in
        const path = url.split('?')[0]
        if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
            setAuthorized(false)
            router.push('/login')
        } else {
            setAuthorized(true)
        }
    }


    return <>{authorized && props.children}</>
}