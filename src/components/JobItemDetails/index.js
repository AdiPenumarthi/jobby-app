import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

import Header from '../Header'

const apiConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {jobDetails: {}, similarJobs: [], apiStatus: apiConstants.initial}

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const url = `https://apis.ccbp.in/jobs/${id}`

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const dataObj = {
        jobDetails: data.job_details,
        similarJobs: data.similar_jobs,
      }

      const dataJobDetails = dataObj.jobDetails
      const dataSimilarJobs = dataObj.similarJobs
      const skill = dataJobDetails.skills
      const lifeAtComp = dataJobDetails.life_at_company
      const updatedJobDetails = {
        companyLogoUrl: dataJobDetails.company_logo_url,
        employmentType: dataJobDetails.employment_type,
        companyWebsiteUrl: dataJobDetails.company_website_url,
        id: dataJobDetails.id,
        jobDescription: dataJobDetails.job_description,
        location: dataJobDetails.location,
        packagePerAnnum: dataJobDetails.package_per_annum,
        rating: dataJobDetails.rating,
        title: dataJobDetails.title,
        lifeAtCompany: {
          description: lifeAtComp.description,
          imageUrl: lifeAtComp.image_url,
        },
        skills: skill.map(item => ({
          name: item.name,
          imageUrl: item.image_url,
        })),
      }

      console.log(updatedJobDetails)

      const updatedSimilarJobs = dataSimilarJobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
        jobDescription: eachJob.job_description,
      }))

      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs: updatedSimilarJobs,
        apiStatus: apiConstants.success,
      })
    } else if (response.status === 400) {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  failureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        we cannot seem to find the page you are looking for.
      </p>
      <button type="button" onClick={this.getJobDetails} className="retry-btn">
        Retry
      </button>
    </div>
  )

  successView = () => {
    const {jobDetails, similarJobs} = this.state
    return (
      <div className="bg-container">
        <Header />
        <div className="details-container">
          <div className="job-details-container">
            <div className="title-container">
              <img
                src={jobDetails.companyLogoUrl}
                className="company-logo"
                alt="job details company logo"
              />
              <div className="job-title-card">
                <h3 className="title">{jobDetails.title}</h3>
                <div className="rating-container">
                  <AiFillStar className="star" />
                  <p className="rating">{jobDetails.rating}</p>
                </div>
              </div>
            </div>
            <div className="details-container">
              <div className="location-type-container">
                <div className="location-container">
                  <MdLocationOn className="icon" />
                  <p className="location">{jobDetails.location}</p>
                </div>
                <div className="type-container">
                  <BsBriefcaseFill className="icon" />
                  <p className="employment-type">{jobDetails.employmentType}</p>
                </div>
              </div>
              <div className="salary-container">
                <p className="salary">{jobDetails.packagePerAnnum}</p>
              </div>
            </div>
            <hr />
            <div className="descr-container">
              <h3 className="description-heading">Description</h3>
              <a href={jobDetails.companyWebsiteUrl}>Visit</a>
              <p className="description">{jobDetails.jobDescription}</p>
            </div>
            <ul className="skills-container">
              <h1 className="skill-heading">Skills</h1>
              {jobDetails.skills.map(skill => (
                <li className="skill-card" key={skill.name}>
                  <img
                    src={skill.imageUrl}
                    alt={skill.name}
                    className="skill-logo"
                  />
                  <p className="skill-name">{skill.name}</p>
                </li>
              ))}
            </ul>
            <div className="life-at-company-container">
              <h1 className="life-heading">Life at Company</h1>
              <p className="description">
                {jobDetails.lifeAtCompany.description}
              </p>
              <img
                src={jobDetails.lifeAtCompany.imageUrl}
                alt="life at company"
              />
            </div>
          </div>
          <div className="similar-jobs-container">
            <h1>Similar Jobs</h1>
            <ul className="jobs-container">
              {similarJobs.map(job => (
                <li key={job.id} className="job-card">
                  <div className="title-container">
                    <img
                      src={job.companyLogoUrl}
                      className="company-logo"
                      alt="similar job company logo"
                    />
                    <div className="job-title-card">
                      <h3 className="title">{job.title}</h3>
                      <div className="rating-container">
                        <AiFillStar className="star" />
                        <p className="rating">{job.rating}</p>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="descr-container">
                    <h3 className="description-heading">Description</h3>
                    <p className="description">{job.jobDescription}</p>
                  </div>
                  <div className="location-type-container">
                    <div className="location-container">
                      <MdLocationOn className="icon" />
                      <p className="location">{job.location}</p>
                    </div>
                    <div className="type-container">
                      <BsBriefcaseFill className="icon" />
                      <p className="employment-type">{job.employmentType}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case 'INPROGRESS':
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      case 'FAILURE':
        return this.failureView()
      case 'SUCCESS':
        return this.successView()
      default:
        return null
    }
  }
}

export default JobItemDetails
