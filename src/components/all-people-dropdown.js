import React from 'react'
import onClickOutside from 'react-onclickoutside'

import '../styles/all-people-dropdown.styl'

class AllPeopleDropdown extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      open: false,
      selectedPeople: props.people.filter(person => props.selectedPeople.includes(person.id)),
    }

    this.onClickItem = this.onClickItem.bind(this)
  }

  onClickItem(item) {
    this.setState({open: false})
    if (this.state.selectedPeople.map(person => person.id).includes(item.id)) {
      // de-select
      this.setState(prevState => ({selectedPeople: [...prevState.selectedPeople.filter(person => person.id !== item.id)]}))
    } else {
      // selecting a new person
      if (this.props.multiSelect) {
        // select additional person
        this.setState(prevState => ({selectedPeople: [...prevState.selectedPeople, item]}))
      } else {
        // replace selected person
        this.setState({selectedPeople: [item]})
      }
    }
  }

  handleClickOutside() {
    this.setState({open: false})
  }

  render() {
    let headerText = `Select ${this.props.multiSelect ? `people` : `person`}`
    if (this.state.selectedPeople.length === 1) headerText = this.state.selectedPeople[0].name
    else if (this.state.selectedPeople.length > 1) headerText = `${this.state.selectedPeople.length} selected`
    return (
      <div className='dropdown-wrapper'>
        <input type='hidden' value={this.props.multiSelect ? JSON.stringify(this.state.selectedPeople.map(person => person.id)) : this.state.selectedPeople[0] && this.state.selectedPeople[0].id} name={this.props.fieldName} />
        <div
          className='dropdown-header'
          onClick={() => this.setState(prevState => ({open: !prevState.open}))}
        >{headerText}</div>
        {this.state.open &&
          <div className='dropdown-items'>
            {this.props.people.map(person => (
              <li
                key={person.id}
                onClick={() => this.onClickItem(person)}
              >
                <div className={`option ${this.state.selectedPeople.map(person => person.id).includes(person.id) ? `selected` : ``}`}></div>
                <div className='option-label'>{person.name}</div>
              </li>
            ))}
          </div>
        }
      </div>
    )
  }
}

export default onClickOutside(AllPeopleDropdown)
