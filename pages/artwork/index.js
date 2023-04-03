import validObjectIDList from '@/public/data/validObjectIDList.json'
import { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Error from 'next/error'
import { Row, Col, Card, Pagination } from "react-bootstrap"
import ArtworkCard from "@/components/ArtworkCard"

// define the "fetcher" function.  This Can also be defined globally using SWRConfig (https://swr.vercel.app/docs/global-configuration)
const fetcher = (url) => fetch(url).then((res) => res.json())

const PER_PAGE = 12

export default function ArtWork () {
    const router = useRouter()

    let finalQuery = router.asPath.split('?')[1]

    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`, fetcher)

    const [artworkList, setArtworkList] = useState(null)
    const [page, setPage] = useState(1)

    useEffect(() => {
        if (data) {
            let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x))
            let results = []
            // for (let i = 0; i < data?.objectIDs?.length; i += PER_PAGE) {
            //     const chunk = data?.objectIDs.slice(i, i + PER_PAGE)
            //     results.push(chunk)
            // }
            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE)
                results.push(chunk)
            }
            setArtworkList(results)
            setPage(1)
        }

    }, [data])

    const previousPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    const nextPage = () => {
        if (page < artworkList.length) {
            setPage(page + 1)
        }

    }

    if (error) {
        return <Error statusCode={404} />
    }
    if (!artworkList) return null

    return (
        <div className="container mt-4">

            {artworkList.length > 0 && (<Row className="gy-4">
                {artworkList[page - 1]?.map((currentObjectID) => (
                    <Col lg={3} key={currentObjectID}>
                        <ArtworkCard objectID={currentObjectID} />
                    </Col>
                ))}</Row>)}

            {artworkList.length === 0 && (<Row className="gy-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <h4>Nothing Here</h4>
                            Try searching for something else.
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            )}

            {artworkList.length > 0 && (
                <Row className="gy-4">
                    <Col xs="auto">
                        <Pagination>
                            <Pagination.Prev onClick={previousPage} />
                            <Pagination.Item>{page}</Pagination.Item>
                            <Pagination.Next onClick={nextPage} />
                        </Pagination>
                    </Col>
                </Row>
            )}
        </div>
    )
}
