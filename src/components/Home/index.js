import './index.css'
import {Link} from 'react-router-dom'

import Header from '../Header'

const Home = () => (
  <div className="container">
    <Header />
    <div className="home-container">
      <h1 className="heading">Find The Job That Fits Your Life</h1>
      <p className="description">
        Millions of people are searching for jobs,salary information,company
        reviews.Find the job that fit your abilities and potential
      </p>
      <Link to="/jobs">
        <button type="button" className="find-button">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)

export default Home
