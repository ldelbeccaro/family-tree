import React from 'react'

import profileImage from '../images/profile-image.jpeg'

import '../styles/list-view-person.styl'

export default ({ person, onClickPerson }) => {
  const imageUrl = person.image ? person.image.file.url : profileImage
  return (
    <div
      className='list-view-person'
      onClick={() => onClickPerson(person.idx)}
    >
      <img className='image' src={imageUrl} alt='' />
      <div className='info-section'>
        <h3 className='info name'>{person.name}</h3>
        <p className='info'>{person.birthday}</p>
      </div>
      <div className='info-section'>
        <a href={`mailto:${person.email}`} className='info'>{person.email}</a>
        <p className='info'>{person.phone}</p>
      </div>
    </div>
  )
}
