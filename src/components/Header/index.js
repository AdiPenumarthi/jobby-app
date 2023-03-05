import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <>
      <ul className="nav-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </Link>
        <div className="options-container">
          <Link to="/">
            <li className="option">Home</li>
          </Link>
          <Link to="/jobs">
            <li className="option">Jobs</li>
          </Link>
        </div>
        <li>
          <button
            type="button"
            className="logout-button"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </li>
      </ul>
      <nav className="nav-container-sm">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website-logo"
        />
        <div className="options-container">
          <Link to="/">
            <AiFillHome className="list" />
          </Link>
          <Link to="/jobs">
            <BsFillBriefcaseFill className="list" />
          </Link>
          <button type="button" className="button" onClick={onClickLogout}>
            <FiLogOut />
          </button>
        </div>
      </nav>
    </>
  )
}

export default withRouter(Header)
