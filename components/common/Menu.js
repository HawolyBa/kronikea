import Link from 'next/link'

const Menu = () => {
  return (
    <nav className="side__menu">
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/explore">Explore</Link></li>
      </ul>
    </nav>
  )
}

export default Menu