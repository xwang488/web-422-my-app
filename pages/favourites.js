import { useAtom } from 'jotai'
import { favouritesAtom } from '@/store'
import { Row, Col, Card } from "react-bootstrap"
import ArtworkCard from "@/components/ArtworkCard"

export default function Favourites () {
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom)

    if (!favouritesList) return null

    return (<>
        <div className="container mt-4">
            {favouritesList.length > 0 ? (
                <Row className="gy-4">
                    {favouritesList.map((currentObjectID) => (
                        <Col lg={3} key={currentObjectID}>
                            <ArtworkCard objectID={currentObjectID} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <Row className="gy-4">
                    <Col>
                        <Card>
                            <Card.Body>
                                <h4>Nothing Here</h4>
                                Try adding some new artwork to the list.
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    </>)
}
