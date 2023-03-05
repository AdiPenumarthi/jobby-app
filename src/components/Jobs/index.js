import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch, BsBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import './index.css'
import Header from '../Header'

const apiConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  noJobs: 'NIL',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    userDetails: {},
    isProfileSuccess: false,
    isProfileLoading: false,
    typeOfEmployment: [],
    salaryRange: [],
    apiStatus: apiConstants.initial,
    jobList: [],
  }

  componentDidMount() {
    this.getUserDetails()
    this.getJobs()
  }

  getUserDetails = async () => {
    this.setState({isProfileLoading: true})
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)

    if (response.ok === true) {
      const data = await response.json()
      const profileData = {
        profileDetails: data.profile_details,
      }
      const {profileDetails} = profileData
      const updatedData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }

      this.setState({
        userDetails: updatedData,
        isProfileSuccess: true,
        isProfileLoading: false,
      })
    } else if (response.status === 400) {
      this.setState({isProfileSuccess: false})
    }
  }

  getJobs = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const {typeOfEmployment, salaryRange, searchInput} = this.state
    const employmentType = typeOfEmployment.join()
    const salaryString = salaryRange.join()
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(
      ` https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryString}&search=${searchInput}`,
      options,
    )
    if (response.ok === true) {
      const data = await response.json()
      const {jobs} = data

      if (jobs.length === 0) {
        this.setState({apiStatus: apiConstants.noJobs})
        console.log(jobs)
      } else {
        const jobsList = jobs.map(eachJob => ({
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          id: eachJob.id,
          jobDescription: eachJob.job_description,
          location: eachJob.location,
          packagePerAnnum: eachJob.package_per_annum,
          rating: eachJob.rating,
          title: eachJob.title,
        }))

        this.setState({
          apiStatus: apiConstants.success,
          jobList: jobsList,
          searchInput: '',
        })
      }
    } else if (response.status === 400) {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onChangeInput = event => {
    this.setState({searchInput: event.target.value})
  }

  getSearchContainer = () => {
    const {searchInput} = this.state

    return (
      <form className="search-container" onClick={this.getJobs}>
        <input
          type="search"
          value={searchInput}
          placeholder="Search"
          onChange={this.onChangeInput}
          className="search-bar"
        />
        <button
          type="button"
          className="search-icon"
          data-testid="searchButton"
        >
          <BsSearch />
        </button>
      </form>
    )
  }

  getProfileData = () => {
    const {userDetails, isProfileLoading} = this.state
    const {name, profileImageUrl, shortBio} = userDetails

    return (
      <>
        {isProfileLoading ? (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        ) : (
          <div className="employment-container">
            <img
              src={profileImageUrl}
              alt="profile"
              className="profile-image"
            />
            <h3 className="name">{name}</h3>
            <p className="short-bio">{shortBio}</p>
          </div>
        )}
      </>
    )
  }

  getProfileFailView = () => {
    const {isProfileSuccess} = this.state

    return (
      <div className="profile-fail-view">
        <button
          type="button"
          className="retry-button"
          onClick={this.getUserDetails}
        >
          Retry
        </button>
      </div>
    )
  }

  onClickType = event => {
    const {typeOfEmployment} = this.state
    if (event.target.checked) {
      if (typeOfEmployment !== []) {
        this.setState(
          prevState => ({
            typeOfEmployment: [
              ...prevState.typeOfEmployment,
              event.target.value,
            ],
          }),
          this.getJobs,
        )
      } else {
        this.setState(
          {
            typeOfEmployment: [event.target.value],
          },
          this.getJobs,
        )
      }
    } else {
      const filteredList = typeOfEmployment.filter(
        type => type !== event.target.value,
      )
      this.setState({typeOfEmployment: filteredList}, this.getJobs)
    }
  }

  onClickSalaryRange = event => {
    this.setState(
      {
        salaryRange: [event.target.value],
      },
      this.getJobs,
    )
  }

  getJobsContainer = () => {
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
      case 'NIL':
        return (
          <div className="no-jobs-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
              className="no-jobs"
            />
            <h1 className="no-job-heading">No Jobs Found</h1>
            <p className="desc">
              We could not find any jobs. Try other filters
            </p>
          </div>
        )
      case 'SUCCESS':
        return this.successView()
      default:
        return null
    }
  }

  successView = () => {
    const {jobList} = this.state

    return (
      <ul className="jobs-list-container">
        {jobList.map(job => (
          <Link to={`/jobs/${job.id}`}>
            <li key={job.id} className="job-card">
              <div className="title-container">
                <img
                  src={job.companyLogoUrl}
                  className="company-logo"
                  alt="company logo"
                />
                <div className="job-title-card">
                  <h3 className="title">{job.title}</h3>
                  <div className="rating-container">
                    <AiFillStar className="star" />
                    <p className="rating">{job.rating}</p>
                  </div>
                </div>
              </div>
              <div className="details-container">
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
                <div className="salary-container">
                  <p className="salary">{job.packagePerAnnum}</p>
                </div>
              </div>
              <hr />
              <div className="descr-container">
                <h3 className="description-heading">Description</h3>
                <p className="description">{job.jobDescription}</p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    )
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
      <button type="button" onClick={this.getJobs} className="retry-btn">
        Retry
      </button>
    </div>
  )

  render() {
    const {employmentTypesList, salaryRangesList} = this.props
    const {isProfileSuccess} = this.state
    const profileView = isProfileSuccess
      ? this.getProfileData()
      : this.getProfileFailView()
    return (
      <div className="jobs-container">
        <Header />
        <div className="bg-container">
          <div className="inputs-container">
            <div className="search-sm">{this.getSearchContainer()}</div>
            {profileView}
            <hr />
            <ul className="employment-form-container">
              <h5 className="type-of-employment">Type of Employment</h5>
              {employmentTypesList.map(eachType => (
                <li className="type-input" key={eachType.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={eachType.employmentTypeId}
                    value={eachType.employmentTypeId}
                    onClick={this.onClickType}
                  />
                  <label htmlFor={eachType.employmentTypeId} className="label">
                    {eachType.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr />
            <ul className="salary-container">
              <h5 className="type-of-employment">Salary Range</h5>
              {salaryRangesList.map(eachType => (
                <li className="type-input" key={eachType.salaryRangeId}>
                  <input
                    type="radio"
                    name="salary"
                    id={eachType.salaryRangeId}
                    value={eachType.salaryRangeId}
                    onClick={this.onClickSalaryRange}
                  />
                  <label htmlFor={eachType.salaryRangeId} className="label">
                    {eachType.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="jobs-list-container">
            <div className="search-lg">{this.getSearchContainer()}</div>
            {this.getJobsContainer()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
