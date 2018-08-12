import React from 'react'

import AllPeopleDropdown from '../components/all-people-dropdown'
import profileImage from '../images/profile-image.jpeg'

import '../styles/edit-person.styl'

const contentful = require('contentful-management')

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_API_KEY
})

class EditPerson extends React.Component {
  constructor(props) {
    super(props)

    const person = props.person

    this.state = {
      name: person && person.name || ``,
      maidenName: person && person.maidenName || ``,
      birthday: person && person.birthday || ``,
      email: person && person.email || ``,
      phone: person && person.phone || ``,
      address: person && person.address ? person.address.childMarkdownRemark.internal.content : ``,
      mother: person && person.mother,
      father: person && person.father,
      spouse: person && person.spouse,
      children: person && person.contentfulchildren,
    }
  }

  manipulateValue(field, value) {
    if (!value) return undefined;
    switch (field) {
      case `birthday`:
        return new Date(value)
      case `mother`:
      case `father`:
      case `spouse`:
        return {
          sys: {
            id: value.id.substr(1),
            type: `Link`,
            linkType: `Entry`,
          }
        }
      case `children`:
        return value.map(child => ({
          sys: {
            id: child.id.substr(1),
            type: `Link`,
            linkType: `Entry`,
          }
        }))
      default:
        return value
    }
  }

  handleValueChange(field, val) {
    this.setState({[`${field}`]: val})
  }

  onSubmitPerson(personId, e) {
    e.preventDefault()
    personId = personId ? personId.substr(1) : undefined

    if (personId) {
      // Update entry
      window.mixpanel.track('Person Edited', {'Person Name': this.state.name})

      client.getSpace(process.env.CONTENTFUL_SPACE_ID)
        .then((space) => space.getEntry(personId))
        .then((entry) => {
          for (const key of Object.keys(this.state)) {
            if (this.state[key]) {
              const val = this.manipulateValue(key, this.state[key])
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
      window.mixpanel.track('Person Created', {'Person Name': this.state.name})

      client.getSpace(process.env.CONTENTFUL_SPACE_ID)
        .then((space) => {
          const fields = {}
          for (const key of Object.keys(this.state)) {
            if (this.state[key]) {
              const val = this.manipulateValue(key, this.state[key])
              fields[key] = {'en-US': val}
            }
          }
          return space.createEntry('person', {fields})
        })
        .then((entry) => entry.publish())
        .catch(console.error)
    }

    this.props.onClickClose()
  }

  getSelectedIds(person, field) {
    if (!person || !this.state[field]) return []
    if (this.state[field].id) {
      // one object
      return [this.state[field].id]
    }
    else {
      // array of objects
      return this.state[field].map(child => child.id)
    }
  }

  render() {
    const person = this.props.person
    const imageUrl = person && person.image ? person.image.file.url : profileImage

    return (
      <form
        className='edit-person'
        onSubmit={(e) => this.onSubmitPerson(person ? person.id : undefined, e)}
      >
        <img className='image' src={imageUrl} alt='' />
        {[`name`, `maidenName`, `birthday`, `email`, `phone`].map(field => (
          <div className='input' key={field}>
            <div className='input-label'>{field === `maidenName` ? `maiden name` : field}</div>
            <input
              name={field}
              value={this.state[field]}
              type='text'
              onChange={(e) => this.handleValueChange(field, e.target.value)}
            />
          </div>
        ))}
        <div className='input'>
          <div className='input-label'>Address</div>
          <textarea
            name='address'
            value={this.state.address}
            rows='3'
            onChange={(e) => this.handleValueChange(`address`, e.target.value)}
          ></textarea>
        </div>
        {[`mother`, `father`, `spouse`, `children`].map(field => (
          <div className='input' key={field}>
            <div className='input-label'>{field}</div>
            <AllPeopleDropdown
              people={this.props.people}
              multiSelect={field === `children`}
              fieldName={field}
              selectedPeople={this.getSelectedIds(person, field)}
              handleChange={val => this.handleValueChange(field, val)}
            />
          </div>
        ))}
        <div className='submit-container'>
          <input type='submit' value='Save' />
        </div>
      </form>
    )
  }
}

export default EditPerson
