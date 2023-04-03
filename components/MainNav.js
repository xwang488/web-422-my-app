import { useAtom } from 'jotai'
import { searchHistoryAtom } from '@/store'

import { Container, Nav, Navbar, NavDropdown, Form, Button } from "react-bootstrap"
import Link from "next/link"
import { useRouter } from 'next/router'
import { useState } from "react"
import { addToHistory } from '@/lib/userData'
import { readToken, removeToken } from '@/lib/authenticate'

export default function MainNav () {
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)
    const [isExpanded, setIsExpanded] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const router = useRouter()

    let token = readToken()

    const submitForm = async (e) => {

        e.preventDefault() // prevent the browser from automatically submitting the form
        setSearchHistory(await addToHistory(`title=true&q=${searchValue}`))

        //Navigate to the redirects page
        router.push(`/artwork?title=true&q=${searchValue}`)

        setIsExpanded(false) // close the navbar after search
    }

    const handleSearchValueChange = (e) => {
        setSearchValue(e.target.value)
    }

    const handleNavbarToggle = () => {
        setIsExpanded(!isExpanded) // toggle the isExpanded value
    }

    const handleNavLinkClick = () => {
        setIsExpanded(false) // close the navbar when a nav link is clicked
    }
    const logout = () => {
        setIsExpanded(false)
        removeToken()
        router.push('/')
    }

    return (<>
        <Navbar expand="lg" className="fixed-top navbar-dark bg-primary" expanded={isExpanded}>
            <Container>
                <Navbar.Brand>Jennifer Wang</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleNavbarToggle} />
                <Navbar.Collapse id="basic-navbar-nav" className={isExpanded ? 'show' : ''}>
                    <Nav className="me-auto" onClick={handleNavLinkClick}>
                        <Link
                            href="/"
                            passHref legacyBehavior
                        >
                            <Nav.Link
                                active={router.pathname === "/"}
                                onClick={handleNavLinkClick}
                            >
                                Home
                            </Nav.Link>
                        </Link>
                        {token && <Link href="/search"
                            passHref legacyBehavior
                        >
                            <Nav.Link
                                active={router.pathname === "/search"}
                                onClick={handleNavLinkClick}
                            >
                                Advanced Search
                            </Nav.Link>
                        </Link>}

                    </Nav>

                    <Nav className="ml-auto">
                        {!token && <Link href="/login" passHref legacyBehavior><Nav.Link >Log In</Nav.Link></Link>}
                        {!token && <Link href="/register" passHref legacyBehavior><Nav.Link >Register</Nav.Link></Link>}
                    </Nav>
                    &nbsp;
                    {token && <Form onSubmit={submitForm} className="d-flex" >
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                            value={searchValue}
                            onChange={handleSearchValueChange}
                        />
                        <Button type="submit" variant="success" onClick={handleNavLinkClick}>Search</Button>
                    </Form>}

                    &nbsp;

                    {token && <Nav>
                        <NavDropdown title={token.userName} id="basic-nav-dropdown">
                            <Link
                                href="/favourites"
                                passHref legacyBehavior
                            >
                                <NavDropdown.Item
                                    active={router.pathname === "/favourites"}
                                    onClick={handleNavLinkClick}
                                >
                                    Favourite
                                </NavDropdown.Item>
                            </Link>

                            <Link
                                href="/history"
                                passHref legacyBehavior
                            >
                                <NavDropdown.Item
                                    active={router.pathname === "/history"}
                                    onClick={handleNavLinkClick}
                                >
                                    Search History
                                </NavDropdown.Item>
                            </Link>

                            <NavDropdown.Item
                                onClick={logout}
                            >
                                Logout
                            </NavDropdown.Item>

                        </NavDropdown>
                    </Nav>}

                </Navbar.Collapse>
            </Container>
        </Navbar>
        <br />
        <br />
    </>)
}