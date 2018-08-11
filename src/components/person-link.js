import React from 'react'

import '../styles/person-link.styl'

export default ({ person, onClickPerson }) => {
  return (
    <a
      className='person-link'
      onClick={() => onClickPerson(person.id)}
    >
      {person.name}
    </a>
  )
}
