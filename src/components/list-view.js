import React from 'react'
import ListViewPerson from '../components/list-view-person'

import '../styles/list-view.styl'

class ListView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      people: props.people.sort(this.sortByName),
      sort: `name`,
      sortDirection: 1,
    }
  }

  onClickSort(sort) {
    this.setState(prevState => {
      const newSortDirection = prevState.sort === sort && sort !== `upcoming birthdays` ? prevState.sortDirection * -1 : 1
      return {
        sort,
        sortDirection: newSortDirection,
        people: prevState.people.sort((a, b) => this.findSortFunction(sort, a, b) * newSortDirection)
      }
    })
  }

  findSortFunction(sort, a, b) {
    switch (sort) {
      case `name`:
        return this.sortByName(a, b)
      case `birth date`:
        return this.sortByBirthDate(a, b)
      case `upcoming birthdays`:
        return this.sortByUpcoming(a, b)
      default:
        return
    }
  }

  sortByName(a, b) {
    return a.name > b.name ? 1 : a.name < b.name ? -1 : 0
  }

  sortByBirthDate(a, b) {
    if (!a.birthday || !b.birthday) {
      return (!a.birthday ? !b.birthday ? 0 : 1 : -1)
    }
    return new Date(a.birthday) - new Date(b.birthday)
  }

  sortByUpcoming(a, b) {
    if (!a.birthday || !b.birthday) {
      return (!a.birthday ? !b.birthday ? 0 : 1 : -1)
    }
    return this.getDateDistanceFromToday(b.birthday) - this.getDateDistanceFromToday(a.birthday)
  }

  getDateDistanceFromToday(date) {
    const today = new Date()
    const distance = today - new Date(date).setFullYear(today.getFullYear())
    return distance > 0 ? distance : (distance + 31536000000) // add a year to get to last year
  }

  render() {
    const sortDirection = this.state.sortDirection === 1 ?
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg> : // up arrow
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg> // down arrow
    return (
      <div className='list-view'>
        <div className='sort'>
          <div className='sort-label'>Sort:</div>
          {[`name`, `birth date`, `upcoming birthdays`].map(sort => {
            const selected = sort === this.state.sort
            return (
              <div
                key={sort}
                className={`sort-option ${selected ? `selected` : ``}`}
                onClick={() => this.onClickSort(sort)}
              >
                <div className='sort-name'>{sort}</div>
                {sort !== `upcoming birthdays` &&
                  <div className='sort-direction'>{sortDirection}</div>
                }
              </div>
            )
          })}
        </div>
        {this.state.people.map(person => {
          return (
            <ListViewPerson
              key={person.name}
              person={person}
              onClickPerson={this.props.onClickPerson}
            />
          )
        })}
      </div>
    )
  }
}

export default ListView
