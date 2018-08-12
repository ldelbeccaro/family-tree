import React from 'react'

import App from '../components/app'

class RootIndex extends React.Component {
  constructor() {
    super()

    this.state = {
      password: ``,
    }

    this.updatePassword = this.updatePassword.bind(this)
  }

  componentDidMount() {
    window.mixpanel.track('App Loaded')
  }

  updatePassword(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const password = formData.get(`password`)
    this.setState({password})
  }

  render() {
    // TODO: set environment password and check it here
    const passwordMet = true // this.state.password === process.env.FAMILY_PASSWORD

    return (
      <div>
        {!passwordMet &&
          <div className='password-entry'>
            {!!this.state.password &&
              <div className='error'>Wrong password</div>
            }
            <form onSubmit={this.updatePassword}>
              <div className='password-entry-label'>Enter password:</div>
              <input name='password' type='password' className='password-entry-input' />
              <input type='submit' value='Enter' />
            </form>
          </div>
        }
        {passwordMet &&
          <App people={this.props.data.allContentfulPerson.edges} />
        }
        <div className='footer'>
          Something not working? <a href='mailto:laura@lauradelbeccaro.com' onClick={() => window.mixpanel.track('Contact Laura Clicked')}>Contact Laura :)</a>
        </div>
      </div>
    )
  }
}

export default RootIndex

export const query = graphql`
  query PersonQuery {
    allContentfulPerson(sort: { fields: [birthday], order: ASC }) {
      edges {
        node {
          id
          name
          birthday(formatString: "M/D/YYYY")
          email
          phone
          maidenName
          address {
            childMarkdownRemark {
              html
              internal {
                content
              }
            }
          }
          mother {
            id
            name
          }
          father {
            id
            name
          }
          spouse {
            id
            name
          }
          contentfulchildren {
            id
            name
          }
          image {
            file {
              url
              fileName
              contentType
            }
          }
          deceased
        }
      }
    }
  }
`
