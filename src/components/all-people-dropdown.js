import React from 'react'
import onClickOutside from 'react-onclickoutside'

import '../styles/all-people-dropdown.styl'

class AllPeopleDropdown extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      open: false,
      selectedPeople: props.people.filter(person => props.selectedPeople.includes(person.id)),
      searchTerm: ``,
      people: props.people,
    }

    this.onClickItem = this.onClickItem.bind(this)
    this.updateSearchTerm = this.updateSearchTerm.bind(this)
  }

  onClickItem(item) {
    this.setState(prevState => {
      const newState = {}
      if (!this.props.multiSelect) {
        newState.open = false
      }
      if (prevState.selectedPeople.map(person => person.id).includes(item.id)) {
        // de-select
        newState.selectedPeople = [...prevState.selectedPeople.filter(person => person.id !== item.id)]
      } else {
        // selecting a new person
        if (this.props.multiSelect) {
          // select additional person
          newState.selectedPeople = [...prevState.selectedPeople, item]
        } else {
          // replace selected person
          newState.selectedPeople = [item]
        }
      }
      return newState
    }, function() {
      let selectionValue = undefined
      if (this.props.multiSelect) {
        selectionValue = this.state.selectedPeople
      } else if (this.state.selectedPeople[0]) {
        selectionValue = this.state.selectedPeople[0]
      }
      this.props.handleChange(selectionValue)
    })
  }

  handleClickOutside() {
    this.setState({open: false})
  }

  updateSearchTerm(e) {
    const searchTerm = e.target.value
    this.setState({
      searchTerm,
      people: this.props.people.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()) || person.maidenName && person.maidenName.toLowerCase().includes(searchTerm.toLowerCase()))
    })
  }

  render() {
    let headerText = `-- Select ${this.props.multiSelect ? `people ` : `person`} --`
    if (this.state.selectedPeople.length === 1) headerText = this.state.selectedPeople[0].name
    else if (this.state.selectedPeople.length > 1) headerText = `${this.state.selectedPeople.length} selected`
    return (
      <div className='dropdown-wrapper'>
        <div
          className={`dropdown-header ${headerText.startsWith(`-- Select`) ? `select` : ``} ${this.state.open ? `open` : ``}`}
          onClick={() => this.setState(prevState => ({open: !prevState.open}))}
        >
          {headerText}
          <svg className='down-arrow' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        {this.state.open &&
          <ul className='dropdown-items'>
            <div className='dropdown-search-bar'>
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-reactid="1001"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input value={this.state.searchTerm} onChange={this.updateSearchTerm} placeholder='Search people' />
            </div>
            {this.state.people.map(person => (
              <li
                key={person.id}
                className={`option ${this.state.selectedPeople.map(person => person.id).includes(person.id) ? `selected` : ``}`}
                onClick={() => this.onClickItem(person)}
              >
                <div className='selected-check'>
                  {this.state.selectedPeople.map(person => person.id).includes(person.id) &&
                    <svg className='check' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  }
                </div>
                <div className='option-label'>{`${person.name}${person.maidenName ? ` (${person.maidenName})` : ``}`}</div>
              </li>
            ))}
          </ul>
        }
      </div>
    )
  }
}

export default onClickOutside(AllPeopleDropdown)
