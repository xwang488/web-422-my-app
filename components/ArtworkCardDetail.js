import { useAtom } from 'jotai'
import { favouritesAtom } from '@/store'
import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Card, Button } from 'react-bootstrap'
import Error from 'next/error'
import { addToFavourites, removeFromFavourites } from '@/lib/userData'


// define the "fetcher" function.  This Can also be defined globally using SWRConfig (https://swr.vercel.app/docs/global-configuration)
const fetcher = (url) => fetch(url).then((res) => res.json())

export default function ArtworkCardDetail (props) {
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom)
    const [showAdded, setShowAdded] = useState(false)
    const { data, error } = useSWR(props.objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}` : null, fetcher)

    useEffect(() => {
        setShowAdded(favouritesList?.includes(props.objectID))
    }, [favouritesList])


    const favouritesClicked = async () => {
        if (showAdded) {
            setFavouritesList(await removeFromFavourites(props.objectID))
            setShowAdded(false)
        } else {
            setFavouritesList(await addToFavourites(props.objectID))
            setShowAdded(true)
        }
    }


    if (error) {
        return <Error statusCode={404} />
    }

    if (data) {
        return (<>
            <Card>
                {data.primaryImageSmall ? <Card.Img variant="top" src={data.primaryImageSmall} /> : <></>}

                <Card.Body>
                    {data.title ? <Card.Title>{data.title}</Card.Title> : <Card.Title>N/A</Card.Title>}
                    <Card.Text>
                        {data.objectDate ? <><strong>Date:</strong> {data.objectDate}</> : <><strong>Date:</strong> N/A</>}<br />
                        {data.classification ? <><strong>Classification:</strong> {data.classification}</> : <><strong>Classification:</strong> N/A</>}<br />
                        {data.medium ? <><strong>Medium:</strong> {data.medium}</> : <><strong>Medium:</strong> N/A</>}<br /><br />
                        {data.artistDisplayName ? <> <strong>Artist:</strong> {data.artistDisplayName} </> : <><strong>Artist:</strong> N/A</>}
                        {data.artistWikidata_URL ? <> (<a href={data.artistWikidata_URL} target="_blank" rel="noreferrer" >wiki</a>)</> : <></>}<br />
                        {data.creditLine ? <><strong>Credit Line:</strong> {data.creditLine} </> : <><strong>Credit Line:</strong> N/A</>}<br />
                        {data.dimensions ? <><strong>Dimensions:</strong> {data.dimensions} </> : <><strong>Dimensions:</strong> N/A</>}<br /><br />
                        <Button
                            variant={showAdded ? 'primary' : 'outline-primary'}
                            onClick={favouritesClicked}
                        >
                            + Favourite{showAdded ? ' (added)' : ''}
                        </Button>
                    </Card.Text>
                </Card.Body>
            </Card>
        </>)
    }

}