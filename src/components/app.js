import React from 'react'

import ListView from '../components/list-view'
import TreeView from '../components/tree-view'
import FullPersonProfile from '../components/full-person-profile'

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      view: `tree`,
      searchTerm: ``,
      selectedPerson: null,
      selectedTreePerson: null,
    }

    this.onClickPerson = this.onClickPerson.bind(this)
    this.onClickViewTree = this.onClickViewTree.bind(this)
    this.onClickClose = this.onClickClose.bind(this)
  }

  onClickPerson(personId) {
    this.setState({selectedPerson: personId})

    // if (typeof window !== `undefined`) {
    //   const person = this.props.people[itemIdx].node
    //   window.mixpanel.track('Person Clicked', {
    //     'Person Name': person.name,
    //     'Person Birthday': person.birthday,
    //     'Person Email': person.email,
    //   })
    // }
  }

  onClickViewTree(personId) {
    this.setState({
      view: `tree`,
      selectedTreePerson: personId,
      selectedPerson: null
    })
  }

  onClickClose() {
    // set person to default
    this.setState({selectedPerson: null})
  }

  render() {
    const people = this.props.people.map((person, idx) => {
      const indexedPerson = person.node
      indexedPerson.idx = idx
      return indexedPerson
    })
    const peopleById = {}
    people.forEach(person => {
      peopleById[person.id] = person
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

        {!!this.state.selectedPerson &&
          <FullPersonProfile
            person={peopleById[this.state.selectedPerson]}
            onClickClose={this.onClickClose}
            onClickViewTree={this.onClickViewTree}
            onClickPerson={this.onClickPerson}
          />
        }

        <div className='header'>{!!this.state.searchTerm ? `Search` : `${this.state.view} View`}</div>

        {!listView &&
          <TreeView
            people={people}
            onClickPerson={this.onClickPerson}
            onClickViewTree={this.onClickViewTree}
            selectedTreePerson={this.state.selectedTreePerson}
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

export default App
