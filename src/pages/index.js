import React from 'react'

import ListView from '../components/list-view'
import TreeView from '../components/tree-view'
import FullPersonProfile from '../components/full-person-profile'

class RootIndex extends React.Component {
  constructor() {
    super()

    this.state = {
      view: `tree`,
      searchTerm: ``,
      selectedPerson: null,
    }

    this.onClickPerson = this.onClickPerson.bind(this)
    this.onClickClose = this.onClickClose.bind(this)
  }

  onClickPerson(personIdx) {
    this.setState({selectedPerson: personIdx})

    // if (typeof window !== `undefined`) {
    //   const person = this.props.data.allContentfulPerson.edges[itemIdx].node
    //   window.mixpanel.track('Person Clicked', {
    //     'Person Name': person.name,
    //     'Person Birthday': person.birthday,
    //     'Person Email': person.email,
    //   })
    // }
  }

  onClickClose() {
    // set person to default
    this.setState({selectedPerson: null})
  }

  render() {
    const people = this.props.data.allContentfulPerson.edges.map((person, idx) => {
      const indexedPerson = person.node
      indexedPerson.idx = idx
      return indexedPerson
    })
    const listView = this.state.view === `list` || !!this.state.searchTerm

    return (
      <div>
        <div className='view-selection'>
          <div
            className={`view ${this.state.view === `tree` ? `selected` : ``}`}
            onClick={() => this.setState({view: `tree`})}
            >Family Tree View</div>
          <div
            className={`view ${this.state.view === `list` ? `selected` : ``}`}
            onClick={() => this.setState({view: `list`})}
          >List View</div>
        </div>

        <input className='search-bar' value={this.state.searchTerm} />

        {this.state.selectedPerson !== null &&
          <FullPersonProfile
            person={people[this.state.selectedPerson]}
            onClickClose={this.onClickClose}
          />
        }

        <div className='header'>{!!this.state.searchTerm ? `Search` : `${this.state.view} View`}</div>

        {!listView &&
          <TreeView
            people={people}
            onClickPerson={this.onClickPerson}
          />
        }
        {listView &&
          <ListView
            people={people}
            onClickPerson={this.onClickPerson}
          />
        }
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
          address {
            childMarkdownRemark {
              html
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
