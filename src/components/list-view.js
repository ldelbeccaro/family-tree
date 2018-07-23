import React from 'react'
import ListViewPerson from '../components/list-view-person'

const ListView = ({ people, onClickPerson }) => (
  <div className='list-view'>
    {people.map(person => {
      return (
        <ListViewPerson
          key={person.name}
          person={person}
          onClickPerson={onClickPerson}
        />
      )
    })}
  </div>
)

export default ListView
