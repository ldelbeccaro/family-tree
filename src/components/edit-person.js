import React from 'react'

import AllPeopleDropdown from '../components/all-people-dropdown'
import profileImage from '../images/profile-image.jpeg'

import '../styles/edit-person.styl'

const contentful = require('contentful-management')

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_API_KEY
})

const onSubmitPerson = function(personId, e) {
  e.preventDefault()
  personId = personId.substr(1)
  const formData = new FormData(e.target)

  if (personId) {
    // Update entry
    client.getSpace(process.env.CONTENTFUL_SPACE_ID)
      .then((space) => space.getEntry(personId))
      .then((entry) => {
        for (const pair of formData.entries()) {
          const key = pair[0]
          const val = pair[1]
          if (val) {
            if (key === `birthday`) {
              val = new Date(val)
            } else if ([`mother`, `father`, `spouse`].includes(key)) {
              val = {
                sys: {
                  id: val.substr(1),
                  type: 'Link',
                  linkType: 'Entry'
                }
              }
            } else if (key === `children`) {
              val = JSON.parse(val).map(child => ({
                sys: {
                  id: child.substr(1),
                  type: 'Link',
                  linkType: 'Entry'
                }
              }))
            }
            console.log(pair)
            entry.fields[key] = {...entry.fields[key]}
            entry.fields[key][`en-US`] = val
          }
        }
        return entry.update()
      })
      .then((entry) => entry.publish())
      .catch(console.error)    
  } else {
    // Create new entry
    client.getSpace(process.env.CONTENTFUL_SPACE_ID)
      .then((space) => {
        const fields = {}
        for (const pair of formData.entries()) {
          fields[pair[0]][`en-US`] = pair[1]
        }
        space.createEntry('person', {fields})
      })
      .then((entry) => entry.publish())
      .catch(console.error)
    }
}

const getSelectedIds = function(person, field) {
  if (field === `children`) field = `contentfulchildren`
  if (person[field] && person[field].id) {
    return [person[field].id]
  }
  else if (person[field])  {
    return person[field].map(child => child.id)
  } else {
    return []
  }
}

export default ({ person, people }) => {
  const imageUrl = person.image ? person.image.file.url : profileImage

  return (
    <form
      className='edit-person'
      onSubmit={(e) => onSubmitPerson(person.id, e)}
    >
      <img className='image' src={imageUrl} alt='' />
      {[`name`, `birthday`, `email`, `phone`].map(field => (
        <div className='input' key={field}>
          <div className='input-label'>{field}</div>
          <input
            name={field}
            value={person[field]}
            type='text'
          />
        </div>
      ))}
      <div className='input'>
        <div className='input-label'>Address</div>
        <textarea
          name='address'
          value={person.address ? person.address.childMarkdownRemark.internal.content : ``}
          rows='3'
        ></textarea>
      </div>
      {[`mother`, `father`, `spouse`, `children`].map(field => (
        <div className='input' key={field}>
          <div className='input-label'>{field}</div>      
          <AllPeopleDropdown
            people={people}
            multiSelect={field === `children`}
            fieldName={field}
            selectedPeople={getSelectedIds(person, field)}
          />
        </div>
      ))}
      <div className='submit-container'>
        <input type='submit' value='Save' />
      </div>
    </form>
  )
}
