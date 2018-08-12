import React from 'react'

import ListView from '../components/list-view'
import TreeView from '../components/tree-view'
import Modal from '../components/modal'
import FullPersonProfile from '../components/full-person-profile'
import EditPerson from '../components/edit-person'

import { addHighlightAndSortInfo } from '../helpers/search'

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      view: `tree`,
      searchTerm: ``,
      selectedPerson: null,
      selectedTreePerson: null,
      editingPerson: null,
    }

    this.onClickPerson = this.onClickPerson.bind(this)
    this.onClickViewTree = this.onClickViewTree.bind(this)
    this.onClickClose = this.onClickClose.bind(this)
    this.onClickEdit = this.onClickEdit.bind(this)
    this.updateSearchTerm = this.updateSearchTerm.bind(this)
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
    this.setState({selectedPerson: null, editingPerson: null})
  }

  onClickEdit(personId) {
    this.setState({editingPerson: personId})
  }

  updateSearchTerm(e) {
    this.setState({searchTerm: e.target.value})
  }

  checkForMatches(person, searchTerm) {
    let newPerson = {...person}
    newPerson.matches = 0
    newPerson = addHighlightAndSortInfo(newPerson, searchTerm, `name`)
    if (newPerson.sortLevel) {
      newPerson.matches += 1
      newPerson.nameHighlighted = newPerson.highlighted
      newPerson.nameSortLevel = newPerson.sortLevel
    }
    newPerson = addHighlightAndSortInfo(newPerson, searchTerm, `email`)
    if (newPerson.sortLevel) {
      newPerson.matches += 1
      newPerson.emailHighlighted = newPerson.highlighted
      newPerson.emailSortLevel = newPerson.sortLevel
    }
    newPerson = addHighlightAndSortInfo(newPerson, searchTerm, `phone`)
    if (newPerson.sortLevel) {
      newPerson.matches += 1
      newPerson.phoneHighlighted = newPerson.highlighted
      newPerson.phoneSortLevel = newPerson.sortLevel
    }
    return newPerson
  }

  render() {
    const allPeople = this.props.people
      .map((person, idx) => {
        let indexedPerson = person.node
        indexedPerson.idx = idx
        if (!!this.state.searchTerm) {
          // check for matching terms
          indexedPerson = this.checkForMatches(indexedPerson, this.state.searchTerm)
        }
        return indexedPerson
      })
    const people = allPeople
      .filter(person => {
        return !this.state.searchTerm || person.matches > 0
      })
      .sort((a, b) => a.matches - b.matches)
    const peopleById = {}
    allPeople.forEach(person => {
      peopleById[person.id] = person
    })
    const listView = this.state.view === `list` || !!this.state.searchTerm

    const showModal = !!this.state.editingPerson || !!this.state.selectedPerson

    return (
      <div className='app-container'>
        <div className='site-header'>
          <div className='header-container'>
            <h1>Del Beccaro Family Tree</h1>
            <div className='nav'>
              <div className='search-bar'>
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-reactid="1001"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input value={this.state.searchTerm} onChange={this.updateSearchTerm} placeholder='Search people' />
              </div>
              <div className='view-selection'>
                <div
                  className={`view ${listView ? `` : `selected`}`}
                  onClick={() => this.setState({view: `tree`})}
                  >Family Tree View</div>
                <div
                  className={`view ${listView ? `selected` : ``}`}
                  onClick={() => this.setState({view: `list`})}
                >List View</div>
              </div>
            </div>
          </div>
        </div>

        {showModal &&
          <Modal onClickClose={this.onClickClose}>
            {!!this.state.editingPerson &&
              <div>
                <svg onClick={() => this.setState({editingPerson: null})} className="back-button" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                <EditPerson
                  people={allPeople}
                  person={peopleById[this.state.editingPerson]}
                />
              </div>
            }
            {!this.state.editingPerson && !!this.state.selectedPerson &&
              <FullPersonProfile
                person={peopleById[this.state.selectedPerson]}
                onClickViewTree={this.onClickViewTree}
                onClickPerson={this.onClickPerson}
                onClickEdit={this.onClickEdit}
              />
            }
          </Modal>
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
