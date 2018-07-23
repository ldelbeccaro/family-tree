import React from 'react'

import profileImage from '../images/profile-image.jpeg'

import '../styles/tree-view-person.styl'

export default ({ person, onClickPerson }) => {
  const imageUrl = person.image ? person.image.file.url : profileImage
  return (
    <div
      className='tree-view-person'
      onClick={() => onClickPerson(person.idx)}
    >
      <img className='image' src={imageUrl} alt='' />
      <div className='info-section'>
        <h3 className='info name'>{person.name}</h3>
        <p className='info'>{person.birthday}</p>
      </div>
    </div>
  )
}
