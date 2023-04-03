import useSWR from 'swr'
import Error from 'next/error'
import Link from 'next/link'
import { Card, Button } from 'react-bootstrap'
// define the "fetcher" function.  This Can also be defined globally using SWRConfig (https://swr.vercel.app/docs/global-configuration)
const fetcher = (url) => fetch(url).then((res) => res.json())

export default function ArtworkCard (props) {

    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}`, fetcher)
    if (error) {
        return <Error statusCode={404} />
    }
    if (data) {
        return (<>
            <Card>
                {data.primaryImageSmall ? <Card.Img variant="top" src={data.primaryImageSmall} /> : <Card.Img variant="top" src='https://via.placeholder.com/375x375.png?text=[+Not+Available+]' />}

                <Card.Body>
                    {data.title ? <Card.Title>{data.title}</Card.Title> : <Card.Title>N/A</Card.Title>}
                    <Card.Text>
                        {data.objectDate ? <><strong>Date:</strong> {data.objectDate}</> : <><strong>Date:</strong> N/A</>}<br />
                        {data.classification ? <><strong>Classification:</strong> {data.classification}</> : <><strong>Classification:</strong> N/A</>}<br />
                        {data.medium ? <><strong>Medium:</strong> {data.medium}</> : <><strong>Medium:</strong> N/A</>}
                    </Card.Text>

                    <Link passHref href={`/artwork/${props.objectID}`}>
                        <Button variant="outline-primary"><strong>ID:</strong> {props.objectID}</Button>
                    </Link>
                </Card.Body>
            </Card>
        </>)
    }
}