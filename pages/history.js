import { useAtom } from 'jotai'
import { searchHistoryAtom } from '@/store'
import { useRouter } from 'next/router'
// import { useState } from 'react'
import { Card, Col, Row, ListGroup, Button } from 'react-bootstrap'
import styles from '@/styles/History.module.css'
import { removeFromHistory } from '@/lib/userData'

export default function History () {
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)
    const router = useRouter()

    if (!searchHistory) return null

    let parsedHistory = []

    searchHistory.forEach(h => {
        let params = new URLSearchParams(h)
        let entries = params.entries()
        parsedHistory.push(Object.fromEntries(entries))
    })

    const historyClick = (e, index) => {
        e.stopPropagation()
        router.push(`/artwork?${searchHistory[index]}`)
    }

    const removeHistoryClicked = async (e, index) => {
        e.stopPropagation() // stop the event from trigging other events
        setSearchHistory(await removeFromHistory(searchHistory[index]))
        // setSearchHistory(current => {
        //     let x = [...current]
        //     x.splice(index, 1)
        //     return x
        // })
    }
    return (<>
        {parsedHistory.length > 0 ? (
            <ListGroup>
                {parsedHistory.map((historyItem, index) => (<>
                    <ListGroup.Item
                        key={index}
                        className={styles.historyListItem}
                        onClick={(e) => historyClick(e, index)}
                    >
                        {Object.keys(historyItem).map((key) => (
                            historyItem[key] &&
                            <>
                                {key}: <strong>{historyItem[key]}</strong>&nbsp;
                            </>
                        ))}

                        <Button
                            className="float-end"
                            variant="danger"
                            size="sm"
                            onClick={e => removeHistoryClicked(e, index)}
                        >
                            &times;
                        </Button>
                    </ListGroup.Item>
                </>))}
            </ListGroup>) :

            (<Row className="gy-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <h4>Nothing Here</h4>
                            Try searching for something else.
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            )
        }
    </>)
}